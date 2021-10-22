import { SHA256 } from 'crypto-js';
import { ec, SignatureInput } from 'elliptic'
import { v4 } from 'uuid'
const sec = new ec('secp256k1')

export class ChainUtil {
    static genKeyPair(): ec.KeyPair {
        return sec.genKeyPair()
    }

    static id(): string {
        return v4()
    }

    static hash(data: any): string {
        return SHA256(JSON.stringify(data)).toString()
    }

    static verifySignature(publicKey: string, signature: SignatureInput, dataHash: string): boolean {
        return sec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)
    }
}