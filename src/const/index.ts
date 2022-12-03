import { IMAGES } from "./images";

export const enum ChainId {
	POLYGON_ZKEVM_TESTNET = 1402,
	POLYGON_MUMBAI_TESTNET = 80001,
}

export interface NetworkDetails {
	id: ChainId;
	label: string;
	rpcUrls: string[];
	icon: string;
}

export const ChainList: ChainId[] = [
	ChainId.POLYGON_ZKEVM_TESTNET,
	ChainId.POLYGON_MUMBAI_TESTNET
];

export const ChainNetworkDetails: { [chainId in ChainId]: NetworkDetails } = {
	[ChainId.POLYGON_ZKEVM_TESTNET]: { id: ChainId.POLYGON_ZKEVM_TESTNET, label: 'Polygon ZKEVM Testnet', rpcUrls: ['https://rpc.public.zkevm-test.net'], icon: IMAGES.POLYGON_ZKEVM_LOGO },
	[ChainId.POLYGON_MUMBAI_TESTNET]: { id: ChainId.POLYGON_MUMBAI_TESTNET, label: 'Polygon Mumbai Testnet', rpcUrls: ['https://rpc-mumbai.maticvigil.com'], icon: IMAGES.POLYGON_LOGO },
}