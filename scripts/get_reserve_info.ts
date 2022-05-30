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
        new Dex(Dexes.quickswap, "quickswap", 34407/* 34407 */),
        new Dex(Dexes.sushiswap, "sushiswap", 5948)
    ]

    const arrayOfPairsArrays = await Promise.all([
        ...getAllPairsInDex(dexes[0], getPairsInfoInDex(exchangeExtractor)),
        ...getAllPairsInDex(dexes[1], getPairsInfoInDex(exchangeExtractor)),
    ])

    const arrayOfPairs = arrayOfPairsArrays.reduce((arrayOfPairs, singleArrayOfPairs) => {
        return [...arrayOfPairs, ...singleArrayOfPairs]
    })

    const filteredPairs = arrayOfPairs/* .filter(pair => {
        if (pair.token2.address == "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" &&
            pair.token1.address == "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619") return true
        return false
    }) */
    // console.log(filteredPairs)

    const wmaticToken = new Token(BaseAssets.WMATIC.address, BaseAssets.WMATIC.digits)
    const network = new NetworkInfo(wmaticToken, filteredPairs)
    const cycles = network.createCycles()

    const step = 3
    let cycleBatches: Promise<{ dexes: string[][], paths: string[][][], amountIns: BigNumber[] }>[] = []
    console.log(1)
    for (let i = 0; i < Math.ceil(Math.min(cycles.length, 10000) / step); i++) {
        let inputDexes: string[][] = []
        let inputPaths: string[][][] = []
        let inputAmountIn: BigNumber[] = []
        for (let j = step * i; j < step * (i + 1); j++) {
            const cycle = cycles[j]
            const input = cycle.input

            inputDexes.push(input[0])
            inputPaths.push(input[1])
            inputAmountIn.push(BigNumber.from(10).pow(18))

        }
        const cycle = new CycleBatch(
            inputDexes,
            inputPaths,
            inputAmountIn
        )
        cycleBatches.push(
            cycle.filter(exchangeExtractor)
        )
    }

    console.log(2)
    const r = await Promise.all(cycleBatches)
    console.log(3)
    
    console.log(r.map(a => a.dexes.length))

    // console.log(await exchangeExtractor.estimateSwap(
    //     cycles[0].input[0],
    //     cycles[0].input[1],
    //     BigNumber.from(10).pow(18)
    // ))
    // console.log(network)
}

main()