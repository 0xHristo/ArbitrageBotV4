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
import { IERC20__factory, ISafeERC20__factory, IUniswapV2Router02__factory } from "../typechain"
import { GasPrice, getNetworkGasPrice } from "@enzoferey/network-gas-price"
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle"

function getGweiEthers(gweiAmount: number): BigNumber {
    return ethers.utils.parseUnits(Math.ceil(gweiAmount).toString(), "gwei")
}
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
            reserves: [reserves[1], reserves[0]]
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

const tokensMap: any = {}

interface Action {
    address: string,
    data: string
}

const main = async (shouldParse: boolean) => {
    let exchangeTransactionPaths: Pair[]
    const networkGasPrice: GasPrice = await getNetworkGasPrice("polygon")

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

        if (tokensMap[transaction.token1] === undefined) {
            tokensMap[transaction.token1] = 0
        }

        if (tokensMap[transaction.token2] === undefined) {
            tokensMap[transaction.token2] = 0
        }

        tokensMap[transaction.token1]++
        tokensMap[transaction.token2]++

        exchanges[transaction.dex][transaction.token2][transaction.token1] = true
        exchanges[transaction.dex][transaction.token1][transaction.token2] = true
    })

    const averageOccurance = Math.ceil(Object.values(tokensMap).reduce<number>((a: number, b) => { return <number>a + <number>b }, 0) / Object.values(tokensMap).length)
    console.log(averageOccurance)

    const exchangesPairs: any = {}

    Object.keys(exchanges).forEach(exchange => {
        exchangesPairs[exchange] = []

        Object.keys(exchanges[exchange]).map(tokenA => {
            if (tokensMap[tokenA] > averageOccurance * 3 / 2) {
                Object.keys(exchanges[exchange][tokenA]).map(tokenB => {
                    if (tokensMap[tokenB] > averageOccurance * 3 / 2) {
                        exchangesPairs[exchange].push(new Pair(tokenA, tokenB, exchange))
                    }
                })
            }

        })
    })

    let exchangePairsFiltered: any = {}
    if (shouldParse) {
        Object.keys(exchangesPairs).forEach(exchange => {
            exchangePairsFiltered[exchange] = []

            const map: any = {}
            exchangesPairs[exchange].forEach((pair: Pair) => {
                map[pair.name] = pair
            })

            exchangePairsFiltered[exchange] = Object.values(map)
        })

        await fs.promises.writeFile(`exchanges/historic_pairs_filtered.log`, JSON.stringify(exchangePairsFiltered), { encoding: 'utf-8' })
    } else {
        exchangePairsFiltered = JSON.parse(await fs.promises.readFile(`exchanges/historic_pairs_filtered.log`, { encoding: "utf-8" }))
    }

    var time1 = new Date().getTime()

    const cycles = await constructPairInfoWithReservers(exchangePairsFiltered)
    const amountIn = (BigNumber.from(10).pow(18)).mul(1)

    const result = cycles
        // .filter((_, i) => i < 1200)
        .map(cycle => cycle.amountOut(amountIn))
        .filter(([_, isProfitable]) => isProfitable)
        .sort((a, b) => {
            return b[0].gt(a[0]) ? -1 : 1
        })

    if (result.length > 0) {
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

        // GIVE APPROVAL TO THE EXCHANGE EXTRACTORA
        // console.log(ethers.utils.defaultAbiCoder.encode(["address[]"], [result.paths[0]]))
        const wmatic = IERC20__factory.connect(BaseAssets.WMATIC.address, deployer)
        const exchangesCount = 2
        const commands: Action[] = []

        const takeFunds = await wmatic.populateTransaction.transferFrom(deployer.address, ExchangeExtractor, amountIn)

        commands.push({
            address: wmatic.address,
            data: takeFunds.data!
        })

        const actionPromises = result.slice(0, exchangesCount).map(async ([amountOut, isProfitable, cycle], i): Promise<Action[]> => {
            let amountInExchange = amountIn
            console.log("-")
            const actions: Action[] = []

            for (let i = 0; i < cycle.pairs.length; i++) {
                const pair = cycle.pairs[i]

                console.log("--")
                const approveExchange = await wmatic.populateTransaction.approve(pair.dex, amountInExchange)

                const exchange = IUniswapV2Router02__factory.connect(pair.dex, deployer)

                const exchangeTransaction = await exchange.populateTransaction.swapExactTokensForTokens(
                    amountInExchange,
                    0,
                    cycle.input[1][i],
                    ExchangeExtractor,
                    Date.now() + 100000
                )

                amountInExchange = pair.amountOut(cycle.input[1][i][0], amountInExchange)
                console.log(amountInExchange)
                actions.push({
                    address: cycle.input[1][i][0],
                    data: approveExchange.data!
                })
                actions.push({
                    address: pair.dex,
                    data: exchangeTransaction.data!
                })
            }


            const transferBack = await wmatic.populateTransaction.transfer(deployer.address, amountOut)

            return [
                {
                    address: wmatic.address,
                    data: takeFunds.data!
                },
                ...actions,
                {
                    address: wmatic.address,
                    data: transferBack.data!
                }
            ]
        })

        const actions = await Promise.all(actionPromises)

        const tnx = await exchangeExtractor.run(
            actions[0].map<string>((action: Action): string => action.address),
            actions[0].map<string>((action: Action): string => action.data),
            {
                gasLimit: 3000000,
                // gasPrice: 30000096308436836
                maxPriorityFeePerGas: getGweiEthers(
                    networkGasPrice.asap.maxPriorityFeePerGas
                ),
                maxFeePerGas: getGweiEthers(networkGasPrice.asap.maxFeePerGas),
            }
        )
        console.log(tnx.hash)
        console.log(`Transaction submited in ${await deployer.provider?.getBlockNumber()}`)
        var time2 = new Date().getTime()
        console.log(`Elapsed time: ${time2.valueOf() - time1.valueOf()}`)

        await tnx.wait().catch(() => console.log("FAILED!"))
        console.log(`Transaction included in ${await deployer.provider?.getBlockNumber()}`)
    }
}

main(false)