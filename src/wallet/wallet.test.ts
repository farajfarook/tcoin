import { Transaction } from './transaction';
import { Wallet } from "."
import { TransactionPool } from './transaction-pool';

describe("Wallet", () => {
    let tp: TransactionPool
    let wallet: Wallet

    beforeEach(() => {
        tp = new TransactionPool()
        wallet = new Wallet()
    })

    describe('create a transaction', () => {
        let transaction: Transaction
        let sendAmount: number
        let recipient: string

        beforeEach(() => {
            sendAmount = 50
            recipient = 'r4nd0m-4ddr355'
            transaction = wallet.createTransaction(recipient, sendAmount, tp)
        })

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp)
            })

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.data.outputs.find(o => o.address == wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2)
            })

            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.data.outputs.filter(o => o.address == recipient).map(o => o.amount))
                    .toEqual([sendAmount, sendAmount])
            })
        })

        describe('and doing the different transaction', () => {
            let nextSendAmount: number
            beforeEach(() => {
                nextSendAmount = 10
                wallet.createTransaction(recipient, nextSendAmount, tp)
            })

            it('sum of `sendAmount` and `nextSendAmount` subtracted from the wallet balance', () => {
                expect(transaction.data.outputs.find(o => o.address == wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount - nextSendAmount)
            })

            it('values `sendAmount` and `nextSendAmount` output for the recipient', () => {
                expect(transaction.data.outputs.filter(o => o.address == recipient).map(o => o.amount).sort())
                    .toEqual([sendAmount, nextSendAmount].sort())
            })
        })
    })

})