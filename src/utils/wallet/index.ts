import { ChainId } from "const";
import { Metamask } from "./metamask";
import { WalletWrapper } from "./wallet";

const Wallets: { [chainId in ChainId]: WalletWrapper } = {
  [ChainId.POLYGON_ZKEVM_TESTNET]: new Metamask(ChainId.POLYGON_ZKEVM_TESTNET),
  [ChainId.POLYGON_MUMBAI_TESTNET]: new Metamask(ChainId.POLYGON_MUMBAI_TESTNET),
}

export default Wallets;