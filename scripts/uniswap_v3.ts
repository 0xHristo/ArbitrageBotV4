import { BigNumber, ethers } from 'ethers'
import { Pool } from '@uniswap/v3-sdk'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { IERC20, IERC20Uniswap__factory, IERC20__factory, IUniswapV3Pool, IUniswapV3Pool__factory } from '../typechain'
import JSBI from 'jsbi'

interface SwapParameters {
    pool: Pool
    amountIn: BigNumber
    tokenInAddress: string
}

interface PoolState {
    liquidity: BigNumber
}

const providerHTTP = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64")

const getToken = async (address: string): Promise<Token> => {
    if (tokens[address] != undefined) {
        return tokens[address]
    }

    const iToken = IERC20Uniswap__factory.connect(address, providerHTTP)

    const p = [
        iToken.decimals(),
        iToken.symbol()
    ]

    const [decimals, symbol] = await Promise.all(p)
    tokens[address] = new Token(137, address, decimals as number, symbol as string)

    return tokens[address]
}

type Slot0 = {
    sqrtPriceX96: BigNumber
    tick: number
    observationIndex: number
    observationCardinality: number
    observationCardinalityNext: number
    feeProtocol: number
    unlocked: boolean
}

export interface TickDataProvider {
    /**
     * Return information corresponding to a specific tick
     * @param tick the tick to load
     */
    getTick(tick: number): Promise<{
        liquidityNet: any
    }>
    /**
     * Return the next tick that is initialized within a single word
     * @param tick The current tick
     * @param lte Whether the next tick should be lte the current tick
     * @param tickSpacing The tick spacing of the pool
     */
    nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): Promise<[number, boolean]>
}

function mostSignificantBit(x: number): number {
    return x > 0 ? Math.floor(Math.log2(x)) : -1
}

function leastSignificantBit(x: number): number {
    return x > 0 ? Math.floor(Math.log2(x & -x)) : -1
}

function position(tick: number): [number, number] {
    // Calculate the word position (wordPos) by shifting the bits right by 8 positions.
    const wordPos = tick >> 8

    // Calculate the bit position (bitPos) by taking the remainder when dividing by 256.
    const bitPos = tick % 256

    return [wordPos, bitPos]
}


const tickDataProvider = (pool: IUniswapV3Pool): TickDataProvider => {
    const dp: TickDataProvider = {
        async getTick(tick: number): Promise<{ liquidityNet: any }> {
            // Implement your logic to fetch tick information from the poolContract
            const tickData = await pool.ticks(tick)
            const t = tickData.liquidityNet.toString()
            return {
                liquidityNet: t,
            }
        },

        async nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): Promise<[number, boolean]> {
            let compressed = Math.floor(tick / tickSpacing)
            if (tick < 0 && tick % tickSpacing !== 0) compressed-- // Round towards negative infinity

            let next: number
            let initialized: boolean

            // Calculate the word position and bit position using the provided 'position' function
            const [wordPos, bitPos] = position(compressed)

            // Declare variables for the mask and masked values
            let mask: bigint
            let masked: bigint

            if (lte) {
                // Calculate the mask to retrieve all the 1s at or to the right of the current bitPos
                mask = (BigInt(1) << BigInt(bitPos)) - BigInt(1) + (BigInt(1) << BigInt(bitPos))
                masked = (BigInt(((await pool.tickBitmap(wordPos)).toString())) || BigInt(0)) & mask

                initialized = masked !== BigInt(0)
                next = initialized
                    ? (compressed - Number(bitPos - mostSignificantBit(Number(masked)))) * tickSpacing
                    : (compressed - bitPos) * tickSpacing
            } else {
                // Calculate the word and bit positions for the next tick
                const [nextWordPos, nextBitPos] = position(compressed + 1)

                // Calculate the mask to retrieve all the 1s at or to the left of the next bitPos
                mask = ~(BigInt(1) << BigInt(nextBitPos)) + BigInt(1)
                masked = (BigInt(((await pool.tickBitmap(nextWordPos)).toString())) || BigInt(0)) & mask

                initialized = masked !== BigInt(0)
                next = initialized
                    ? (compressed + 1 + leastSignificantBit(Number(masked)) - nextBitPos) * tickSpacing
                    : (compressed + 1 + 255 - nextBitPos) * tickSpacing // Adjusted to use 255 for JS's max uint8 value
            }

            return [next, initialized]

        }
    }

    return dp
}

