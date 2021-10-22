import { Block } from "./block";

describe('Block', () => {

    let data: string
    let lastBlock: Block
    let block: Block

    beforeEach(() => {
        data = 'bar'
        lastBlock = Block.genesis()
        block = Block.mineBlock(lastBlock, data)
    })

    it('set the `data` to match the given input', () => {
        expect(block.data).toEqual(data)
    })

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash)
    })

    it('generates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty))
    })

    it('lowers the difficulty for slowly mined  blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 360000))
            .toEqual(block.difficulty - 1)
    })
})