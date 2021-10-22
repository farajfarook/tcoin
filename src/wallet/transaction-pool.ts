import { Transaction } from "./transaction";

export class TransactionPool {
    transactions: Transaction[] = []

    addOrUpdate(transaction: Transaction) {
        let currentTransaction = this.transactions.find(t => t.data.id == transaction.data.id)
        if (currentTransaction) {
            const index = this.transactions.indexOf(currentTransaction)
            this.transactions[index] = transaction
        } else {
            this.transactions.push(transaction)
        }
    }

    existingTransaction(publicKey: string): Transaction {
        return this.transactions.find(t => t.data.input.address == publicKey)
    }

    validTransactions(): Transaction[] {
        return this.transactions.filter(transaction => {
            const { input, outputs } = transaction.data
            const outputTotal = outputs.reduce((total, output) => total + output.amount, 0)
            if (input.amount != outputTotal) {
                console.log(`Invalid transaction from ${input.address}`)
                return
            }
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${input.address}`)
                return
            }
            return true
        })
    }
}