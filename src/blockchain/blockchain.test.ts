import { Block } from "./block"
import { Blockchain } from "./blockchain"

describe("Blockchain", () => {
    let bc: Blockchain
    let bc2: Blockchain

    beforeEach(() => {
        bc = new Blockchain()
        bc2 = new Blockchain()
    })

    it("start with genesis block", () => {
        expect(bc.chain[0]).toEqual(Block.genesis())
    })

    it("adds a new block", () => {
        const data = 'foo'
        bc.addBlock(data)
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data)
    })

    it('validates a valid chain', () => {
        bc2.addBlock("foo")
        const isValid = bc.isValidChain(bc2.chain)
        expect(isValid).toBe(true)
    })

    it('invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = "bad data"
        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('invalidates a corrupt chain', () => {
        bc2.addBlock("foo")
        bc2.chain[1].data = "not foo"
        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('replaces the chain wih valid chain', () => {
        bc2.addBlock("doo")
        bc.replaceChain(bc2.chain)
        expect(bc.chain).toEqual(bc2.chain)
    })

    it("doesn't replaces the chain with one if less than length", () => {
        bc.addBlock("foo")
        bc.replaceChain(bc2.chain)
        expect(bc.chain).not.toEqual(bc2.chain)
    })

    it("doesn't replaces the chain with one if equal length", () => {
        bc.addBlock("foo")
        bc2.addBlock("boo")
        bc.replaceChain(bc2.chain)
        expect(bc.chain).not.toEqual(bc2.chain)
    })

})