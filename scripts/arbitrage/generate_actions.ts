/**
* 1. Transfer to bot
* 2. bot transfer to 1st pair
* 3. execute 1st swap
* 4. bot transfer to 2nd pair
* 5. execute 2nd swap
* 6. validates everything is Ok
* 7. transfer to me
*/

import { BigNumber } from "ethers"
import { GasAwareSigner } from "../GasAwareSigner"
import { Action, Arbitrage } from "./entities"
import { providerHTTP } from "./configs"
import { ExchangeExtractor } from "../../tokens/ExchangeExtractor"
import { IERC20Uniswap__factory, IUniswapV2Pair__factory } from "../../typechain"
import { toUtf8Bytes } from "ethers/lib/utils"

export const getActionsStartingWithTheSameToken = async (arbs: Arbitrage[], signer: GasAwareSigner): Promise<Action[]> => {
    let actions: Action[] = []
    const initialToken = arbs[0].cycle.initialToken
    const initialAmountIn = arbs[0].amounts[0]
    const finalAmountOut = arbs.reduce<BigNumber>((totalOut, currentArb) => {
        const currentArbOut = currentArb.amounts[currentArb.amounts.length - 1].sub(currentArb.amounts[0])

        return totalOut.add(currentArbOut)
    }, BigNumber.from(0)).add(initialAmountIn)

    const iERC20InitialToken = IERC20Uniswap__factory.connect(initialToken.address, providerHTTP)

    // 1
    const transferToBot = await iERC20InitialToken.populateTransaction.transferFrom(signer.address, ExchangeExtractor, initialAmountIn)
    actions.push({
        adress: initialToken.address,
        data: transferToBot.data!
    })

    for (let i = 0; i < arbs.length; i++) {
        const arb = arbs[i]

        const arbActions = await getArbActions(arb, signer)

        actions = [...actions, ...arbActions]
    }


    // 7
    const transferToMe = await iERC20InitialToken.populateTransaction.transfer(signer.address, finalAmountOut)
    actions.push({
        adress: initialToken.address,
        data: transferToMe.data!
    })

    console.log(`Amount in: ${initialAmountIn}`)
    console.log(`Expected amount out: ${finalAmountOut}`)
    console.log(`Difference: ${finalAmountOut.sub(initialAmountIn)}`)

    return actions
}

const getArbActions = async (arb: Arbitrage, signer: GasAwareSigner): Promise<Action[]> => {
    const actions: Action[] = []
    let tokenIn = IERC20Uniswap__factory.connect(arb.cycle.initialToken.address, providerHTTP)

    for (let i = 0; i < arb.cycle.pairs.length; i++) {
        const pair = arb.cycle.pairs[i]
        const amountIn = arb.amounts[i]
        const amountOut = arb.amounts[i + 1]
        const isZeroTokenTokenIn = tokenIn.address == pair.token0.address
        let token0Out = isZeroTokenTokenIn ? 0 : amountOut
        let token1Out = isZeroTokenTokenIn ? amountOut : 0
        let tokenOutAddress = isZeroTokenTokenIn ? pair.token1.address : pair.token0.address
        let tokenOut = IERC20Uniswap__factory.connect(tokenOutAddress, providerHTTP)

        const transferToFirstPair = await tokenIn.populateTransaction.transfer(pair.address, amountIn)
        actions.push({
            adress: tokenIn.address,
            data: transferToFirstPair.data!
        })

        const pair1 = IUniswapV2Pair__factory.connect(pair.address, providerHTTP)
        const executeFirstSwap = await pair1.populateTransaction.swap(token0Out, token1Out, ExchangeExtractor, toUtf8Bytes(""))
        actions.push({
            adress: pair1.address,
            data: executeFirstSwap.data!
        })

        tokenIn = tokenOut
    }

    return actions
}