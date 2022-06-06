import { BigNumber } from "ethers"
import { type } from "os"
import { sqrt } from "../math/sqrt"
import { PairInfo } from "./pairInfo"



export class Market {
    readonly name: string
    readonly pairs: PairInfo[] = []
    constructor(name: string) {
        this.name = name
    }

    push(pair: PairInfo) {
        this.pairs.push(pair)
    }
}

export type Arbitrage = {
    dexes: string[]
    paths: string[][]
    amountIn: BigNumber
}