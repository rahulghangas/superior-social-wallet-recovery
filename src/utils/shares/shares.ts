const sss = require("shamirs-secret-sharing");
import { NetworkDetails } from 'const';
import { ethers, utils } from 'ethers';
import * as shamirErrors from './errors';
import { encrypt } from '@metamask/eth-sig-util';
const ascii85 = require('ascii85');
const fs = require("fs");
import path from 'path';
import { PROJECT_DIR } from '../../../settings';
const snarkjs =  require('./snarkjs.min.js');

export function decodeSecretAndVerify(shares: Array<string | Buffer>, address: string)
: {
    secret?: string,
    err?: Error
}{
    const secret: Buffer = sss.combine(shares);
    const mnemonic = secret.toString();
    if(!utils.isValidMnemonic(mnemonic)) {
        return {err: new shamirErrors.ShareError('invalid secret decoded')};
    }
    const hdnode = utils.HDNode.fromMnemonic(mnemonic);
    
    if(!utils.isAddress(address)) {
        return {err: new shamirErrors.EthersError('invalid address provided')};
    }

    if (address != hdnode.address) {
        return {err: new shamirErrors.ShareError('secret recovered has invalid address')};
    }

    return {secret: secret.toString()}
}

function encryptData(keyB64: string, data: Buffer): number[] {
    // This code is thanks to Břetislav Hájek
    // https://betterprogramming.pub/exchanging-encrypted-data-on-blockchain-using-metamask-a2e65a9a896c

    const publicKey = Buffer.from(keyB64, 'base64');
    const enc = encrypt({
      publicKey: publicKey.toString('base64'),
      data: ascii85.encode(data).toString(),
      version: 'x25519-xsalsa20-poly1305',
    });
  
    const buf = Buffer.concat([
      Buffer.from(enc.ephemPublicKey, 'base64'),
      Buffer.from(enc.nonce, 'base64'),
      Buffer.from(enc.ciphertext, 'base64'),
    ]);
    
    return buf.toJSON().data;
  }

async function decryptData(account: string, data: Buffer): Promise<Buffer> {
    // This code is thanks to Břetislav Hájek
    // https://betterprogramming.pub/exchanging-encrypted-data-on-blockchain-using-metamask-a2e65a9a896c

    const structuredData = {
      version: 'x25519-xsalsa20-poly1305',
      ephemPublicKey: data.slice(0, 32).toString('base64'),
      nonce: data.slice(32, 56).toString('base64'),
      ciphertext: data.slice(56).toString('base64'),
    };
    const ct = `0x${Buffer.from(JSON.stringify(structuredData), 'utf8').toString('hex')}`;
    const decrypt = await window.ethereum.request({
      method: 'eth_decrypt',
      params: [ct, account],
    });
    return ascii85.decode(decrypt);
  }

export async function executeShareEncryption(mnemonic: string, pubkey1: string, pubkey2: string, schema: string, sourceChain: NetworkDetails): Promise<{encryptedShares: Array<Array<number>>, networkShare: Buffer}> {
    console.log("Trying to crteaty shares");

    let shares: Array<Buffer>;
    try {
        shares = sss.split(mnemonic, {shares: 3, threshold: 2});
    } catch(err) {
        throw Error("failed to create shares: " + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    }

    let encryptedShare1, encryptedShares2: number[]; 
    try {
        encryptedShare1 = encryptData(pubkey1, shares[0]);
        encryptedShares2 = encryptData(pubkey2, shares[1]);
    } catch (err) {
        throw Error("failed to encrypt shares: " + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    }
    const encryptedShares = [encryptedShare1, encryptedShares2];

    return {encryptedShares, networkShare: shares[2]};
}

function buffer2bits(buff: Buffer): number[] {
    const res : number[] = [];
    for (let i=0; i<buff.length; i++) {
        for (let j=0; j<8; j++) {
            if ((buff[i]>>j)&1) {
                res.push(1);
            } else {
                res.push(0);
            }
        }
    }
    return res;
}

export async function createProof(schema: string): Promise<{proof: any, publicSignals: number[]}> {
    const schemaObject = JSON.parse(schema);
    let valuesAsString = '';
    for (const key in schemaObject) {
        valuesAsString += String(schemaObject[key]);
    }

    let buf = Buffer.from(valuesAsString);
    if (buf.length > 32) {
        buf = buf.slice(0, 32);
    } else {
        buf = Buffer.concat([buf, Buffer.alloc(32 - buf.length)]);
    }

    const bits = buffer2bits(buf);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve({in: bits}, "main.wasm", "recovery_0001.zkey");

    const vKey = await fetch("verification_key.json").then( function(res) {
        return res.json();
    });;

    try {
        const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        if (!res) {
            throw Error("proof verification failed");
        }
    } catch (err) {
        throw Error("failed to verify proof: " + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    }

    return {proof, publicSignals};
}