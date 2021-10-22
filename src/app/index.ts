import express from 'express'
import { Blockchain } from '../blockchain'
import { TransactionPool, Wallet } from '../wallet'
import { P2PServer } from './p2p-server'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
const bc = new Blockchain()
const wallet = new Wallet()
const tp = new TransactionPool()
const p2pServer = new P2PServer(bc, tp)

app.use(express.json())

app.get("/", (_, res) => {
    res.json({
        "list blocks": {
            "method": 'get',
            "url": "/blocks"
        },
        "mine block": {
            "method": 'post',
            "url": "/blocks"
        },
        "list transaction": {
            "method": 'get',
            "url": "/transactions"
        },
        "add transaction": {
            "method": 'post',
            "url": "/transactions"
        }
    })
})

app.get("/blocks", (_, res) => {
    res.json(bc.chain)
})

app.post("/blocks", (req, res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    p2pServer.syncChains()

    res.json(bc.chain)
})

app.get("/transactions", (_, res) => {
    res.json(tp.transactions)
})

app.post("/transactions", (req, res) => {
    const { recipient, amount } = req.body
    const transaction = wallet.createTransaction(recipient, amount, tp)
    p2pServer.broadcastTransaction(transaction)
    res.json(tp.transactions)
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))
p2pServer.listen()