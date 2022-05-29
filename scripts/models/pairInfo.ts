import { BigNumber } from "ethers"

export class Token {
    readonly address: string
    readonly digits: number

    constructor(address: string, digits: number) {
        this.address = address
        this.digits = digits
    }
}

export class Dex {
    readonly address: string
    readonly name: string
    readonly pairs: number

    constructor(address: string, name: string, pairs: number) {
        this.address = address
        this.name = name
        this.pairs = pairs
    }
}

export type PairInfoObject = {
    token1: Token,
    token2: Token,
    reserve1: BigNumber,
    reserve2: BigNumber,
    dex: Dex,
    address: String
}

export class PairInfo {
    readonly token1: Token
    readonly token2: Token
    readonly reserve1: BigNumber
    readonly reserve2: BigNumber
    readonly dex: Dex
    readonly priceToken1: BigNumber
    readonly priceToken2: BigNumber
    readonly address: String
    readonly k: BigNumber

    constructor(pairInfo: PairInfoObject) {
        const isBigger = pairInfo.token1.address > pairInfo.token2.address
        this.token1 = isBigger ? pairInfo.token1 : pairInfo.token2
        this.token2 = isBigger ? pairInfo.token2 : pairInfo.token1
        this.reserve1 = isBigger ? pairInfo.reserve1 : pairInfo.reserve2
        this.reserve2 = isBigger ? pairInfo.reserve2 : pairInfo.reserve1
        this.dex = pairInfo.dex
        this.address = pairInfo.address
        this.priceToken1 = this.reserve2
            .mul(BigNumber.from(10).pow(this.token1.digits))
            .div(this.reserve1)
        this.priceToken2 = this.reserve1
            .mul(BigNumber.from(10).pow(this.token2.digits))
            .div(this.reserve2)
        this.k = this.reserve1.mul(this.reserve2)
    }

    get name(): string {
        return `${this.token1.address}-${this.token2.address}`
    }
}
