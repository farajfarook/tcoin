import { Wallet } from "."
import { ChainUtil } from "../chain-util"

export class Transaction {
    data: {
        id: string
        timestamp: number
        input: TransactionRecord
        output: TransactionRecord[]
    }
    signature: any

    private constructor(senderWallet: Wallet) {
        this.data = {
            id: ChainUtil.id(),
            timestamp: Date.now(),
            input: {
                amount: senderWallet.balance,
                address: senderWallet.publicKey
            },
            output: [{
                amount: senderWallet.balance,
                address: senderWallet.publicKey
            }]
        }
    }

    addRecipient(senderWallet: Wallet, recipient: string, amount: number): boolean {
        if (this.data.input.address != senderWallet.publicKey) {
            console.log(`Input address is different from the wallet address`)
            return false
        }
        const senderOutput = this.data.output.find(o => o.address == senderWallet.publicKey)
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`)
            return false
        }
        senderOutput.amount = senderOutput.amount - amount
        this.data.output.push({ amount, address: recipient })
        Transaction.signTransaction(this, senderWallet)
        return true
    }

    static newTransaction(senderWallet: Wallet, recipient: string, amount: number) {
        const transaction = new Transaction(senderWallet)
        return transaction.addRecipient(senderWallet, recipient, amount)
            ? transaction
            : null
    }

    static signTransaction(transaction: Transaction, senderWallet: Wallet) {
        transaction.signature = senderWallet.sign(ChainUtil.hash(transaction.data))
    }

    static verifyTransaction(transaction: Transaction): boolean {
        return ChainUtil.verifySignature(
            transaction.data.input.address,
            transaction.signature,
            ChainUtil.hash(transaction.data))
    }
}

export interface TransactionRecord {
    amount: number
    address: string
}