import { Transaction } from './transaction';
import { Wallet } from "."
import { MINING_REWARD } from '../config';

describe("Transaction", () => {
    let transaction: Transaction
    let wallet: Wallet
    let recipient: string
    let amount: number

    beforeEach(() => {
        wallet = new Wallet()
        amount = 50
        recipient = 'r3c1p13nt'
        transaction = Transaction.newTransaction(wallet, recipient, amount)
    })

    it('outputs the `amount` subtracted from the wallet balance', () => {
        const outputRecord = transaction.data.outputs.find(o => o.address == wallet.publicKey)
        expect(outputRecord.amount)
            .toEqual(wallet.balance - amount)
    })

    it('output the `amount` added to the recipient', () => {
        const outputRecord = transaction.data.outputs.find(o => o.address == recipient)
        expect(outputRecord.amount).toEqual(amount)
    })

    it('inputs the balance of the wallet', () => {
        expect(transaction.data.input.amount).toEqual(wallet.balance)
    })

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })

    it('invalidates a corrupt transaction', () => {
        transaction.data.outputs[0].amount = 50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    })

    describe('transacting with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 5000
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        })

        it('does not create the transaction', () => {
            expect(transaction).toEqual(undefined)
        })
    })

    describe('and add second transaction', () => {
        let nextAmount: number
        let nextRecipient: string

        beforeEach(() => {
            nextAmount = 20
            nextRecipient = 'n3xt-addr355'
            transaction.addRecipient(wallet, nextRecipient, nextAmount)
        })

        it('subtracts the next amount from the senders output', () => {
            expect(transaction.data.outputs.find(o => o.address == wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount)
        })

        it('outputs an amount for the next recipient', () => {
            expect(transaction.data.outputs.find(o => o.address == nextRecipient).amount)
                .toEqual(nextAmount)
        })
    })

    describe('create a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())
        })

        it('reward the miners wallet', () => {
            expect(transaction.data.outputs.find(o => o.address == wallet.publicKey).amount)
                .toEqual(MINING_REWARD)
        })
    })
})