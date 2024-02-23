import { BigNumber } from "ethers"
import { IERC20__factory, IUniswapV2Pair__factory } from "../../typechain"
import { providerHTTP } from "./configs"
import { Pair, Token } from "./entities"
import bn from 'bignumber.js'

// Uniswap v2 pair
const REGEX_PATTERN_FOR_UNISWAP_V2_PAIR_THAT_DONT_HAVE_LIMITS_ON_THE_SWAP_FUNCTION = /022c0d9f146101.e57806306fdde03146102..5780630902f1ac146102/

export const knownTokens: { [key: string]: Token } = {}

export const knownPairs: { [key: string]: Pair[] } = {}

const sqrt = (value: BigNumber): BigNumber => {
    try {

        const scaledValue = value
        const scaledResult = BigNumber.from(new bn(scaledValue.toString()).sqrt().toFixed().split('.')[0])
        const result = scaledResult
        return result
    } catch (e) {
        console.log(e)
        return BigNumber.from(0)
    }
}

const isValidV2Pair = (code: string): boolean => {
    const match = REGEX_PATTERN_FOR_UNISWAP_V2_PAIR_THAT_DONT_HAVE_LIMITS_ON_THE_SWAP_FUNCTION.exec(code)
    const indexOfMAtch = match ? match.index : -1 // Return -1 if no match is found, similar to indexOf

    if (indexOfMAtch == -1) {
        return false
    } else {
        return true
    }
}

const findFee = (code: string): BigNumber | null => {
    let fee: BigNumber | null = null
    const nearFeeBytes = "fd5b600061"
    const feeLocalStringBroad = code.indexOf(nearFeeBytes)
    if (feeLocalStringBroad != -1) {
        const nearestOffSetToTheFeeBytes = feeLocalStringBroad + nearFeeBytes.length
        const offsetByPassingTheFeeBytes = 20
        const containingTheFeeBytes = code.slice(nearestOffSetToTheFeeBytes, nearestOffSetToTheFeeBytes + offsetByPassingTheFeeBytes)
        const indexOfPushingTheFeeOnStack = containingTheFeeBytes.indexOf("60") + 2
        const feeBytes = containingTheFeeBytes.slice(indexOfPushingTheFeeOnStack, indexOfPushingTheFeeOnStack + 2)
        fee = BigNumber.from(`0x0${feeBytes}`)
    }

    return fee
}

const findPrecisionMultiplier = (code: string): BigNumber | null => {
    const precisionMultiplier = [1000000, 100000000].reduce<BigNumber | null>((prev, cur) => {
        if (prev != null) {
            return prev
        }

        if (code.indexOf(BigNumber.from(cur)._hex.slice(2)) != -1) {
            return sqrt(BigNumber.from(cur))
        }

        return null
    }, null)

    return precisionMultiplier
}

const fetchTokenDecimals = async (tokenAddress: string): Promise<number> => {
    const decimals = await IERC20__factory.connect(tokenAddress, providerHTTP).decimals()

    return decimals
}

export const decodePairData = async (p: string): Promise<Pair | undefined> => {
    try {
        const iPair = IUniswapV2Pair__factory.connect(p, providerHTTP)

        const code = await providerHTTP.getCode(p)

        if (!isValidV2Pair(code)) {
            throw `${p} Not Uniswap V2 Pair`
        }

        let fee = findFee(code)

        if (fee == null) {
            throw `${p} Couldn't Find Fee`
        }

        const precisionMultiplier = findPrecisionMultiplier(code)

        if (precisionMultiplier == null) {
            throw `${p} Couldn't Find Precision Multiplier`
        }

        const [token0Address, token1Address, reserves] = [
            await iPair.token0(),
            await iPair.token1(),
            await iPair.getReserves()
        ]

        if (knownTokens[token0Address] == undefined) {
            const decimals = await fetchTokenDecimals(token0Address)
            knownTokens[token0Address] = {
                address: token0Address,
                decimals
            }
        }

        if (knownTokens[token1Address] == undefined) {
            const decimals = await fetchTokenDecimals(token1Address)
            knownTokens[token1Address] = {
                address: token1Address,
                decimals
            }
        }

        const pair = {
            address: p,
            reserve0: reserves[0],
            reserve1: reserves[1],
            token0: knownTokens[token0Address],
            token1: knownTokens[token1Address],
            fee: fee,
            precisionMultiplier: precisionMultiplier
        }
        const pairKey = `${token0Address}-${token1Address}`

        if (knownPairs[pairKey] == undefined) {
            knownPairs[pairKey] = []
        }

        knownPairs[pairKey].push(pair)

        return pair
    } catch (e) {
        console.log(e)
        return undefined
    }
}
