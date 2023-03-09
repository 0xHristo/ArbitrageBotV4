import { ethers } from "hardhat"
import { ExchangeExtractorV4, ExchangeExtractorV4__factory, IERC20__factory, IUniswapV2Router02__factory } from "../typechain"
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
import { Action } from "./historic_data"
import { GasPrice, getNetworkGasPrice } from "@enzoferey/network-gas-price"
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle"

function getGweiEthers(gweiAmount: number): BigNumber {
    return ethers.utils.parseUnits(Math.ceil(gweiAmount).toString(), "gwei")
}
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
                        dex: dex.address
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
    let lock = 0
    var time1 = new Date().getTime()
    //deployer.provider?.on("block", async (e) => {
    if (lock == 1)
        return
    // console.log(e)
    try {
        const dexes: Dex[] = [
            new Dex(Dexes.quickswap, "quickswap", 100 /* 34407 */),
            new Dex(Dexes.sushiswap, "sushiswap", 100 /* 5948 */)
        ]

        const arrayOfPairsArrays = await Promise.all([
            ...getAllPairsInDex(dexes[0], getPairsInfoInDex(exchangeExtractor)),
            ...getAllPairsInDex(dexes[1], getPairsInfoInDex(exchangeExtractor)),
        ])

        const arrayOfPairs = arrayOfPairsArrays.reduce((arrayOfPairs, singleArrayOfPairs) => {
            return [...arrayOfPairs, ...singleArrayOfPairs]
        })

        const wmaticToken = new Token(BaseAssets.WMATIC.address, BaseAssets.WMATIC.digits)
        const network = new NetworkInfo(wmaticToken, arrayOfPairs)
        const cycles = network.createCycles()

        const amountIn = (BigNumber.from(10).pow(18)).mul(1)

        // console.log(cycles[0])
        const result = cycles
            // .filter((_, i) => i < 1200)
            .map(cycle => cycle.amountOut(amountIn))
            .filter(([_, isProfitable]) => isProfitable)
            .sort((a, b) => {
                return b[0].gt(a[0]) ? -1 : 1
            })
        const networkGasPrice: GasPrice = await getNetworkGasPrice("polygon")

        if (result.length > 0) {

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
    } catch (e) {
        console.log(e)
    }
    lock = 0
    //})
}

main()