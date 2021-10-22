import { Block, Blockchain } from "../blockchain";
import { Transaction, TransactionPool, Wallet } from "../wallet";
import { P2PServer } from "./p2p-server";

export class Miner {
    blockchain: Blockchain
    transactionPool: TransactionPool
    wallet: Wallet
    p2pServer: P2PServer

    constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: Wallet, p2pServer: P2PServer) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.p2pServer = p2pServer
    }

    mine(): Block {
        const validTransactions = this.transactionPool.validTransactions()
        // include a reward for the miner
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))
        // create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(JSON.stringify(validTransactions))
        // synchronize the chains in the p2p server
        this.p2pServer.syncChains()
        // clear the transaction pool
        this.transactionPool.clear()
        // broadcast to every miner to clear their transaction pools
        this.p2pServer.broadcastClearTransactions()

        return block
    }

}