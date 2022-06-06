import { ethers } from "hardhat"
import { ExchangeExtractorV4, ExchangeExtractorV4__factory } from "../typechain"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { Dexes } from "../tokens/Dexes"
import { BaseAssets } from "../tokens/BaseAssets"
import fs from "fs"
import { Dex, PairInfo, Token } from "./models/pairInfo"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Arbitrage, Market } from "./models/marketInfo"
import { NetworkInfo } from "./models/networkInfo"
import { BigNumber } from "ethers"
import { CycleBatch } from "./models/cycleBatch"

type GetPairInfoForDex = (dex: Dex, start: number, end: number) => Promise<PairInfo[]>

const getPairsInfoInDex = (exchangeExtractor: ExchangeExtractorV4) =>
    async (dex: Dex, start: number, end: number): Promise<PairInfo[]> => {
        try {
            const [pairAddresses, tokenDigits, reserves] = await exchangeExtractor.callStatic.extract(dex.address, start, end)
            const pairsCount = pairAddresses.length

            let pairInfos: PairInfo[] = []
            for (let i = 0; i < pairsCount; i++) {
                if (reserves[i][0].gt(10 ** 5) &&
                    reserves[i][1].gt(10 ** 5)) {

                    const pairInfo = new PairInfo({
                        token1: new Token(pairAddresses[i][0], tokenDigits[i][0]),
                        token2: new Token(pairAddresses[i][1], tokenDigits[i][1]),
                        reserve1: reserves[i][0],
                        reserve2: reserves[i][1],
                        address: pairAddresses[i][2],
                        dex
                    })

                    pairInfos.push(pairInfo)
                }
            }

            return pairInfos
        } catch (e: any) {
            console.log(e.stack)
            throw e
        }
    }

const getAllPairsInDex = (dex: Dex, getPairsInfo: GetPairInfoForDex): Promise<PairInfo[]>[] => {
    const step = 1000

    let pairInfos: Promise<PairInfo[]>[] = []
    for (let i = 0; i < Math.ceil(dex.pairs / step); i++) {
        pairInfos.push(getPairsInfo(dex, step * i, step * (i + 1) - 1))
    }

    return pairInfos
}

const main = async () => {
    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)

    const dexes: Dex[] = [
        new Dex(Dexes.quickswap, "quickswap", 6000 /* 34407 */),
        new Dex(Dexes.sushiswap, "sushiswap", 5948)
    ]

    const arrayOfPairsArrays = await Promise.all([
        ...getAllPairsInDex(dexes[0], getPairsInfoInDex(exchangeExtractor)),
        ...getAllPairsInDex(dexes[1], getPairsInfoInDex(exchangeExtractor)),
    ])

    const arrayOfPairs = arrayOfPairsArrays.reduce((arrayOfPairs, singleArrayOfPairs) => {
        return [...arrayOfPairs, ...singleArrayOfPairs]
    })
    console.log(arrayOfPairs[0])

    const wmaticToken = new Token(BaseAssets.WMATIC.address, BaseAssets.WMATIC.digits)
    const network = new NetworkInfo(wmaticToken, arrayOfPairs)
    const cycles = network.createCycles()

    console.log("----")
    console.log(cycles.length)
    console.log(cycles.filter(cycle => !cycle.isValidCycle).length)

    const amountIn = BigNumber.from(10).pow(19)

    console.log(cycles.length)
    const result = cycles
        .filter((_, i) => i < 1200)
        .map(cycle => cycle.amountOut(amountIn))
        .filter(([_, isProfitable]) => isProfitable)
        .reduce((prev, [amountOut, , cycle]) => {
            prev.dexes.push(cycle.input[0])
            prev.paths.push(cycle.input[1])
            prev.amountIns.push(amountIn)
            prev.expected.push(amountOut)
            return prev
        }, {
            dexes: <string[][]>[],
            paths: <string[][][]>[],
            amountIns: <BigNumber[]>[],
            expected: <BigNumber[]>[]
        })
    console.log(result)
    if(result.dexes.length > 0) {
        const transaction = await exchangeExtractor.arbitrages(result.dexes, result.paths,
            amountIn,
            Date.now() + 10000, {
            gasLimit: 3000000,
        }
        )
        const receipt = await transaction.wait()
        console.log(receipt.transactionHash)
    }

    // console.log(await exchangeExtractor.estimateSwaps(result.dexes, result.paths, result.amountIns), result.expected)
    console.log(amountIn)
}

main()