const getPool = async (address: string): Promise<Pool | undefined> => {
    try {
        const iPool = IUniswapV3Pool__factory.connect(address, providerHTTP)

        const p = [
            iPool.token0(),
            iPool.token1(),
            iPool.fee(),
            iPool.slot0(),
            iPool.liquidity()
        ]

        const [token0, token1, fee, slot0, liquidity] = await Promise.all(p)

        const pool = new Pool(
            await getToken(token0 as string),
            await getToken(token1 as string),
            fee as number,
            ((slot0 as Slot0).sqrtPriceX96 as BigNumber).toString(),
            (liquidity as BigNumber).toString(),
            (slot0 as Slot0).tick,
            tickDataProvider(iPool)
        )

        return pool
    } catch (e) {
        console.error(`Did not fetch data for pool: ${address}`)
    }
}

async function calculateSwapAmount({ pool, tokenInAddress, amountIn }: SwapParameters): Promise<CurrencyAmount<Token> | undefined> {
    // Assuming you have a way to fetch or interact with the pool's state
    // Create a pool instance using the fetched state. The parameters for the Pool constructor are hypothetical.
    const tokenIn = pool.token0.address == tokenInAddress ? pool.token0 : pool.token1

    // Convert amountIn to a CurrencyAmount instance
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, amountIn.toString())

    // Calculate the output amount. This requires implementing or utilizing existing Uniswap SDK or similar library functions,
    // which involve complex calculations based on the current state of the pool.
    // For example, using the SDK to simulate the swap might look like this, but details depend on your setup:
    console.log("SwapResult")
    console.log(pool)
    const [swapResult] = await pool.getOutputAmount(amountInCurrency)

    // Assuming swapResult includes an amount which might need conversion back to BigNumber
    return swapResult
}

// Utility functions like getTickData and getPoolState need to be implemented based on Uniswap V3 smart contracts and the Ethereum network interaction.
const poolsAddresses = [
    "0xa374094527e1673a86de625aa59517c5de346d32",
    "0x9b08288c3be4f62bbf8d1c20ac9c5e6f9467d8b7",
    "0xb6e57ed85c4c9dbfef2a68711e9d6f36c56e0fcb",
    "0x0a28c2f5e0e8463e047c203f00f649812ae67e4f",
    "0x86f1d8390222a3691c28938ec7404a1661e618e0",
    "0x7b925e617aefd7fb3a93abe3a701135d7a1ba710",
    "0x45dda9cb7c25131df268515131f647d726f50608",
    "0x5b41eedcfc8e0ae47493d4945aa1ae4fe05430ff",
    "0x55caabb0d2b704fd0ef8192a7e35d8837e678207",
    "0xdac8a8e6dbf8c690ec6815e0ff03491b2770255d",
    "0xeecb5db986c20a8c88d8332e7e252a9671565751",
    "0x33c4f0043e2e988b3c2e9c77e2c670efe709bfe3",
    "0xa4d8c89f0c20efbe54cba9e7e7a7e509056228d9",
    "0x9ceff2f5138fc59eb925d270b8a7a9c02a1810f2",
    "0xec15624fbb314eb05baad4ca49b7904c0cb6b645",
    "0x31083a78e11b18e450fd139f9abea98cd53181b7",
    "0xd36ec33c8bed5a9f7b6630855f1533455b98a418",
    "0x479e1b71a702a595e19b6d5932cd5c863ab57ee0",
    "0xa35e3bca4377b3fd99b5ede28fcc3d154e128745",
    "0x254aa3a898071d6a2da0db11da73b02b4646078f",
    "0x647fb01a63de9a551b39c7915693b25e6bcec502",
    "0x504e73e75e5e88500f632ffe130fc91fce1559da",
    "0x1a34eabbe928bf431b679959379b2225d60d9cda",
    "0xbb98b3d2b18aef63a3178023a920971cf5f29be4",
]

