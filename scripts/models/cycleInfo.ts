import { BigNumber } from "ethers"
import { ExchangeExtractorV4, IUniswapV2Factory, IUniswapV2Pair__factory, IUniswapV2Router02 } from "../../typechain"
import { PairInfo, Token } from "./pairInfo"
import { ExchangeExtractor } from "../../tokens/ExchangeExtractor"
import { amountIn } from "../constants"
import { Action } from "./actions"

export class CycleInfo {
    readonly pairs: string[] = []
    readonly initialToken: Token

    constructor(initialToken: Token, pairs: string[]) {
        this.pairs = pairs
        this.initialToken = initialToken
    }

    get input(): [string[], string[][]] {
        let dexes: string[] = []
        let paths: string[][] = []
        let firstTokenAddress = this.initialToken.address

        this.pairs.forEach(pairName => {
            const pair = PairInfo.pairs[pairName]
            const secondTokenAddress = pair.other(firstTokenAddress).address
            dexes.push(pair.dex)
            paths.push([
                firstTokenAddress,
                secondTokenAddress
            ])
            firstTokenAddress = secondTokenAddress
        })

        return [dexes, paths]
    }

    get isCycleInOneExchange(): boolean {
        let exchange = <PairInfo>(PairInfo.pairs[this.pairs[0]]).dex
        let isOneExchnage = true
        return this.pairs.reduce<boolean>((prev, pairName) => {
            const pair = PairInfo.pairs[pairName]


            const pred = prev && exchange == pair.dex
            exchange = pair.dex

            return pred
        }, isOneExchnage)
    }

    get isValidCycle(): boolean {
        let addressIn = this.initialToken.address
        let isValid = true

        for (let i = 0; i < this.pairs.length; i++) {
            const pairName = this.pairs[i]
            const pair = PairInfo.pairs[pairName]

            isValid = addressIn == pair.other(pair.other(addressIn).address).address &&
                pair.other(addressIn).address == pair.other(pair.this(addressIn).address).address
            addressIn = pair.other(addressIn).address
        }

        return isValid
    }

    print(): void {
        let addressIn = this.initialToken.address
        this.pairs.forEach(pairName => {
            const pair = PairInfo.pairs[pairName]
            const adressOut = pair.other(addressIn).address
            console.log("--------------")
            console.log(addressIn, "->", adressOut)
            console.log(pair.name)
            addressIn = adressOut
        })
    }

    amountOuts = (amountIn: BigNumber): BigNumber[] => {
        let amountOut = amountIn
        let tokenInAddress = this.initialToken.address
        const amountOuts = [amountOut]
        for (let i = 0; i < this.pairs.length; i++) {
            const pairName = this.pairs[i]
            const pair: PairInfo = PairInfo.pairs[pairName]
            amountOut = pair.amountOut(tokenInAddress, amountOut)
            amountOuts.push(amountOut)
            tokenInAddress = pair.other(tokenInAddress).address
        }

        return amountOuts
    }

    amountOut = (amountIn: BigNumber, print?: boolean): [BigNumber, boolean, this] => {
        let amountOut = amountIn
        let tokenInAddress = this.initialToken.address
        for (let i = 0; i < this.pairs.length; i++) {
            const pairName = this.pairs[i]
            const pair: PairInfo = PairInfo.pairs[pairName]
            // if(print === true) {
            //     pair.amountOut(tokenInAddress, amountOut, true)
            // }
            // console.log(tokenInAddress)
            // if (pair.token2.address == "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174") {
            //     console.log(pair.name, amountOut, pair.amountOut(tokenInAddress, amountOut), PairInfo.reserves[pair.name])
            // }
            amountOut = pair.amountOut(tokenInAddress, amountOut)
            tokenInAddress = pair.other(tokenInAddress).address
        }

        const isProfitable = amountOut.gt(amountIn) //&& amountOut.lt(amountIn.div(10).add(amountIn))
        return [amountOut, isProfitable, this]
    }

    async action(router: IUniswapV2Router02): Promise<Action[]> {
        if (this.isCycleInOneExchange) {
            const paths = [this.input[1][0][0]]

            this.input[1].forEach((path) => {
                paths.push(path[1])
            })

            const exchangeTransaction = await router.populateTransaction.swapExactTokensForTokens(
                amountIn,
                0,
                paths,
                ExchangeExtractor,
                Date.now() + 10000
            )

            return [<Action>{
                data: exchangeTransaction!.data,
                address: this.input[0][0]
            }]
        } else {
            const paths: string[][] = [this.input[1][0]]
            const pairs: string[][] = [[this.pairs[0]]]
            let currentExchange = this.input[0][1]
            const exchanges: string[] = [currentExchange]
            let hops = 0

            for (let i = 1; i < this.input[0].length; i++) {
                const dex = this.input[0][i]
                if (currentExchange == dex) {
                    paths[hops].push(this.input[1][i][1])
                    pairs[hops].push(this.pairs[i])
                } else {
                    currentExchange = dex
                    exchanges.push(dex)
                    hops++
                    paths.push(this.input[1][i])
                    pairs.push([this.pairs[i]])
                }
            }

            const actions = []
            const amountOuts = this.amountOuts(amountIn)
            console.log(amountOuts)
            let currentIndex = 0
            for (let i = 0; i < exchanges.length; i++) {
                const dex = exchanges[i]
                const tnxData = await router.populateTransaction.swapExactTokensForTokens(
                    amountOuts[currentIndex],
                    0,
                    paths[i],
                    ExchangeExtractor,
                    Date.now() + 10000
                )

                currentIndex += paths[i].length - 1
                console.log(currentIndex)
                console.log(amountOuts[currentIndex])

                actions.push(<Action>{
                    data: tnxData!.data,
                    address: dex
                })
            }
            // console.log(amountIns)
            // console.log(exchanges)
            // console.log(paths)
            // console.log("-----------------")

            return actions
        }
    }
}