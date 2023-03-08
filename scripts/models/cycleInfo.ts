import { BigNumber } from "ethers"
import { ExchangeExtractorV4, IUniswapV2Factory, IUniswapV2Pair__factory } from "../../typechain"
import { PairInfo, Token } from "./pairInfo"

export class CycleInfo {
    readonly pairs: PairInfo[] = []
    readonly initialToken: Token

    constructor(initialToken: Token, pairs: PairInfo[]) {
        this.pairs = pairs
        this.initialToken = initialToken
    }

    get input(): [string[], string[][]] {
        let dexes: string[] = []
        let paths: string[][] = []
        let firstTokenAddress = this.initialToken.address

        this.pairs.forEach(pair => {
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
            const pair = this.pairs[i]
            isValid = addressIn == pair.other(pair.other(addressIn).address).address &&
            pair.other(addressIn).address == pair.other(pair.this(addressIn).address).address
            addressIn = pair.other(addressIn).address
        }
        
        return isValid
    }

    print(): void {
        let addressIn = this.initialToken.address
        this.pairs.forEach(pair => {
            const adressOut = pair.other(addressIn).address
            console.log("--------------")
            console.log(addressIn, "->", adressOut)
            console.log(pair.name)
            addressIn = adressOut
        })
    }

    amountOut = (amountIn: BigNumber): [BigNumber, boolean, this] => {
        let amountOut = amountIn
        let tokenInAddress = this.initialToken.address

        for (let i = 0; i < this.pairs.length; i++) {
            const pair = this.pairs[i]
            amountOut = pair.amountOut(tokenInAddress, amountOut)
            tokenInAddress = pair.other(tokenInAddress).address
        }

        const isProfitable =  amountOut.gt(amountIn)
        return [amountOut, isProfitable, this]
    }
}