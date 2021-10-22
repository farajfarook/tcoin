import express from 'express'
import { Blockchain } from '../blockchain'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
const bc = new Blockchain()

app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        "blocks": "/blocks"
    })
})

app.get("/blocks", (_, res) => {
    res.json(bc.chain)
})

app.post("/mine", (req, res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)
    res.json(bc.chain)
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))