import { appendFileSync, readFileSync, writeFileSync } from "fs"
import { Cycle, Pair, Token } from "./entities"
import * as path from 'path'
import { readPairsFromCSV } from "./read_from_files"
const currentDirectory = path.dirname(__filename)

export const pairsDataFilePath = path.join(currentDirectory, 'data', 'pairs_data.csv')
export const tokensDataFilePath = path.join(currentDirectory, 'data', 'tokens_data.csv')
export const cyclesDataFilePath = path.join(currentDirectory, 'data', 'cycles_data.csv')

export const savePairsToCSV = (pairs: Pair[]) => {
    const headers = 'pair,token0Address,token1Address,fee,precisionMultiplier\n'
    const data = pairs.map(pair => {
        return `${pair.address},${pair.token0.address},${pair.token1.address},${pair.fee.toString()},${pair.precisionMultiplier.toString()}`
    }).join('\n')

    appendFileSync(pairsDataFilePath, data + '\n')
}

export const saveTokensToCSV = (tokens: Token[]) => {
    const headers = 'address,decimals\n'
    const data = tokens.map(token => {
        return `${token.address},${token.decimals}`
    }).join('\n')

    appendFileSync(tokensDataFilePath, data + '\n')
}

export const saveCycleToCSV = (cycle: Cycle) => {
    const data = `${cycle.initialToken.address},${cycle.pairs.length},${cycle.pairs.map(p => p.address).join(',')}\n`
    appendFileSync(cyclesDataFilePath, data)
}

export const deduplicatePairsFromCSV = () => {
    const pairs = readPairsFromCSV(undefined)
    const pairsMap: { [key: string]: Pair } = {}

    pairs.forEach(p => {
        pairsMap[p.address] = p
    })

    savePairsToCSV(Object.values(pairsMap))
}
