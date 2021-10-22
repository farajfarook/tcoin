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
})