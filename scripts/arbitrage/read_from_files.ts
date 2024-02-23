import { readFileSync } from "fs"
import { cyclesDataFilePath, pairsDataFilePath, tokensDataFilePath } from "./write_to_files"
import { Cycle, Pair, Token } from "./entities"
import { BigNumber } from "ethers"

export const readPairsFromCSV = (allowedTokens: { [key: string]: boolean } | undefined): Pair[] => {
    const tokens = readTokensFromTokensCSV()
    const data = readFileSync(pairsDataFilePath, { encoding: "utf-8" })
    const pairs: Pair[] = []
    data.split("\n").forEach((row, i) => {
        const cells = row.split(',')
        try {
            if (allowedTokens == undefined || (allowedTokens[cells[1]] == true && allowedTokens[cells[2]] == true)) {
                pairs.push({
                    address: cells[0],
                    token0: tokens[cells[1]],
                    token1: tokens[cells[2]],
                    fee: BigNumber.from(cells[3]),
                    precisionMultiplier: BigNumber.from(cells[4]),
                    reserve0: BigNumber.from(0),
                    reserve1: BigNumber.from(0)
                })
            }
        } catch (e) {
            throw `Error in row ${i} in ${pairsDataFilePath}`
        }

    })

    return pairs
}

export const readPairsFromCyclesCSV = (): Pair[] => {
    const tokens = readTokensFromTokensCSV()
    const pairData = readFileSync(pairsDataFilePath, { encoding: "utf-8" })
    const pairsMap: { [key: string]: Pair } = {}
    const used: { [key: string]: boolean } = {}
    const cyclesPairs: Pair[] = []

    pairData.split("\n").forEach((row, i) => {
        const cells = row.split(',')
        try {
            pairsMap[cells[0]] = {
                address: cells[0],
                token0: tokens[cells[1]],
                token1: tokens[cells[2]],
                fee: BigNumber.from(cells[3]),
                precisionMultiplier: BigNumber.from(cells[4]),
                reserve0: BigNumber.from(0),
                reserve1: BigNumber.from(0)
            }
        } catch (e) {
            throw `Error in row ${i} in ${pairsDataFilePath}`
        }
    })
    const cyclesData = readFileSync(cyclesDataFilePath, { encoding: "utf-8" })

    cyclesData.split('\n').forEach((row, i) => {
        const cells = row.split(',')
        const initialToken = tokens[cells[0]]

        if (initialToken === undefined) {
            console.log(cells[0])
            throw `Unknown token in cycle on row ${i}`
        }

        const pairsInCycle = Number(cells[1])
        if (isNaN(pairsInCycle)) {
            throw `Missing pair count in cycle on row ${i}`
        }

        for (let i = 0; i < pairsInCycle; i++) {
            const pair = pairsMap[cells[2 + i]]

            if (pair == undefined) {
                console.log(cells[2 + i])
                throw `Unknown pair in cycle on row ${i}`
            }

            if (used[pair.address] == undefined) {
                cyclesPairs.push(pair)
                used[pair.address] = true
            }
        }
    })

    return cyclesPairs

}

export const readTokensFromTokensCSV = (): { [key: string]: Token } => {
    const data = readFileSync(tokensDataFilePath, { encoding: "utf-8" })
    const tokens: { [key: string]: Token } = {}

    data.split('\n').forEach(row => {
        const cells = row.split(',')
        const address = cells[0]
        const decimals = Number(cells[1])

        tokens[address] = {
            address,
            decimals
        }
    })

    console.log(tokens.length)
    return tokens
}

export const readOnlyTokensFromPairsCSV = (): string[] => {
    const data = readFileSync(pairsDataFilePath, { encoding: "utf-8" })
    const tokens: string[] = []

    data.split('\n').forEach(row => {
        const cells = row.split(',')

        tokens.push(cells[1])
        tokens.push(cells[2])
    })

    return tokens
}

export const readCyclesFromCyclesCSV = (pairsMap: { [key: string]: Pair }): Cycle[] => {
    const tokens = readTokensFromTokensCSV()
    const cycles: Cycle[] = []

    const data = readFileSync(cyclesDataFilePath, { encoding: "utf-8" })
    data.split('\n').forEach((row, i) => {
        const cells = row.split(',')
        const initialToken = tokens[cells[0]]

        if (initialToken === undefined) {
            console.log(cells[0])
            throw `Unknown token in cycle on row ${i}`
        }

        const pairsInCycle = Number(cells[1])
        if (isNaN(pairsInCycle)) {
            throw `Missing pair count in cycle on row ${i}`
        }

        const pairs: Pair[] = []
        for (let i = 0; i < pairsInCycle; i++) {
            const pair = pairsMap[cells[2 + i]]

            if (pair == undefined) {
                console.log(cells[2 + i])
                throw `Unknown pair in cycle on row ${i}`
            }

            pairs.push(pair)
        }

        cycles.push({
            initialToken,
            pairs
        })
    })

    return cycles
}