const tokens: { [key: string]: Token } = {}
const pools: { [key: string]: Pool } = {}
const graph: { [key: string]: string[] } = {}

const token = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
const amountIn = BigNumber.from(1e7)

const tokensFrequency: { [key: string]: number } = {}

interface Cycle {
    startingToken: Token
    pools: Pool[]
}

function findThreePoolCycles(
    tokens: { [key: string]: Token },
    pools: { [key: string]: Pool },
    graph: { [key: string]: string[] }
): Cycle[] {
    const cycles: Cycle[] = []

    function dfs(
        currentToken: Token,
        startToken: Token,
        visitedTokens: Set<string>,
        path: Pool[]
    ) {
        if (visitedTokens.has(currentToken.address)) {
            if (currentToken === startToken && path.length === 3) {
                cycles.push({ startingToken: startToken, pools: [...path] })
            }
            return
        }

        visitedTokens.add(currentToken.address)

        const poolAddresses = graph[currentToken.address] || []

        for (const poolAddress of poolAddresses) {
            const pool = pools[poolAddress]
            if (!pool) continue

            const nextToken = pool.token0.address === currentToken.address ? pool.token1 : pool.token0

            dfs(nextToken, startToken, visitedTokens, [...path, pool])
        }

        visitedTokens.delete(currentToken.address)
    }

    for (const tokenAddress in tokens) {
        const token = tokens[tokenAddress]
        dfs(token, token, new Set<string>(), [])
    }

    return cycles
}

const main = async () => {
    const p = poolsAddresses.map(pA => {
        return getPool(pA)
    })

    const fetchedPools = await Promise.all(p)
    fetchedPools.forEach((p, i) => {
        if (p != undefined) {
            pools[poolsAddresses[i]] = p

            if (graph[p.token0.address] == undefined) {
                graph[p.token0.address] = [poolsAddresses[i]]
            } else {
                graph[p.token0.address].push(poolsAddresses[i])
            }

            if (graph[p.token1.address] == undefined) {
                graph[p.token1.address] = [poolsAddresses[i]]
            } else {
                graph[p.token1.address].push(poolsAddresses[i])
            }
        }
    })

    Object.values(pools).forEach(p => {
        console.log(p.token0.address, '-', p.token1.address)

        if (tokensFrequency[p.token0.address] == undefined) {
            tokensFrequency[p.token0.address] = 0
        }

        tokensFrequency[p.token0.address]++

        if (tokensFrequency[p.token1.address] == undefined) {
            tokensFrequency[p.token1.address] = 0
        }

        tokensFrequency[p.token1.address]++


    })

    const cycles = findThreePoolCycles(tokens, pools, graph).filter(c => c.startingToken.address == "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270")

    for (let index = 1; index < cycles.length; index++) {
        const cycle = cycles[index]

        console.log("In cycle", cycle.startingToken.address)
        const aIn = BigNumber.from(10).pow(18)
        const aOut1 = await calculateSwapAmount({
            pool: cycle.pools[0],
            tokenInAddress: cycle.startingToken.address,
            amountIn: aIn
        })
        console.log(1)
        if (aOut1 != undefined) {
            const token2 = cycle.startingToken.address == cycle.pools[0].token0.address ? cycle.pools[0].token1.address : cycle.pools[0].token0.address

            const aOut2 = await calculateSwapAmount({
                pool: cycle.pools[1],
                tokenInAddress: token2,
                amountIn: BigNumber.from(aOut1.quotient.toString())
            })
            console.log(2)

            if (aOut2 != undefined) {
                const token3 = token2 == cycle.pools[1].token0.address ? cycle.pools[1].token1.address : cycle.pools[1].token0.address

                const aOut3 = await calculateSwapAmount({
                    pool: cycle.pools[2],
                    tokenInAddress: token3,
                    amountIn: BigNumber.from(aOut2.quotient.toString())
                })
                console.log(3)

                if (aOut3 != undefined) {
                    console.log(aIn.toString(), BigNumber.from(aOut1.quotient.toString()).toString(), BigNumber.from(aOut2.quotient.toString()).toString(), BigNumber.from(aOut3.quotient.toString()).toString())
                }
            }
        }

    }
}

main()