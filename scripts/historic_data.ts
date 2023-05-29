import fs, { read } from "fs"
import { PairInfo, Path, Token } from "./models/pairInfo"
import IUniswapV2Router02Artifacts from '../artifacts/contracts/ExchangeExtractorV4.sol/IUniswapV2Router02.json'
import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory } from "../typechain/factories/ExchangeExtractorV4__factory"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { BigNumber } from "ethers"
import { BaseAssets } from "../tokens/BaseAssets"
import { NetworkInfo } from "./models/networkInfo"
import { CycleInfo } from "./models/cycleInfo"
import { IERC20__factory, IUniswapV2Router02__factory } from "../typechain"
import { GasPrice, getNetworkGasPrice } from "@enzoferey/network-gas-price"
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle"
import { Dexes } from "../tokens/Dexes"
import { getGweiEthers } from "./helpers"
import { amountIn, blackListedTokens, initialToken, tokensWithTransactionAbove } from "./constants"
import { Action } from "./models/actions"

const exchangesCount = 2
const tokensInCycle = 5

const shouldParse = false
const shouldApproveExchangeExtractorToTokens = false
const shouldRegenerateCycles = false

const enablePrint = true

export const log = console.log

console.log = (...any) => {
    if (enablePrint) {
        log(...any)
    }
}


// let ArbitrageBotV4: ExchangeExtractorV4
const IUniswapV2Router02 = new ethers.utils.Interface(IUniswapV2Router02__factory.abi)
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
        console.log(row.split(',')[0].slice(0, 10))
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

const constructPairInfoWithReservers = async (exchangePairs: any): Promise<[BigNumber, boolean, CycleInfo][]> => {
    var time1 = new Date().getTime()
    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach("0xc9daAb52Bf1fBBA3b0Ec59F919345644581Ce931")
    console.log(5)

    const reserveMap: any = {}
    const pairsMap: any = {}
    const result: PairInfo[][] = await Promise.all(Object.keys(exchangePairs).map(async exchange => {
        const tokens1s: string[] = exchangePairs[exchange].map((pair: Pair) => pair.token1)
        const tokens2s: string[] = exchangePairs[exchange].map((pair: Pair) => pair.token2)

        const pairData = await exchangeExtractor.getPairReserves(exchange, tokens1s, tokens2s)

        return pairData[0].map<PairInfo>(([token1, token2, reserve1, reserve2]) => {            
            /// Shadow sorting of token1 & token2 
            const pairInfo = new PairInfo({
                token1: new Token(token1, 18),
                token2: new Token(token2, 18),
                dex: pairData[1],
            })

            // if (token1 == "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6" && token2 == "0xc2132D05D31c914a87C6611C10748AEb04B58e8F") {
            //     console.log(`${token1} ${token2} ${exchange}`)
            //     console.log([reserve1, reserve2])

            //     console.log(`${pairInfo.token1.address} ${pairInfo.token2.address} ${pairInfo.dex}`)
            //     console.log([reserve1, reserve2])
            // }

            pairsMap[pairInfo.name] = pairInfo
            reserveMap[pairInfo.name] = [reserve1, reserve2]

            return pairInfo
        })
    }))
    PairInfo.reserves = reserveMap
    PairInfo.pairs = pairsMap
    const arrayOfPairs: PairInfo[] = result.reduce((prev, current) => [...prev, ...current])

    console.log(7)

    console.log("Total pairs:", arrayOfPairs.length)


    var time2 = new Date().getTime()


    let cycles: CycleInfo[]
    let filteredCycles: [BigNumber, boolean, CycleInfo][]

    if (shouldRegenerateCycles) {
        console.log("KURR")
        const wmaticToken = new Token(initialToken.address, initialToken.digits)
        const network = new NetworkInfo(wmaticToken)
        cycles = network.createCyclesWithLength(tokensInCycle)
        console.log("Total cycles:", cycles.length)
        filteredCycles = cycles
            .map(cycle => cycle.amountOut(amountIn))
            .filter(([_, isProfitable]) => isProfitable)

        await fs.promises.writeFile(`exchanges/cycles.log`, JSON.stringify(filteredCycles.map(a => a[2])), { encoding: 'utf-8' })
    } else {
        const cycleData = JSON.parse(await fs.promises.readFile(`exchanges/cycles.log`, { encoding: "utf-8" }))
        cycles = cycleData.map((data: any) => new CycleInfo(data.initialToken, data.pairs))
        filteredCycles = cycles.map(cycle => cycle.amountOut(amountIn)).filter(([_, isProfitable]) => isProfitable)
    }

    var time3 = new Date().getTime()

    console.log(`Fetching reserves time: ${time2.valueOf() - time1.valueOf()}`)
    console.log(`Loading cycles time: ${time3.valueOf() - time2.valueOf()}`)


    return filteredCycles
}

