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

    crossPairs(): Arbitrage | undefined {
        for (let i = 0; i < this.pairs.length; i++) {
            const pairA = this.pairs[i];
            for (let j = 0; j < this.pairs.length; j++) {
                const pairB = this.pairs[j];
                if(pairB.priceToken1 > pairA.priceToken1) {
                    const optimalQuantityA = pairA.reserve1.pow(2).sub(pairA.k.div(pairB.priceToken1))

                    // const optimalQuantityB = pairA.k.div(pairA.reserve1.sub(optimalQuantityA)).sub(pairA.reserve2)
                    console.log(optimalQuantityA)
                    return {
                        dexes: [pairA.dex.address, pairB.dex.address],
                        paths: [
                            [pairA.token1.address, pairA.token2.address],
                            [pairA.token2.address, pairA.token1.address],
                        ],
                        amountIn: sqrt(optimalQuantityA)
                    }
                }
            }
        }
    }
}

export type Arbitrage = {
    dexes: string[]
    paths: string[][]
    amountIn: BigNumber
}