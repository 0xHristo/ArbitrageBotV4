import { BigNumber } from "ethers"
import { ExchangeExtractorV4 } from "../../typechain"

export class CycleBatch {
    readonly inputDexes: string[][]
    readonly inputPaths: string[][][]
    readonly inputAmountIn: BigNumber[]

    constructor(inputDexes: string[][], inputPaths: string[][][], inputAmountIn: BigNumber[]) {
        this.inputDexes = inputDexes
        this.inputPaths = inputPaths
        this.inputAmountIn = inputAmountIn
    }

    async filter(exchangeExtractor: ExchangeExtractorV4): Promise<{ dexes: string[][], paths: string[][][], amountIns: BigNumber[] }> {
        let r: { dexes: string[][], paths: string[][][], amountIns: BigNumber[] } = {
            dexes: [],
            paths: [],
            amountIns: []
        }
        try {

            const amountOuts: BigNumber[] = await exchangeExtractor.callStatic.estimateSwaps(this.inputDexes, this.inputPaths, this.inputAmountIn, {
                gasLimit: 300000000
            })

            amountOuts.forEach((amountOut: BigNumber, i: number) => {
                if (amountOut.gt(this.inputAmountIn[i])) {
                    r.dexes.push(this.inputDexes[i])
                    r.paths.push(this.inputPaths[i])
                    r.amountIns.push(this.inputAmountIn[i])
                }
            })
        } catch (e: any) {
            console.log(e.stack)
            console.log("kura mi qnko")
        }
        return r
    }
}