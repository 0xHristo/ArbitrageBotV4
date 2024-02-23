import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory } from "../../typechain"
import { ExchangeExtractor } from "../../tokens/ExchangeExtractor"
import { Pair } from "./entities"

export const updatePairReservs = async (pairs: Pair[]): Promise<{ [key: string]: Pair }> => {
    const [wallet] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(wallet).attach(ExchangeExtractor)
    const pairsReserves: { [key: string]: Pair } = {}

    let pairsData: Pair[] = []
    const pageSize = 500

    const promises = []

    const updateReserves = async (pairs: Pair[]) => {
        const [pairsAddresses, reserve0s, reserve1s] = await exchangeExtractor.getReserves(pairs.map(p => p.address))

        for (let i = 0; i < pairsAddresses.length; i++) {
            const p = pairsAddresses[i]
            pairs[i].reserve0 = reserve0s[i]
            pairs[i].reserve1 = reserve1s[i]

            if (pairs[i].reserve0.gt(pairs[i].precisionMultiplier) && pairs[i].reserve1.gt(pairs[i].precisionMultiplier)) {
                pairsReserves[p] = pairs[i]
            }
        }
    }

    for (let page = 0; page < Math.ceil(pairs.length / pageSize); page++) {
        console.log(`${page} of ${Math.ceil(pairs.length / pageSize)}`)
        const subPairs = []
        for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, pairs.length); i++) {
            if (pairs[i] == undefined) {
                console.log(pairs[i], i)
            }
            subPairs.push(pairs[i])
        }

        if (subPairs.length > 0) {
            promises.push(updateReserves(subPairs))
        }

        await new Promise((res) => {
            setTimeout(() => {
                res(null)
            }, 500)
        })
    }

    await Promise.all(promises)

    return pairsReserves
}


