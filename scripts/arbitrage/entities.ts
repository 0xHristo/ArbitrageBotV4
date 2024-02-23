import { BigNumber } from "ethers"

export interface Token {
    readonly address: string
    readonly decimals: number
}

export interface Pair {
    readonly address: string
    reserve0: BigNumber
    reserve1: BigNumber
    readonly token0: Token
    readonly token1: Token
    readonly fee: BigNumber
    readonly precisionMultiplier: BigNumber
}

export interface Cycle {
    readonly pairs: Pair[]
    readonly initialToken: Token
}

export interface Action {
    readonly adress: string
    readonly data: string
}

export interface Arbitrage {
    readonly cycle: Cycle
    readonly amounts: BigNumber[]
}