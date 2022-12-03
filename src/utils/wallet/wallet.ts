import BigNumber from 'bignumber.js';
import { ChainId } from 'const';

export interface WalletWrapper {
  isConnected(): Promise<boolean>
  connect(): Promise<void>
  signAndBroadcast(...args)
  disconnect()
  getBalance(): Promise<{amount: BigNumber, decimal: number}>
  getNetworkId(): Promise<string>
}