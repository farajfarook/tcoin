import { Transaction } from '.';
import { ChainUtil } from '../chain-util';
import { INITIAL_BALANCE } from './../config';
import { TransactionPool } from './transaction-pool';

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

    createTransaction(recipient: string, amount: number, transactionPool: TransactionPool): Transaction {
        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds the current balance: ${this.balance}`)
            return
        }
        let transaction = transactionPool.existingTransaction(this.publicKey)
        if (transaction) {
            transaction.addRecipient(this, recipient, amount)
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount)
            transactionPool.addOrUpdate(transaction)
        }
        return transaction
    }
}