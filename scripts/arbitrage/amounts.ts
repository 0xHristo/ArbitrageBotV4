import { BigNumber } from "ethers"
import { Cycle, Pair, Token } from "./entities"
import { amountIn } from "./configs"

export const getAmountOut = (pair: Pair, tokenIn: Token, amountIn: BigNumber): [tokenOut: Token, amountOut: BigNumber] => {
    const tokenOut = tokenIn.address == pair.token0.address ? pair.token1 : pair.token0

    try {
        const reserveIn = tokenIn.address === pair.token1.address ? pair.reserve1 : pair.reserve0
        const reserveOut = tokenIn.address === pair.token1.address ? pair.reserve0 : pair.reserve1

        if (amountIn.gte(reserveIn)) {
            throw "Not enough liquditiry"
        }

        const amountInWithFee: BigNumber = amountIn.mul(BigNumber.from(pair.precisionMultiplier).sub(pair.fee))
        const numerator = amountInWithFee.mul(reserveOut)
        const denominator = reserveIn.mul(pair.precisionMultiplier).add(amountInWithFee)

        if (denominator.eq(0)) {
            throw "Zero Denominator"
        }

        const amountOut = numerator.div(denominator)

        return [tokenOut, amountOut]
    } catch (e: any) {
        console.error(`Error in pair: ${pair.address}`, e)

        return [tokenOut, BigNumber.from(0)]
    }

}

export const calculateCycleAmountOut = (cycle: Cycle, amountIn: BigNumber): BigNumber[] => {
    let currentAmount: BigNumber = amountIn
    let tokenIn: Token = cycle.initialToken
    const c = [currentAmount]

    for (const pair of cycle.pairs) {
        let tokenOut: Token;
        [tokenOut, currentAmount] = getAmountOut(pair, tokenIn, currentAmount)
        tokenIn = tokenOut // Update tokenIn for the next iteration
        c.push(currentAmount)
    }

    return c
}

const deltaBetweenInAndOut = (cycle: Cycle, amountIn: BigNumber): BigNumber => {
    const amountOut = calculateCycleAmountOut(cycle, amountIn)[cycle.pairs.length - 1]

    return amountIn.sub(amountOut)
}

export const calculateCycleAmountIn = (cycle: Cycle, min: BigNumber, max: BigNumber): BigNumber => {
    try {
        let i = 0
        let l = min
        let r = max
        let lAmount = deltaBetweenInAndOut(cycle, l)
        let rAmount = deltaBetweenInAndOut(cycle, r)

        while (l.lt(r) && i < 100) {
            let mid = l.add(r).div(2)
            let midAmount = deltaBetweenInAndOut(cycle, min)

            if (midAmount.gt(rAmount)) {
                l = mid
                lAmount = midAmount
            } else {
                r = mid.sub(1)
                rAmount = midAmount
            }
            i++
        }

        return l
    } catch (e) {
        return BigNumber.from(0)
    }
}


export const calculateCycleAmountOut2 = (cycle: Cycle, amountOutR: BigNumber): BigNumber => {
    let tokenIn: Token = cycle.initialToken
    const r = amountOutR
    let top = r
    let bottomL = BigNumber.from(1)
    let bottomR = BigNumber.from(1)

    tokenIn = cycle.initialToken
    for (const pair of cycle.pairs) {
        const reserveIn = tokenIn.address === pair.token1.address ? pair.reserve1 : pair.reserve0
        const reserveOut = tokenIn.address === pair.token1.address ? pair.reserve0 : pair.reserve1
        const tokenOut = tokenIn.address === pair.token1.address ? pair.token0 : pair.token1
        top = top.mul(pair.precisionMultiplier.mul(reserveIn))
        bottomL = bottomL.mul((pair.precisionMultiplier.sub(pair.fee)).mul(reserveOut))
        bottomR = bottomR.mul(pair.precisionMultiplier.mul(reserveIn))
        tokenIn = tokenOut
    }

    let aIn: BigNumber = top.div(bottomL.sub(bottomR))
    if (bottomL.gt(bottomR)) {

        console.log(`Expected AmountIn = ${aIn}`)
    }

    return aIn
}

