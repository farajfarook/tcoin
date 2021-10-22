import { ChainUtil } from '../chain-util'
import { DIFFICULTY, MINE_RATE } from '../config'

export class Block {
    timestamp: number
    lastHash: string
    hash: string
    data: any
    nonce: number
    difficulty: number

    constructor(timestamp: number, lashHash: string, hash: string, data: any, nonce: number, difficulty: number) {
        this.timestamp = timestamp
        this.lastHash = lashHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty || DIFFICULTY
    }

    toString() {
        return `Block - 
    Timestamp   : ${this.timestamp}
    Last Hash   : ${this.lastHash.substring(0, 10)}
    Hash        : ${this.hash.substring(0, 10)}
    Nonce       : ${this.nonce}
    Difficulty  : ${this.difficulty}
    Data        : ${JSON.stringify(this.data)}`
    }

    static genesis(): Block {
        const timestamp = Date.parse('2021-10-22T00:00:00.000Z')
        let lastHash = null
        let data = null
        const nonce = 0
        const difficulty = DIFFICULTY
        const hash = this.hash(timestamp, lastHash, data, nonce, difficulty)
        return new Block(timestamp, lastHash, hash, data, nonce, difficulty)
    }

    static mineBlock(lastBlock: Block, data: any): Block {
        const lastHash = lastBlock.hash

        let difficulty: number
        let timestamp: number
        let hash: string
        let nonce = 0

        const startTime = Date.now()
        do {
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            hash = this.hash(timestamp, lastHash, data, nonce, difficulty)
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

        console.log(`Mining took ${timestamp - startTime} seconds`)

        return new Block(timestamp, lastHash, hash, data, nonce, difficulty)
    }

    static adjustDifficulty(lastBlock: Block, currentTime: number): number {
        let { difficulty } = lastBlock
        return lastBlock.timestamp + MINE_RATE > currentTime
            ? difficulty + 1
            : difficulty - 1
    }

    static hash(timestamp: number, lastHash: string, data: any, nonce: number, difficulty: number): string {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
    }

    static blockHash(block: Block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block
        return this.hash(timestamp, lastHash, data, nonce, difficulty)
    }
}