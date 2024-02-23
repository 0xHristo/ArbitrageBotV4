import { ethers } from "hardhat"
import { decodeToken } from "./decode_token"
import { Pair, Token } from "./entities"
import { updatePairReservs } from "./get_reserves"
import { readOnlyTokensFromPairsCSV, readPairsFromCSV } from "./read_from_files"
import { saveCycleToCSV, saveTokensToCSV } from "./write_to_files"
import { allowedTokens, wmatic } from "./configs"

let tokensByPairMap: { [key: string]: Pair[] } = {}

export const getTokensByPairsMap = (pairs: Pair[]): { [key: string]: Pair[] } => {
    const tokensByPairsMap: { [key: string]: Pair[] } = {}

    for (let i = 0; i < pairs.length; i++) {

        const pair = pairs[i]
        try {
            if (tokensByPairsMap[pair.token0.address] == undefined) {
                tokensByPairsMap[pair.token0.address] = [pair]
            } else {
                tokensByPairsMap[pair.token0.address].push(pair)
            }

            if (tokensByPairsMap[pair.token1.address] == undefined) {
                tokensByPairsMap[pair.token1.address] = [pair]
            } else {
                tokensByPairsMap[pair.token1.address].push(pair)
            }
        } catch (error) {
            console.log(pair)
            console.log(error)
            throw `Error in pair: ${pair.address}`
        }
    }

    return tokensByPairsMap
}

function findPaths(startToken: Token, lengthN: number): Pair[][] {
    let allPaths: Pair[][] = []
    let visitedPairs: Set<string> = new Set()

    function dfs(currentToken: Token, path: Pair[], depth: number) {
        if (depth === lengthN && currentToken.address === startToken.address) {
            allPaths.push([...path])
            saveCycleToCSV({
                initialToken: startToken,
                pairs: path
            })
            return
        }
        if (depth >= lengthN) return

        const pairs = tokensByPairMap[currentToken.address] || []
        for (const pair of pairs) {
            if (visitedPairs.has(pair.address)) continue
            if (pair.reserve0.eq(0) || pair.reserve1.eq(0)) continue
            if (allowedTokens[pair.token0.address] == undefined || allowedTokens[pair.token1.address] == undefined) continue

            visitedPairs.add(pair.address)
            const nextToken = pair.token0.address === currentToken.address ? pair.token1 : pair.token0
            dfs(nextToken, [...path, pair], depth + 1)
            visitedPairs.delete(pair.address)
        }
    }

    dfs(startToken, [], 0)
    return allPaths
}

export const generateCycles = async () => {
    try {
        const pairs = readPairsFromCSV(allowedTokens)

        await updatePairReservs(pairs)

        tokensByPairMap = getTokensByPairsMap(pairs)

        console.log(findPaths(wmatic, 4))
    } catch (e) {
        console.log(e)
    }
}