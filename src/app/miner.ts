import { Blockchain } from "../blockchain";
import { TransactionPool, Wallet } from "../wallet";
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

    mine() {
        const validTransactions = this.transactionPool.validTransactions()
        // include a reward for the miner
        // create a block consisting of the valid transactions
        // synchronize the chains in the p2p server
        // clear the transaction pool
        // broadcast to every miner to clear their transaction pools
    }
}