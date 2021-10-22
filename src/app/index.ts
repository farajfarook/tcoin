import express from 'express'
import { Blockchain } from '../blockchain'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
const bc = new Blockchain()

app.get("/", (req, res) => {
    res.json({
        "blocks": "/blocks"
    })
})

app.get("/blocks", (req, res) => {
    res.json(bc.chain)
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))