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
        transaction = wallet.createTransaction(recipient, amount, tp)
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

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions: Transaction[]

        beforeEach(() => {
            validTransactions = [...tp.transactions]
            for (let i = 0; i < 6; i++) {
                wallet = new Wallet()
                transaction = wallet.createTransaction('foo-4ddr355', 30, tp)
                if (i % 2 == 0) {
                    transaction.data.input.amount = 999999
                } else {
                    validTransactions.push(transaction)
                }
            }
        })

        it('shows a different between valid and corrupt transactions', () => {
            expect(tp.transactions).not.toEqual(validTransactions)
        })

        it('grabs valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions)
        })
    })
})