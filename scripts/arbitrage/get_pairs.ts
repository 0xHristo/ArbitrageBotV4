import { decodePairData } from "./decode_pairs"
import { Pair, Token } from "./entities"
import { all_pairs } from "./input/list_of_pairs"
import { savePairsToCSV, saveTokensToCSV } from "./write_to_files"
import { decodeToken } from "./decode_token"
import { readOnlyTokensFromPairsCSV } from "./read_from_files"

export const getPairData = async (pairs: string[]): Promise<Pair[]> => {
    let pairsData: Pair[] = []
    const pageSize = 30

    for (let page = 0; (page - 1) * pageSize < pairs.length; page++) {
        const fetchingPromises: Promise<Pair | undefined>[] = pairs.splice(0, Math.min(pageSize, pairs.length)).map((p) => decodePairData(p))
        const fetchedData = await Promise.all(fetchingPromises)
        const onlyPairs = fetchedData.filter(p => p != undefined)
            .map((p: Pair | undefined) => p as Pair)

        savePairsToCSV(onlyPairs)

        pairsData = [...pairsData, ...onlyPairs]

        await new Promise((res) => {
            setTimeout(() => {
                res(1)
            }, 400)
        })
    }

    return pairsData
}

export const getTokensData = async (tokens: string[]) => {
    const knownTokens: { [key: string]: boolean } = {}
    const filteredTokens: string[] = []

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]

        if (knownTokens[token] != undefined) {
            continue
        } else {
            filteredTokens.push(token)
            knownTokens[token] = true
        }

    }
    const pageSize = 6

    for (let page = 0; (page - 1) * pageSize < filteredTokens.length; page++) {
        console.log(`${page} of ${Math.ceil(filteredTokens.length / pageSize)}`)

        const promisses = []

        for(let j = page * pageSize; j < Math.min((page + 1) * pageSize, filteredTokens.length); j++) {
            promisses.push(decodeToken(filteredTokens[j]))    
        }

        const parsedTokens = await Promise.all(promisses)
        saveTokensToCSV(parsedTokens)
    }
}

const main = async () => {
    const tokens = readOnlyTokensFromPairsCSV()
    await getTokensData(tokens)
}

main()