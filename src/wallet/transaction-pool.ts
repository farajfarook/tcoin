import { Transaction } from ".";

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
}