import { BigNumber } from "ethers"
import { IUniswapV2Router02__factory } from "../typechain/factories/IUniswapV2Router02__factory"
import { Action, amountIn } from "./historic_data"
import { CycleInfo } from "./models/cycleInfo"
import { PairInfo } from "./models/pairInfo"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { ethers } from "hardhat"

const generateActions = async (shouldCombine: boolean = true, cyclesData: [BigNumber, boolean, CycleInfo][]): Promise<Action[]> => {
    const [deployer] = await ethers.getSigners()
    const actionPromises = cyclesData.map(async ([amountOut, isProfitable, cycle], i): Promise<Action[]> => {
        let amountInExchange = amountIn
        const actions: Action[] = []

        const path = [cycle.input[1][0][0]]
        let lastDex = cycle.input[0][0]

        for (let i = 0; i < cycle.pairs.length; i++) {
            const pairName = cycle.pairs[i]
            const pair = PairInfo.pairs[pairName]

            if (lastDex == cycle.input[0][i]) {
                lastDex = cycle.input[0][i]
                path.push(cycle.input[1][i][1])
            } else {
                
            }
            const exchange = IUniswapV2Router02__factory.connect(pair.dex, deployer)

            const exchangeTransaction = await exchange.populateTransaction.swapExactTokensForTokens(
                amountInExchange,
                0,
                cycle.input[1][i],
                ExchangeExtractor,
                Date.now() + 10000
            )

            amountInExchange = pair.amountOut(cycle.input[1][i][0], amountInExchange).sub(1)

            actions.push({
                address: exchange.address,
                data: exchangeTransaction.data!
            })
        }

        return [...actions]
    })

    const actions = await Promise.all(actionPromises)

    return actions.reduce<Action[]>((prev, curent) => {
        return [...prev, ...curent]
    }, [])
}