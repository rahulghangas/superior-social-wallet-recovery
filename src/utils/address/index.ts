import { ChainId } from "const";
import { EVMAdress } from "./evmAddress";

const AddressValidators: { [chainId in ChainId]: (chainId: ChainId, input: string) => Promise<boolean> } = {
  [ChainId.POLYGON_ZKEVM_TESTNET]: EVMAdress.validate,
  [ChainId.POLYGON_MUMBAI_TESTNET]: EVMAdress.validate,
}

export default AddressValidators;