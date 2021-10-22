import express from 'express'
import { Blockchain } from '../blockchain'
import { P2PServer } from './p2p-server'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
const bc = new Blockchain()
const p2pServer = new P2PServer(bc)

app.use(express.json())

app.get("/", (_, res) => {
    res.json({
        "blocks": {
            "method": 'get',
            "url": "/blocks"
        },
        "mine": {
            "method": 'post',
            "url": "/mine"
        }
    })
})

app.get("/blocks", (_, res) => {
    res.json(bc.chain)
})

app.post("/mine", (req, res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    p2pServer.syncChains()

    res.json(bc.chain)
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))
p2pServer.listen()