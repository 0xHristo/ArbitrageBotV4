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
    dex: string,
}

export class PairInfo {
    static reserves: any //Map<string, [BigNumber, BigNumber]>
    static pairs: any //Map<string, PairInfo>

    readonly token1: Token
    readonly token2: Token
    readonly dex: string
    readonly address?: string

    constructor(pairInfo: PairInfoObject) {
        const isBigger = pairInfo.token1.address > pairInfo.token2.address
        this.token1 = isBigger ? pairInfo.token1 : pairInfo.token2
        this.token2 = isBigger ? pairInfo.token2 : pairInfo.token1
        this.dex = pairInfo.dex
    }

    static nameFor(token1: Token, token2: Token): string {
        return token1.address > token2.address ?
            `${token1.address} - ${token2.address}` :
            `${token2.address} - ${token1.address}`
    }

    get name(): string {
        return PairInfo.nameFor(this.token1, this.token2) + ` - ${this.dex}`
    }

    this(address: string): Token {
        return this.token1.address == address ? this.token1 : this.token2
    }

    other(address: string): Token {
        return this.token1.address == address ? this.token2 : this.token1
    }

    amountOutToken2(amountInToken1: BigNumber): BigNumber {
        const amountInToken1WithFee: BigNumber = amountInToken1.mul(997)
        const numerator = amountInToken1WithFee.mul(PairInfo.reserves[this.name][1])
        const denominator = PairInfo.reserves[this.name][0].mul(1000).add(amountInToken1WithFee)

        return numerator.div(denominator)
    }

    amountOutToken1(amountInToken2: BigNumber): BigNumber {
        const amountInToken2WithFee: BigNumber = amountInToken2.mul(997)
        const numerator = amountInToken2WithFee.mul(PairInfo.reserves[this.name][0])
        const denominator = PairInfo.reserves[this.name][1].mul(1000).add(amountInToken2WithFee)

        return numerator.div(denominator)
    }

    amountOut(tokenIn: string, amountIn: BigNumber, print?: boolean): BigNumber {
        if (print === true) {
            console.log(this.token1, this.token2)
            console.log(PairInfo.reserves[this.name])
            console.log(tokenIn == this.token1.address ? 2 : 1)
        }
        return tokenIn == this.token1.address ? this.amountOutToken2(amountIn) : this.amountOutToken1(amountIn)
    }
}

export interface Path {
    from: string
    to: string
}