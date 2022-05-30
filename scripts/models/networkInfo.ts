import { CycleInfo } from "./cycleInfo"
import { Market } from "./marketInfo"
import { PairInfo, Token } from "./pairInfo"

export class NetworkInfo {
    readonly initialToken: Token
    readonly markets: Map<string, Market> = new Map()
    readonly tokens: Set<Token> = new Set()
    readonly marketsByPair: Map<string, Market> = new Map()

    constructor(initialToken: Token, pairs: PairInfo[]) {
        this.initialToken = initialToken
        pairs.forEach(pair => {
            let marketToken1: Market | undefined = this.markets.get(pair.token1.address)
            if (marketToken1 === undefined) {
                marketToken1 = new Market(pair.name)
                this.markets.set(pair.token1.address, marketToken1)
            }

            let marketToken2: Market | undefined = this.markets.get(pair.token2.address)
            if (marketToken2 === undefined) {
                marketToken2 = new Market(pair.name)
                this.markets.set(pair.token2.address, marketToken2)
            }

            let marketPair: Market | undefined = this.marketsByPair.get(pair.name)
            if (marketPair === undefined) {
                marketPair = new Market(pair.name)
                this.marketsByPair.set(pair.name, marketToken2)
            }

            marketPair.push(pair)
            marketToken1.push(pair)
            marketToken2.push(pair)
            this.tokens.add(pair.token1)
            this.tokens.add(pair.token2)
        })
    }

    createCycles = (): CycleInfo[] => {
        let cycles: CycleInfo[] = []
        const initialTokenMarket = this.markets.get(this.initialToken.address)
        if (initialTokenMarket !== undefined) {
            for (let i = 0; i < initialTokenMarket.pairs.length; i++) {
                const firstPair = initialTokenMarket.pairs[i]
                const secondToken = firstPair.other(this.initialToken.address)
                const secondTokenMarket = this.markets.get(secondToken.address)
                if (secondTokenMarket !== undefined) {
                    for (let j = 0; j < secondTokenMarket.pairs.length; j++) {
                        const secondPair = secondTokenMarket.pairs[j]
                        const thirdToken = secondPair.other(secondToken.address)
                        if (thirdToken.address != this.initialToken.address) {
                            const thirdTokenMarket = this.marketsByPair.get(PairInfo.nameFor(thirdToken, secondToken))
                            if (thirdTokenMarket !== undefined) {
                                for (let k = 0; k < thirdTokenMarket.pairs.length; k++) {
                                    const thirdPair = thirdTokenMarket.pairs[k]
                                    cycles.push(
                                        new CycleInfo(this.initialToken,
                                            [
                                                firstPair,
                                                secondPair,
                                                thirdPair,
                                                firstPair
                                            ])
                                    )
                                }
                            }


                        }
                    }
                }
            }
        }

        return cycles
    }
}