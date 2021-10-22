import { SHA256 } from 'crypto-js'
import { DIFFICULTY } from '../config'

export class Block {
    timestamp: number
    lastHash: string
    hash: string
    data: any
    nonce: number

    constructor(timestamp: number, lashHash: string, hash: string, data: any, nonce: number) {
        this.timestamp = timestamp
        this.lastHash = lashHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
    }

    toString() {
        return `Block - 
    Timestamp: ${this.timestamp}
    Last Hash: ${this.lastHash.substring(0, 10)}
    Hash     : ${this.hash.substring(0, 10)}
    Nonce    : ${this.nonce}
    Data     : ${JSON.stringify(this.data)}`
    }

    static genesis(): Block {
        const timestamp = Date.parse('2021-10-22T00:00:00.000Z')
        let lastHash = null
        let data = null
        let nonce = 0
        return new Block(timestamp, lastHash, this.hash(timestamp, lastHash, data, nonce), data, nonce)
    }

    static mineBlock(lastBlock: Block, data: any) {
        const lastHash = lastBlock.hash
        let hash: string

        let timestamp: number
        let nonce = 0
        do {
            nonce++
            timestamp = Date.now()
            hash = this.hash(timestamp, lastHash, data, nonce)
        } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY))

        return new Block(timestamp, lastHash, hash, data, nonce)
    }

    static hash(timestamp: number, lastHash: string, data: any, nonce: number): string {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString()
    }

    static blockHash(block: Block) {
        const { timestamp, lastHash, data, nonce } = block
        return this.hash(timestamp, lastHash, data, nonce)
    }
}