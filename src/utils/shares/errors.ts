export class ShareError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, ShareError.prototype);
    }
}

export class EthersError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, EthersError.prototype);
    }
}