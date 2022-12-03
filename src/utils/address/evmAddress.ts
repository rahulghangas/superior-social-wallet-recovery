import { ChainId } from "const";
import { Address, AddressInterface } from "./address";
import { ethers } from "ethers";

export const EVMAdress: AddressInterface = class EVMAdress extends Address {
  static async validate (chainId: ChainId, input: string): Promise<boolean> {
    console.log("NEAR:", input);
    return ethers.utils.isAddress(input);
  };
}
