import { Block } from "./block"

export class Blockchain {

    chain: Block[] = [Block.genesis()]

    addBlock(data: string): Block {
        const lastBlock = this.chain[this.chain.length - 1]
        const block = Block.mineBlock(lastBlock, data)
        this.chain.push(block)
        return block
    }

    isValidChain(chain: Block[]): boolean {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i]
            const lastBlock = chain[i - 1]
            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block))
                return false
        }
        return true
    }

    replaceChain(newChain: Block[]) {
        if (newChain.length <= this.chain.length) {
            console.log("Received chain is not longer than the current chain.")
            return
        } else if (!this.isValidChain(newChain)) {
            console.log("Received chain is not valid.")
            return
        }
        console.log("Replacing blockchain with the new chain.")
        this.chain = newChain
    }
}