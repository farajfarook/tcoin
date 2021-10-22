import { Block } from "./block"

export class Blockchain {

    chain: Block[] = [Block.genesis()]

    addBlock(data: string): Block {
        const lastBlock = this.chain[this.chain.length - 1]
        const block = Block.mineBlock(lastBlock, data)
        this.chain.push(block)
        return block
    }
}