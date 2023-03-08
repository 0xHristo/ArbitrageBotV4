import fs, { read } from "fs"
import { PairInfo, Path, Token } from "./models/pairInfo"
import IUniswapV2Router02Artifacts from '../artifacts/contracts/ExchangeExtractorV4.sol/IUniswapV2Router01.json'
import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory } from "../typechain/factories/ExchangeExtractorV4__factory"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { BigNumber } from "ethers"
import { BaseAssets } from "../tokens/BaseAssets"
import { NetworkInfo } from "./models/networkInfo"
import { CycleInfo } from "./models/cycleInfo"

// let ArbitrageBotV4: ExchangeExtractorV4
const IUniswapV2Router02 = new ethers.utils.Interface(IUniswapV2Router02Artifacts.abi)
const readHistoricExchangesTransactions = async (): Promise<string[]> => {
    try {
        const paths = await fs.promises.readFile(
            'exchanges/sushiswap_uniswap_since_2023.csv',
            { encoding: 'utf-8' }
        )

        return paths.split('\r\n')
    } catch (e) {
        console.log("Error occured:")
        console.log(e)

        return []
    }
}

interface ExchangeTransaction {
    path: Path
    dex: string
}

const parseTransactionData = (row: string): Pair | null => {
    try {
        const entries = row.split(',')
        const data = entries[0]
        const dex = entries[1]
        const decodedArgs = IUniswapV2Router02.decodeFunctionData(data.slice(0, 10), data)
        const path = {
            from: decodedArgs.path[0],
            to: decodedArgs.path[1]
        }

        return new Pair(path.from, path.to, dex)
    } catch (e) {
        console.log(e)
        return null
    }
}

export class Pair {
    readonly token1: string
    readonly token2: string
    readonly dex: string

    constructor(token1: string, token2: string, dex: string) {
        const isBigger = token1 > token2
        this.token1 = isBigger ? token1 : token2
        this.token2 = isBigger ? token2 : token1
        this.dex = dex
    }

    static nameFor(token1: string, token2: string): string {
        return token1 > token2 ?
            `${token1} - ${token2}` :
            `${token2} - ${token1}`
    }

    get name(): string {
        return Pair.nameFor(this.token1, this.token2)
    }
}

interface PairsWithReserves {
    pairs: Pair[]
    dex: string
    reserves: [BigNumber[], BigNumber[]]
}

const constructPairInfoWithReservers = async (exchangePairs: any): Promise<CycleInfo[]> => {
    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)

    const result: PairsWithReserves[] = await Promise.all(Object.keys(exchangePairs).map(async exchange => {
        const tokens1s: string[] = exchangePairs[exchange].map((pair: Pair) => pair.token1)
        const tokens2s: string[] = exchangePairs[exchange].map((pair: Pair) => pair.token2)

        const reserves = await exchangeExtractor.getPairReserves(exchange, tokens1s, tokens2s)
        return {
            dex: exchange,
            pairs: exchangePairs[exchange],
            reserves
        }
    }))

    const arrayOfPairs: PairInfo[] = []

    result.forEach(pairs => {
        pairs.pairs.forEach((pair: Pair, i: number) => {
            arrayOfPairs.push(
                new PairInfo({
                    token1: new Token(pair.token1, 18),
                    token2: new Token(pair.token2, 18),
                    reserve1: pairs.reserves[0][i],
                    reserve2: pairs.reserves[1][i],
                    dex: pairs.dex,
                    address: pair.name
                })
            )
        })
    })

    const wmaticToken = new Token(BaseAssets.WMATIC.address, BaseAssets.WMATIC.digits)
    const network = new NetworkInfo(wmaticToken, arrayOfPairs)
    const cycles = network.createCycles()

    return cycles
}

const main = async (shouldParse: boolean) => {
    let exchangeTransactionPaths: Pair[]

    if (shouldParse) {
        const exchangesTransactions = await readHistoricExchangesTransactions()
        exchangeTransactionPaths = exchangesTransactions
            .map(parseTransactionData)
            .reduce<Pair[]>((prev, current) => {
                if (current != null) {
                    return [current, ...prev]
                } else {
                    return prev
                }
            }, [])

        await fs.promises.writeFile(`exchanges/historic_pairs.log`, JSON.stringify(exchangeTransactionPaths), { encoding: 'utf-8' })
    } else {
        exchangeTransactionPaths = JSON.parse(await fs.promises.readFile(`exchanges/historic_pairs.log`, { encoding: "utf-8" }))
    }

    const exchanges: any = {}
    exchangeTransactionPaths.forEach(transaction => {
        if (exchanges[transaction.dex] === undefined) {
            exchanges[transaction.dex] = {}
        }

        if (exchanges[transaction.dex][transaction.token1] === undefined) {
            exchanges[transaction.dex][transaction.token1] = {}
        }

        if (exchanges[transaction.dex][transaction.token2] === undefined) {
            exchanges[transaction.dex][transaction.token2] = {}
        }

        exchanges[transaction.dex][transaction.token2][transaction.token1] = true
        exchanges[transaction.dex][transaction.token1][transaction.token2] = true
    })

    const exchangesPairs: any = {}

    Object.keys(exchanges).forEach(exchange => {
        exchangesPairs[exchange] = []

        Object.keys(exchanges[exchange]).map(tokenA => {
            Object.keys(exchanges[exchange][tokenA]).map(tokenB => {
                exchangesPairs[exchange].push(new Pair(tokenA, tokenB, exchange))
            })
        })
    })

    const exchangePairsFiltered: any = {}
    Object.keys(exchangesPairs).forEach(exchange => {
        exchangePairsFiltered[exchange] = []

        const map: any = {}
        exchangesPairs[exchange].forEach((pair: Pair) => {
            map[pair.name] = pair
        })

        exchangePairsFiltered[exchange] = Object.values(map)
    })

    const cycles = await constructPairInfoWithReservers(exchangePairsFiltered)
    const amountIn = (BigNumber.from(10).pow(18)).mul(4)

    const result = cycles
        // .filter((_, i) => i < 1200)
        .map(cycle => cycle.amountOut(amountIn))
        .filter(([_, isProfitable]) => isProfitable)
        .sort((a, b) => {
            return b[0].gt(a[0]) ? -1 : 1
        })
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
    console.log(result.expected.length)
    console.log(result.expected)
    if (result.dexes.length > 0) {
        // const transaction = await exchangeExtractor.arbitrage(
        //     result.dexes[0],
        //     result.paths[0],
        //     amountIn,
        //     Date.now() + 10000,
        //     {
        //         gasLimit: 3000000,
        //     })
        const [deployer] = await ethers.getSigners()
        const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)

        const transaction = await exchangeExtractor.arbitrages(result.dexes.slice(0, 1), result.paths.slice(0, 1),
            amountIn,
            Date.now() + 10000, {
            gasLimit: 3000000,
        }
        )
        console.log(transaction.hash)
        const receipt = await transaction.wait()
    }
}

main(false)