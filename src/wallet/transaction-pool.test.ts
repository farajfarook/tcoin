import { Transaction } from './transaction';
import { Wallet } from "."
import { TransactionPool } from './transaction-pool';

describe("Transaction Pool", () => {
    let tp: TransactionPool
    let wallet: Wallet
    let transaction: Transaction

    beforeEach(() => {
        tp = new TransactionPool()
        wallet = new Wallet()
        const amount = 50
        const recipient = 'r3c1p13nt'
        transaction = Transaction.newTransaction(wallet, recipient, amount)
        tp.addOrUpdate(transaction)
    })

    it('adds a transaction to the pool', () => {
        expect(tp.transactions.find(t => t.data.id == transaction.data.id))
            .toEqual(transaction)
    })

    it('updates a transaction in the pool', () => {
        const oldSignature = transaction.signature
        transaction.addRecipient(wallet, "foo-4ddr355", 40)
        tp.addOrUpdate(transaction)

        expect(tp.transactions.find(t => t.data.id == transaction.data.id).signature)
            .not.toEqual(oldSignature)
    })
})