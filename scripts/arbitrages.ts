import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory } from "../typechain"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { Dexes } from "../tokens/Dexes"
import { BaseAssets } from "../tokens/BaseAssets"
import fs from "fs/promises"
import { BigNumber } from "ethers"

const generateBasePairs = () => {
    let baseAssets = Object.values(BaseAssets)
    let pairs = []
    for (let i = 0; i < baseAssets.length; i++) {
        const baseA = baseAssets[i]
        for (let j = i + 1; j < baseAssets.length; j++) {
            const baseB = baseAssets[j]
            pairs.push([baseA, baseB])
        }
    }
    return pairs
}

const readTokens = async () => {
    try {
        const tokensCSV = await fs.readFile('csv/tokens.csv', {
            encoding: "utf-8"
        })

        return <string[]>tokensCSV.split(',')
    } catch (e) {
        console.log("Error occured:")
        console.log(e)

        return []
    }
}

const main = async () => {
    const basePairs = generateBasePairs()
    const tokens = await readTokens()

    let paths = []
    let exchanges = []
    let amountsIn = []
    let info = []
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        for (let j = 0; j < basePairs.length; j++) {
            const baseA = basePairs[j][0]
            const baseB = basePairs[j][1]
            const pathA = [baseA.address, token, baseB.address]
            const pathB = [baseB.address, token, baseA.address]
            const dexes = [Dexes["quickswap"], Dexes["sushiswap"]]
            const amountIn = BigNumber.from(10).pow(6)
            paths.push([pathA, pathB])
            exchanges.push(dexes)
            amountsIn.push(amountIn)
            info.push({
                baseA,
                baseB,
                token,
                dexes,
                amountIn
            })

            const pathA2 = [baseB.address, token, baseA.address]
            const pathB2 = [baseA.address, token, baseB.address]
            paths.push([pathB2, pathA2])
            exchanges.push(dexes)
            amountsIn.push(amountIn)
            info.push({
                baseA: baseB,
                baseB: baseA,
                token,
                dexes,
                amountIn
            })
        }
    }

    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)

    console.log(paths.length)
    try {
        const estimations = await (await exchangeExtractor.estimateSwaps(exchanges, paths, amountsIn))

        const detailedEstimations = info
            .map((obj, i) => ({ ...obj, amountOut: estimations[i] }))
            .filter(obj => {
                return obj.amountOut.gt(0)
            }).filter(obj => {
                return obj.amountOut.gte(obj.amountIn)
            }).sort((a, b) => {
                return a.amountOut.gt(b.amountOut) ? -1 : 1
            })

        console.log(detailedEstimations)
    } catch (e: any) {
        console.log(e.stack)
    }
}

main()