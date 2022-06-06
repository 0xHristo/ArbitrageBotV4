import { off } from "process"
import { CycleInfo } from "./cycleInfo"
import { Market } from "./marketInfo"
import { PairInfo, Token } from "./pairInfo"

export class NetworkInfo {
    public readonly initialToken: Token
    public readonly markets: Map<string, Market> = new Map()
    public readonly tokens: Set<Token> = new Set()
    public readonly marketsByPair: Map<string, PairInfo[]> = new Map()

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

            let marketPair: PairInfo[] | undefined = this.marketsByPair.get(pair.name)
            if (marketPair === undefined) {
                this.marketsByPair.set(pair.name, [ ])
            } else {
                marketPair.push(pair)
            }

            marketToken1.push(pair)
            marketToken2.push(pair)
            this.tokens.add(pair.token1)
            this.tokens.add(pair.token2)
        })
    }

    createCycles = (): CycleInfo[] => {
        let cycles: CycleInfo[] = []
        let a = 1
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
                            const thirdTokenMarket = this.markets.get(thirdToken.address)
                            if (thirdTokenMarket !== undefined) {
                                for (let k = 0; k < thirdTokenMarket.pairs.length; k++) {
                                    const thirdPair = thirdTokenMarket.pairs[k]
                                    // if (a === 1 && thirdPair.name === "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063 - 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619") {
                                    //     a = 0
                                    //     console.log(thirdToken.address)
                                    //     console.log(thirdPair.other(thirdToken.address))
                                    //     console.log(this.marketsByPair.get(PairInfo.nameFor(thirdPair.other(thirdToken.address), this.initialToken)))
                                    // }
                                    const fourthToken = thirdPair.other(thirdToken.address)
                                    if (fourthToken.address != secondToken.address && fourthToken.address != this.initialToken.address) {
                                        const fourthTokenMarket = this.marketsByPair.get(PairInfo.nameFor(fourthToken, this.initialToken))
                                        if (fourthTokenMarket != undefined && fourthTokenMarket.length > 0) {
                                            const fourthPair = fourthTokenMarket[0]
                                            cycles.push(
                                                new CycleInfo(this.initialToken,
                                                    [
                                                        firstPair,
                                                        secondPair,
                                                        thirdPair,
                                                        fourthPair
                                                    ])
                                            )
                                        }
                                    }
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