import { SHA256 } from 'crypto-js'

export class Block {
    timestamp: number
    lastHash: string
    hash: string
    data: string

    constructor(timestamp: number, lashHash: string, hash: string, data: string) {
        this.timestamp = timestamp
        this.lastHash = lashHash
        this.hash = hash
        this.data = data
    }

    toString() {
        return `Block - 
    Timestamp: ${this.timestamp}
    Last Hash: ${this.lastHash.substring(0, 10)}
    Hash     : ${this.hash.substring(0, 10)}
    Data     : ${this.data}`
    }

    static genesis(): Block {
        const timestamp = Date.parse('21/10/2021')
        let lastHash = null
        let data = null
        return new Block(timestamp, lastHash, this.hash(timestamp, lastHash, data), data)
    }

    static mineBlock(lastBlock: Block, data: any) {
        const timestamp = Date.now()
        const lastHash = lastBlock.hash
        const hash = this.hash(timestamp, lastHash, data)
        return new Block(timestamp, lastHash, hash, data)
    }

    static hash(timestamp: number, lastHash: string, data: string): string {
        return SHA256(`${timestamp}${lastHash}${data}`).toString()
    }

    static blockHash(block: Block) {
        const { timestamp, lastHash, data } = block
        return this.hash(timestamp, lastHash, data)
    }
}