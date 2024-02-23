import { TransactionRequest } from "@ethersproject/abstract-provider"
import { Provider } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber, ethers, Signer } from "ethers"
import { Deferrable } from "ethers/lib/utils"
import fetch from "node-fetch"

let comulativeGasPaidEstimated = BigNumber.from(0)
let comulativeGasPaid = BigNumber.from(0)

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


export class GasAwareSigner extends ethers.Signer {
    constructor(
        readonly provider: ethers.providers.JsonRpcProvider,
        protected readonly _signerWithAddress: SignerWithAddress,
    ) {
        super()
    }

    // Connects this signer to a provider
    connect(provider: Provider): Signer {
        return this.connect(provider)
    }

    // Returns the address associated with this signer
    async getAddress(): Promise<string> {
        return this._signerWithAddress.getAddress()
    }

    get address(): string {
        console.log(this._signerWithAddress.address)
        return this._signerWithAddress.address
    }

    async sendTransaction(
        _transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
    ): Promise<ethers.providers.TransactionResponse> {
        let gasLimit: BigNumber
        try {
            gasLimit = (await this.provider.estimateGas(_transaction)).mul(2)
        } catch (e) {
            gasLimit = BigNumber.from(3_000_000)
        }
        const gasDataResult = await fetchGasData()

        if (gasDataResult.error != null) {
            throw gasDataResult.error
        }

        comulativeGasPaidEstimated = comulativeGasPaidEstimated.add(
            gasLimit.mul(BigNumber.from(gasDataResult.data?.rapidgaspricegwei.toNumber())),
        )

        console.log(gasDataResult.data?.rapidgaspricegwei, gasLimit, comulativeGasPaidEstimated, comulativeGasPaid)
        const nonce = this._signerWithAddress.getTransactionCount()
        const sendedTransaction = await this._signerWithAddress.sendTransaction({
            gasPrice: gasDataResult.data?.rapidgaspricegwei,
            gasLimit,
            nonce,
            ..._transaction,
        })

        const r = await sendedTransaction.wait(3)
        comulativeGasPaid = comulativeGasPaid.add(r.cumulativeGasUsed)

        return sendedTransaction
    }

    // Signs a transaction
    async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
        return this._signerWithAddress.signTransaction(transaction)
    }

    // Signs a message
    async signMessage(message: string | Uint8Array): Promise<string> {
        return this._signerWithAddress.signMessage(message)
    }

    public _signTypedData(...params: Parameters<ethers.providers.JsonRpcSigner["_signTypedData"]>): Promise<string> {
        return this._signerWithAddress._signTypedData(...params)
    }

    public toJSON() {
        return `<GasAwareSigner ${this.address}>`
    }
}
