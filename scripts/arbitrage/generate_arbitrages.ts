import { BigNumber } from "ethers"
import { calculateCycleAmountOut } from "./amounts"
import { knownPairs } from "./decode_pairs"
import { Arbitrage, Pair } from "./entities"
import { amountIn, wmatic } from "./configs"

export const getUniqueArbs = (arbs: Arbitrage[]): Arbitrage[] => {
    const uniqueArbs: Arbitrage[] = []
    const usedPairs: { [key: string]: boolean } = {}

    arbs.forEach(arb => {
        let isUnique = true
        arb.cycle.pairs.forEach(pair => {
            if (usedPairs[pair.address] != undefined) {
                isUnique = false
            }
        })

        if (isUnique) {
            uniqueArbs.push(arb)
            arb.cycle.pairs.forEach(pair => usedPairs[pair.address] = true)
        }
    })

    return uniqueArbs
}

export const addPairOfType = (pairLists: Pair[][], pairKey: string): Pair[][] => {
    let newPairLists: Pair[][] = []

    const nextPairs = knownPairs[pairKey]
    let currentMaxAmount = BigNumber.from(0)

    for (let i = 0; i < pairLists.length; i++) {
        const pairList = pairLists[i]

        for (let j = 0; j < nextPairs.length; j++) {
            const nextPair = nextPairs[j]
            const newPairsList = [...pairList, nextPair]
            const amounts = calculateCycleAmountOut({ pairs: newPairsList, initialToken: wmatic }, amountIn)

            const isNewPair = pairList.find((p) => p.address == nextPair.address)
            if (isNewPair == undefined) {
                newPairLists.push(newPairsList)
            }
        }
    }

    return newPairLists
}
