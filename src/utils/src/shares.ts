const sss = require("shamirs-secret-sharing");
import { ethers, utils } from 'ethers';
import { buffer } from 'stream/consumers';
import * as shamirErrors from './errors';


export function createSharesFrom(mnemonic: string, totalShares: number, threshold: number)
: {
    shares: Array<Buffer>,
    err?: Error
}{
    if(!utils.isValidMnemonic(mnemonic)) {
        return {shares: [], err: new shamirErrors.ShareError('invalid secret')};
    }

    const shares: Array<Buffer> = sss.split(mnemonic, {shares: totalShares, threshold: threshold});

    return {
        shares: shares
    };
}

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