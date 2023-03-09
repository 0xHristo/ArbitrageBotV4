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
import { Dexes } from "../tokens/Dexes"

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

export interface Action {
    address: string,
    data: string
}

const main = async (shouldParse: boolean, shouldApprove: boolean) => {
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

    let exchangePairsFiltered: any = {}
    let tokensMap: any = {}
    if (shouldParse) {
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
                if (tokensMap[tokenA] > averageOccurance) {
                    Object.keys(exchanges[exchange][tokenA]).map(tokenB => {
                        if (tokensMap[tokenB] > averageOccurance) {
                            exchangesPairs[exchange].push(new Pair(tokenA, tokenB, exchange))
                        }
                    })
                }

            })
        })

        Object.keys(exchangesPairs).forEach(exchange => {
            exchangePairsFiltered[exchange] = []

            const map: any = {}
            exchangesPairs[exchange].forEach((pair: Pair) => {
                map[pair.name] = pair
            })

            exchangePairsFiltered[exchange] = Object.values(map)
        })

        await fs.promises.writeFile(`exchanges/historic_pairs_filtered.log`, JSON.stringify(exchangePairsFiltered), { encoding: 'utf-8' })
        await fs.promises.writeFile(`exchanges/historic_pairs_tokens_map.log`, JSON.stringify(tokensMap), { encoding: 'utf-8' })
    } else {
        exchangePairsFiltered = JSON.parse(await fs.promises.readFile(`exchanges/historic_pairs_filtered.log`, { encoding: "utf-8" }))
        tokensMap = JSON.parse(await fs.promises.readFile(`exchanges/historic_pairs_tokens_map.log`, { encoding: "utf-8" }))
    }

    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)

    if (shouldApprove) {
        const wmatic = IERC20__factory.connect(BaseAssets.WMATIC.address, deployer)
        const exchangesCount = 2
        const commands: Action[] = []

        const approvesPromises: Promise<Action>[] = Object.keys(tokensMap).filter(a => tokensMap[a] > 229).map<Promise<Action>>(async token => {
            const tnx = await wmatic.populateTransaction.approve(
                Dexes.sushiswap,
                BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))

            return {
                address: token,
                data: tnx.data!
            }
        })

        const approves = await Promise.all(approvesPromises)

        const tnx = await exchangeExtractor.run(
            approves.map<string>((action: Action): string => action.address),
            approves.map<string>((action: Action): string => action.data),
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
        await tnx.wait()
    }

    var time1 = new Date().getTime()

    const cycles = await constructPairInfoWithReservers(exchangePairsFiltered)
    const amountIn = (BigNumber.from(10).pow(18)).mul(1)

    const result = cycles
        .map(cycle => cycle.amountOut(amountIn))
        .filter(([_, isProfitable]) => isProfitable)
        .filter(([, , cycle]) => cycle.input[0].every((val, i, arr) => val === arr[0])) /// in one exchange
        .sort((a, b) => {
            return b[0].gt(a[0]) ? 1 : -1
        })
    // console.log(result.map(([a]) => a))
    console.log(`Arbitrages: ${result.map(([a]) => a)}`)

    console.log(result.map(([a, b, cycle]) => cycle.input[0]))

    if (result.length == 0) {

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
        // console.log(result.map(([e]) => e))
        // return 
        const actionPromises = result.slice(0, exchangesCount).map(async ([amountOut, isProfitable, cycle], i): Promise<Action[]> => {
            let amountInExchange = amountIn
            const actions: Action[] = []

            for (let i = 0; i < cycle.pairs.length; i++) {
                const pair = cycle.pairs[i]

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

                // actions.push({
                //     address: cycle.input[1][i][0],
                //     data: approveExchange.data!
                // })
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

        const addresses: string[] = actions.reduce<string[]>((prev, curent) => {
            return [...prev, ...curent.map<string>((action: Action): string => action.address)]
        }, [])

        const datas: string[] = actions.reduce<string[]>((prev, curent) => {
            return [...prev, ...curent.map<string>((action: Action): string => action.data)]
        }, [])

        const tnx = await exchangeExtractor.run(
            addresses,
            datas,
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

export const CheckForArbitrage = async () => await main(false, false)
main(false, false)