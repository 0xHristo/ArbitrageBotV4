import { BigNumber } from "ethers"
import { PairInfo, Token } from "./pairInfo"

export class CycleInfo {
    readonly pairs: PairInfo[] = []
    readonly initialToken: Token

    constructor(initialToken: Token, pairs: PairInfo[]) {
        this.pairs = pairs
        this.initialToken = initialToken
    }

    get isProfitable(): boolean {
        let tokenInaddress = this.initialToken.address
        let p = BigNumber.from(1)
        let c = BigNumber.from(1)
        for (let i = 0; i < this.pairs.length; i++) {
            const pair = this.pairs[i];
            const tokenOut = pair.other(tokenInaddress)
            const tokenOutAddress = tokenOut.address
            p = p.mul(pair.price(tokenOutAddress))
            c = c.mul(BigNumber.from(10).pow(tokenOut.digits))
            tokenInaddress = tokenOutAddress
        }
        
        console.log(p)
        // console.log
        return p.gte(c)
    }

    get input(): [string[], string[][]] {
        let dexes: string[] = []
        let paths: string[][] = []
        let firstTokenAddress = this.initialToken.address

        this.pairs.forEach(pair => {
            const secondTokenAddress = pair.other(firstTokenAddress).address
            dexes.push(pair.dex.address)
            paths.push([
                firstTokenAddress,
                secondTokenAddress
            ])
            firstTokenAddress = secondTokenAddress
        })

        return [dexes, paths]
    }
}