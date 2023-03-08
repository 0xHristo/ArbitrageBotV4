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
    dex: string,
    address: string
}

export class PairInfo {
    readonly token1: Token
    readonly token2: Token
    readonly reserve1: BigNumber
    readonly reserve2: BigNumber
    readonly dex: string
    readonly address?: string
    readonly k: BigNumber

    constructor(pairInfo: PairInfoObject) {
        const isBigger = pairInfo.token1.address > pairInfo.token2.address
        this.token1 = isBigger ? pairInfo.token1 : pairInfo.token2
        this.token2 = isBigger ? pairInfo.token2 : pairInfo.token1
        this.reserve1 = isBigger ? pairInfo.reserve1 : pairInfo.reserve2
        this.reserve2 = isBigger ? pairInfo.reserve2 : pairInfo.reserve1
        this.dex = pairInfo.dex
        this.address = pairInfo.address
        this.k = this.reserve1.mul(this.reserve2)
    }

    static nameFor(token1: Token, token2: Token): string {
        return token1.address > token2.address ?
            `${token1.address} - ${token2.address}` :
            `${token2.address} - ${token1.address}`
    }

    get name(): string {
        return PairInfo.nameFor(this.token1, this.token2)
    }

    this(address: string): Token {
        return this.token1.address == address ? this.token1 : this.token2
    }

    other(address: string): Token {
        return this.token1.address == address ? this.token2 : this.token1
    }

    reserve(_of: string): BigNumber {
        return _of == this.token1.address ? this.reserve1 : this.reserve2
    }

    amountOutToken2(amountInToken1: BigNumber): BigNumber {
        const amountInToken1WithFee: BigNumber = amountInToken1.mul(997)
        const numerator = amountInToken1WithFee.mul(this.reserve2)
        const denominator = this.reserve1.mul(1000).add(amountInToken1WithFee)

        return numerator.div(denominator)
    }

    amountOutToken1(amountInToken2: BigNumber): BigNumber {
        const amountInToken2WithFee: BigNumber = amountInToken2.mul(997)
        const numerator = amountInToken2WithFee.mul(this.reserve1)
        const denominator = this.reserve2.mul(1000).add(amountInToken2WithFee)

        return numerator.div(denominator)
    }

    amountOut(tokenIn: string, amountIn: BigNumber): BigNumber {
        return tokenIn == this.token1.address ? this.amountOutToken2(amountIn) : this.amountOutToken1(amountIn);
    }
}

export interface Path {
    from: string;
    to: string;
}