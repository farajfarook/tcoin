import { MINING_REWARD } from './../config';
import { Wallet } from "./wallet"
import { ChainUtil } from "../chain-util"

export class Transaction {
    data: {
        id: string
        timestamp: number
        input: TransactionRecord
        outputs: TransactionRecord[]
    }
    signature: any

    addRecipient(senderWallet: Wallet, recipient: string, amount: number): boolean {
        if (this.data.input.address != senderWallet.publicKey) {
            console.log(`Input address is different from the wallet address`)
            return
        }
        const senderOutput = this.data.outputs.find(o => o.address == senderWallet.publicKey)
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`)
            return
        }
        senderOutput.amount = senderOutput.amount - amount
        this.data.outputs.push({ address: recipient, amount })
        Transaction.signTransaction(this, senderWallet)
    }

    static transactionWithOutput(senderWallet: Wallet, outputs: TransactionRecord[]) {
        const transaction = new Transaction()
        transaction.data = {
            id: ChainUtil.id(),
            timestamp: Date.now(),
            input: {
                amount: senderWallet.balance,
                address: senderWallet.publicKey
            },
            outputs: outputs
        }
        Transaction.signTransaction(transaction, senderWallet)
        return transaction
    }

    static newTransaction(senderWallet: Wallet, recipient: string, amount: number): Transaction {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`)
            return
        }
        return this.transactionWithOutput(senderWallet, [
            { address: senderWallet.publicKey, amount: senderWallet.balance - amount },
            { address: recipient, amount: amount }
        ])
    }

    static rewardTransaction(minerWallet: Wallet, blockchainWallet: Wallet): Transaction {
        return this.transactionWithOutput(blockchainWallet, [{
            address: minerWallet.publicKey,
            amount: MINING_REWARD
        }])
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