import { ChainUtil } from '../chain-util';
import { INITIAL_BALANCE } from './../config';

export class Wallet {
    balance: number = INITIAL_BALANCE
    keypair = ChainUtil.genKeyPair()
    publicKey: string

    constructor() {
        this.publicKey = this.keypair.getPublic().encode('hex', true)
    }

    toString(): string {
        return `Wallet -
    Public Key  : ${this.publicKey.toString()}
    Balance     : ${this.balance}`
    }

    sign(dataHash: string) {
        return this.keypair.sign(dataHash)
    }
}