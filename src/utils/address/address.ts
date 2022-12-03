import { ChainId } from "const";

export abstract class  Address {
	static regexp: RegExp;
	static  minLength: number;
	static maxLength: number;
}

export interface AddressInterface {
	validate: (chainId: ChainId, input: string) => Promise<boolean>;
}