const main = async () => {
    let exchangeTransactionPaths: Pair[]
    const networkGasPrice: GasPrice = await getNetworkGasPrice("polygon")
    console.log(1)
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
    console.log(2)

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
        console.log(3)

        const averageOccurance = tokensWithTransactionAbove //Math.ceil(Object.values(tokensMap).reduce<number>((a: number, b) => { return <number>a + <number>b }, 0) / Object.values(tokensMap).length)
        console.log(averageOccurance)

        const exchangesPairs: any = {}

        Object.keys(exchanges).forEach(exchange => {
            exchangesPairs[exchange] = []

            Object.keys(exchanges[exchange]).map(tokenA => {
                if (blackListedTokens.indexOf(tokenA) != -1)
                    return
                if (tokensMap[tokenA] > averageOccurance) {
                    Object.keys(exchanges[exchange][tokenA]).map(tokenB => {
                        if (blackListedTokens.indexOf(tokenB) != -1)
                            return
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
    console.log(4)

    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)

    if (shouldApproveExchangeExtractorToTokens) {
        const wmatic = IERC20__factory.connect(initialToken.address, deployer)
        const commands: Action[] = []

        const approvesPromises: Promise<Action>[] = Object.keys(tokensMap).filter(a => tokensMap[a] > tokensWithTransactionAbove && tokensMap[a] < 20 && blackListedTokens.indexOf(a) == -1).map<Promise<Action>>(async token => {
            const tnx = await wmatic.populateTransaction.approve(
                Dexes.quickswap,
                BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))

            return {
                address: "0x047fd3b3d2366f9babe105ade4598e263d6c699c",
                data: tnx.data!
            }
        })

        const approves = await Promise.all(approvesPromises)

        const tnx2 = await exchangeExtractor.run(
            [approves.map<string>((action: Action): string => action.address)[0]],
            [approves.map<string>((action: Action): string => action.data)[0]],
            {
                gasLimit: 1000000,
                // gasPrice: 30000096308436836
                maxPriorityFeePerGas: getGweiEthers(
                    networkGasPrice.average.maxPriorityFeePerGas
                ),
                maxFeePerGas: getGweiEthers(networkGasPrice.average.maxFeePerGas),
            }
        )

        console.log(tnx2.hash)
        await tnx2.wait()
    }

    var time1 = new Date().getTime()

    const cycles = await constructPairInfoWithReservers(exchangePairsFiltered)

    console.log("Cycles used:", cycles.length)

    // .filter(([, , cycle]) => cycle.input[0].every((val, i, arr) => val === arr[0])) /// in one exchange
    var timeFiltering = new Date().getTime()

    const result = cycles.sort((a, b) => {
        return b[0].gt(a[0]) ? 1 : -1
    })
    var timeSorting = new Date().getTime()

    console.log(`Filtering time: ${timeFiltering.valueOf() - time1.valueOf()}`)
    console.log(`Sorting time: ${timeSorting.valueOf() - timeFiltering.valueOf()}`)

    // console.log(result.map(([a]) => a))
    // console.log(result[0][2].input[1])

    // console.log(result.map(([a, b, cycle]) => a))
    console.log("Filtered cycles:", result.length)
    console.log(result.slice(0, 20).map(([i]) => i))
    if (result.length > 0) {

        // GIVE APPROVAL TO THE EXCHANGE EXTRACTORA
        // console.log(ethers.utils.defaultAbiCoder.encode(["address[]"], [result.paths[0]]))
        const wmatic = IERC20__factory.connect(initialToken.address, deployer)
        const commands: Action[] = []

        const takeFunds = await wmatic.populateTransaction.transferFrom(deployer.address, ExchangeExtractor, amountIn)

        commands.push({
            address: wmatic.address,
            data: takeFunds.data!
        })

        const cyclesToExploit = []
        const usedPairs: any = {}

        let i = 0
        while (i < result.length && cyclesToExploit.length < exchangesCount) {
            const cycle = result[i][2]

            let hasUsedPairs: boolean = false
            let localyUsedPairs: boolean = false
            let localyUsed: any = {}
            cycle.pairs.forEach(pairName => {
                localyUsedPairs = localyUsedPairs || (localyUsed[pairName] == undefined ? false : true)
                localyUsed[pairName] = true
                hasUsedPairs = hasUsedPairs || (usedPairs[pairName] == undefined ? false : true)
            })

            if (!hasUsedPairs && !localyUsedPairs) {
                cyclesToExploit.push(result[i])

                cycle.pairs.forEach(pairName => {
                    usedPairs[pairName] = true
                })
            }

            i++
        }

        console.log("Arbs:", cyclesToExploit.length)

        // if (cyclesToExploit.length < exchangesCount) {
        //     console.log("Not enough arbitrages")
        //     return
        // }

        cyclesToExploit.forEach(cycle => {
            cycle[2].amountOut(amountIn, true)
            console.log("Is in one dex", cycle[2].isCycleInOneExchange)
        })

        console.log("----------")
        console.log(await cyclesToExploit[0][2].action(IUniswapV2Router02__factory.connect(cyclesToExploit[0][2].input[0][1], deployer)))
        console.log("----------")
        // const actionPromises = cyclesToExploit.map(async ([amountOut, isProfitable, cycle], i): Promise<Action[]> => {
        //     let amountInExchange = amountIn
        //     const actions: Action[] = []

        //     const path = [cycle.input[1][0][0]]

        //     for (let i = 0; i < cycle.pairs.length; i++) {
        //         const pairName = cycle.pairs[i]
        //         const pair = PairInfo.pairs[pairName]

        //         // path.push(cycle.input[1][i][1])
        //         const exchange = IUniswapV2Router02__factory.connect(pair.dex, deployer)

        //         const exchangeTransaction = await exchange.populateTransaction.swapExactTokensForTokens(
        //             amountInExchange,
        //             0,
        //             cycle.input[1][i],
        //             ExchangeExtractor,
        //             Date.now() + 10000
        //         )

        //         amountInExchange = pair.amountOut(cycle.input[1][i][0], amountInExchange).sub(1)

        //         actions.push({
        //             address: exchange.address,
        //             data: exchangeTransaction.data!
        //         })
        //     }

        //     return [...actions]
        // })

        const actionPromises = cyclesToExploit.map(([amountOut, isProfitable, cycle]): Promise<Action[]> => {
            return cycle.action(IUniswapV2Router02__factory.connect(cycle.input[0][1], deployer))
        })

        const transferBackAmount = cyclesToExploit
            .reduce<BigNumber>((profit, [amountOut]) => profit.add(amountOut.sub(amountIn)), BigNumber.from(0)).add(amountIn)


        const actions = await Promise.all(actionPromises)
        if (transferBackAmount.lt(amountIn.add(amountIn.div(2)))) {
            log("Potential profit", transferBackAmount.toString(), "from", cyclesToExploit.length, "cycles")
            fs.appendFile(`exchanges/profits_wmatic.csv`, `${transferBackAmount.toString()},\n`, { encoding: 'utf-8' }, (e) => { })
            // return
        }
        const finalActions: Action[] = [
            // {
            //     address: wmatic.address,
            //     data: takeFunds.data!
            // },
            ...actions.reduce<Action[]>((prev, curent) => {
                return [...prev, ...curent]
            }, []),
            // {
            //     address: wmatic.address,
            //     data: transferBack.data!
            // }
        ]

        const addresses: string[] = finalActions.map<string>((action: Action): string => action.address)

        const datas: string[] = finalActions.map<string>((action: Action): string => action.data)
        // console.log(transferBackAmount)
        var time2 = new Date().getTime()
        console.log(`Elapsed time: ${time2.valueOf() - time1.valueOf()}`)
        return

        try {
            const tnx = await exchangeExtractor.runSimple(
                addresses,
                datas,
                initialToken.address,
                amountIn,
                {
                    gasLimit: 3000000,
                    // gasPrice: 30000096308436836
                    maxPriorityFeePerGas: getGweiEthers(
                        networkGasPrice.low.maxPriorityFeePerGas
                    ),
                    maxFeePerGas: getGweiEthers(networkGasPrice.low.maxFeePerGas),
                }
            )
            log(tnx.hash)
            log(`Transaction submited in ${await deployer.provider?.getBlockNumber()}`)


            await tnx.wait().catch(() => log("FAILED!"))
            log(`Transaction included in ${await deployer.provider?.getBlockNumber()}`)
        } catch (e) {
            log(e)
        }
    }
}

export const CheckForArbitrage = async () => await main()
main().catch(log)