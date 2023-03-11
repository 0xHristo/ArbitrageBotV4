import { BigNumber } from "ethers"
import { ExchangeExtractorV4, IUniswapV2Factory, IUniswapV2Pair__factory } from "../../typechain"
import { PairInfo, Token } from "./pairInfo"

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

    amountOut = (amountIn: BigNumber, print?: boolean): [BigNumber, boolean, this] => {
        let amountOut = amountIn
        let tokenInAddress = this.initialToken.address
        for (let i = 0; i < this.pairs.length; i++) {
            const pairName = this.pairs[i]
            const pair: PairInfo = PairInfo.pairs[pairName]
            if(print === true) {
                pair.amountOut(tokenInAddress, amountOut, true)
            }
            // console.log(tokenInAddress)
            // if (pair.token2.address == "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174") {
            //     console.log(pair.name, amountOut, pair.amountOut(tokenInAddress, amountOut), PairInfo.reserves[pair.name])
            // }
            amountOut = pair.amountOut(tokenInAddress, amountOut)
            tokenInAddress = pair.other(tokenInAddress).address
        }

        const isProfitable = amountOut.gt(amountIn) && amountOut.lt(amountIn.div(10).add(amountIn))
        return [amountOut, isProfitable, this]
    }
}