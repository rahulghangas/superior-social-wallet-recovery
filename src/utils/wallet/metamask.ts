import { ChainId } from "const";
import { ethers, utils } from "ethers";
import { WalletWrapper } from "./wallet";
import detectEthereumProvider from "@metamask/detect-provider";
import BigNumber from "bignumber.js";
import { ZERO_BIGNUM } from "const/number";


export class Metamask implements WalletWrapper {
    chainId: ChainId;
    provider!: ethers.providers.Web3Provider;
    connected: boolean = false;
    balance: BigNumber = ZERO_BIGNUM;
    currentNetwork!: string;

    constructor(chainId: ChainId) {
        this.chainId = chainId;
    }
    
    async getNetworkId(): Promise<string> {
        if (this.currentNetwork) {
            return this.currentNetwork;
        } else {
            throw new Error("Not connected");
        }
    }

    async getBalance(): Promise<{ amount: BigNumber; decimal: number; }> {
        return {amount: this.balance, decimal: 18};
    }

    async isConnected(): Promise<boolean> {
        return this.connected;
    }
    
    async connect(): Promise<void> {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        }

        const handleAccountsChanged = (accounts: any[]) => {
            if (accounts.length === 0) {
                this.connected = false;
            } else {
                this.connected = true;
            }

            this.provider.listAccounts().then((accounts) => {
                if (accounts.length !== 0) {
                    this.provider.getBalance(accounts[0]).then((balance) => {
                        this.balance = new BigNumber(utils.formatEther(balance));
                    });
                } else {
                    this.balance = ZERO_BIGNUM;
                }
            });
        };

        const handleBalanceChanged = () => {
            this.provider.listAccounts().then((accounts) => {
                if (accounts.length !== 0) {
                    this.provider.getBalance(accounts[0]).then((balance) => {
                        this.balance = new BigNumber(utils.formatEther(balance));
                    });
                } else {
                    this.balance = ZERO_BIGNUM;
                }
            });
        }

        const handleNetworkChanged = (networkId) => {
            this.currentNetwork = networkId;
        }

        try {
            detectEthereumProvider().then((provider) => {
                if (provider && provider.isMetaMask) {
                    this.provider =  new ethers.providers.Web3Provider(provider);
                    provider.on('accountsChanged', handleAccountsChanged);
                    provider.on('block', handleBalanceChanged);
                    provider.on('networkChanged', handleNetworkChanged);

                    this.provider.listAccounts().then(async (accounts: any[]) => {
                        if (accounts.length === 0) {
                            await this.provider.send("eth_requestAccounts", []);
                        } else {
                            this.connected = true;
                        }
                    });

                    this.provider.listAccounts().then((accounts) => {
                        if (accounts.length !== 0) {
                            this.provider.getBalance(accounts[0]).then((balance) => {
                                this.balance = new BigNumber(utils.formatEther(balance));
                            });
                        } else {
                            this.balance = ZERO_BIGNUM;
                        }
                    });

                    this.provider.getNetwork().then((network) => {
                        this.currentNetwork = network.chainId.toString();
                    });
                    
                } else {
                    window.open('https://metamask.io/', '_blank');
                }
            })
        } catch(e) {
            throw e;
        }
    }

    async signAndBroadcast(...args: any[]) {
        throw new Error("Method not implemented.");
    }
    
    async disconnect() {
    }
    
}