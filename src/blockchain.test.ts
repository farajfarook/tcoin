import { Block } from "./block"
import { Blockchain } from "./blockchain"

describe("Blockchain", () => {
    let bc: Blockchain

    beforeEach(() => {
        bc = new Blockchain()
    })

    it("start with genesis block", () => {
        expect(bc.chain[0]).toEqual(Block.genesis())
    })

    it("adds a new block", () => {
        const data = 'foo'
        bc.addBlock(data)
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data)
    })
})