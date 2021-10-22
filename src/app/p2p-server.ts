import { Server, WebSocket } from "ws"
import { Blockchain } from "../blockchain"
import { Transaction, TransactionPool } from "../wallet"

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
}
export class P2PServer {
    blockchain: Blockchain
    transactionPool: TransactionPool
    sockets: WebSocket[] = []

    constructor(blockchain: Blockchain, transactionPool: TransactionPool) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
    }

    listen() {
        const server = new Server({ port: P2P_PORT })
        server.on('connection', socket => this.connectSocket(socket))

        this.connectToPeers();

        console.log(`Listening for P2P connections on: ${P2P_PORT}`)
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new WebSocket(peer)
            socket.on('open', () => this.connectSocket(socket))
        })
    }

    connectSocket(socket: WebSocket) {
        this.sockets.push(socket)
        console.log('Socket connected')

        this.messageHandler(socket)
        this.sendChain(socket)
    }

    messageHandler(socket: WebSocket) {
        socket.on('message', message => {
            const { type, data } = JSON.parse(message.toString())
            switch (type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data)
                    break
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.addOrUpdate(data)
            }
        })
    }

    sendChain(socket: WebSocket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            data: this.blockchain.chain
        }))
    }

    sendTransaction(socket: WebSocket, transaction: Transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            data: transaction
        }))
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket))
    }

    broadcastTransaction(transaction: Transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction))
    }
}