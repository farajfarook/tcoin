import { Server, WebSocket } from "ws"
import { Blockchain } from "../blockchain"

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

export class P2PServer {
    blockchain: Blockchain
    sockets: WebSocket[] = []

    constructor(blockchain: Blockchain) {
        this.blockchain = blockchain
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
            const chain = JSON.parse(message.toString())
            this.blockchain.replaceChain(chain)
        })
    }

    sendChain(socket: WebSocket) {
        socket.send(JSON.stringify(this.blockchain.chain))
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket))
    }
}