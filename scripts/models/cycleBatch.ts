import { BigNumber, Signer } from "ethers"
import { ExchangeExtractorV4, IUniswapV2Router02, IUniswapV2Router02__factory } from "../../typechain"
import { PairInfo, Token } from "./pairInfo"
import { ExchangeExtractor } from "../../tokens/ExchangeExtractor"
import { Action } from "./actions"

export class CycleBatch {
    readonly dex: string
    readonly pairs: PairInfo[]
    readonly router: IUniswapV2Router02
    readonly amoutIn: BigNumber
    readonly path: string[]

    constructor(initialPair: PairInfo, deployer: Signer, amoutIn: BigNumber, token0: Token) {
        this.dex = initialPair.dex
        this.pairs = [initialPair]
        this.router = IUniswapV2Router02__factory.connect(this.dex, deployer)
        this.amoutIn = amoutIn
        this.path = [token0.address, initialPair.other(token0.address).address]
    }

    add = (pair: PairInfo, token0: Token) => {
        this.pairs.push(pair)
        this.path.push(pair.other(token0.address).address)
    }

    async action(): Promise<Action> {
        const exchangeTransaction = await this.router.populateTransaction.swapExactTokensForTokens(
            this.amoutIn,
            0,
            this.path,
            ExchangeExtractor,
            Date.now() + 10000
        )

        return <Action>{
            data: exchangeTransaction!.data,
            address: this.dex
        }
    }

    get amountOut(): BigNumber {
        return this.pairs.reduce<BigNumber>((amoutIn, pair, i) => pair.amountOut(this.path[i], amoutIn), this.amoutIn)
    }
}