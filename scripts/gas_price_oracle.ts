import { BigNumber } from "ethers"
import fetch from "node-fetch"

export const gweiToEth = (gwei: BigNumber): BigNumber => {
    const oneEthInGwei = BigNumber.from("1000000000") // 1 ETH = 10^9 Gwei
    return gwei.mul(oneEthInGwei)
}

export interface Result<T> {
    error?: Error
    data?: T
}

interface GasApiResponse {
    status: string
    message: string
    result: {
        pendingcount: string
        avgminingblocktxcountsize: number
        avgtxnsperblock: number
        mingaspricegwei: number
        avgnetworkutilization: number
        rapidgaspricegwei: number
        fastgaspricegwei: number
        standardgaspricegwei: number
    }
}

export interface EstimatedGas {
    mingaspricegwei: BigNumber
    avgnetworkutilization: number
    rapidgaspricegwei: BigNumber
    fastgaspricegwei: BigNumber
    standardgaspricegwei: BigNumber
}

let cache: { time: number; data: Result<EstimatedGas> } | null = null

export const fetchGasData = async (): Promise<Result<EstimatedGas>> => {
    const url = "https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=pendingpooltxgweidata"
    const now = Date.now()

    // Check if cached data is available and still valid
    if (cache && now - cache.time < 2000) {
        // 2000 milliseconds = 2 seconds
        return cache.data
    }

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        const data: GasApiResponse = await response.json()

        const result = {
            data: {
                mingaspricegwei: gweiToEth(BigNumber.from(data.result.mingaspricegwei)),
                rapidgaspricegwei: gweiToEth(BigNumber.from(data.result.rapidgaspricegwei)),
                fastgaspricegwei: gweiToEth(BigNumber.from(data.result.fastgaspricegwei)),
                standardgaspricegwei: gweiToEth(BigNumber.from(data.result.standardgaspricegwei)),
                avgnetworkutilization: data.result.avgminingblocktxcountsize,
            },
        }

        // Update cache
        cache = { time: Date.now(), data: result }

        return result
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error }
        } else {
            return { error: new Error((error as any).message) }
        }
    }
}
