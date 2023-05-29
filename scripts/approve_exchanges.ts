import { GasPrice, getNetworkGasPrice } from "@enzoferey/network-gas-price"
import fs from "fs"
import { ExchangeExtractorV4__factory, IERC20__factory } from "../typechain"
// import { Action, blackListedTokens, getGweiEthers, initialToken, tokensWithTransactionAbove } from "./historic_data"
import { ethers } from "hardhat"
import { Dexes } from "../tokens/Dexes"
import { BigNumber } from "ethers"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { blackListedTokens, initialToken, tokensWithTransactionAbove } from "./constants"
import { Action } from "./models/actions"
import { getGweiEthers } from "./helpers"

const main = async () => {
    const networkGasPrice: GasPrice = await getNetworkGasPrice("polygon")
    const tokensMap = JSON.parse(await fs.promises.readFile(`exchanges/historic_pairs_tokens_map.log`, { encoding: "utf-8" }))
    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)

    const wmatic = IERC20__factory.connect(initialToken.address, deployer)

    const approvesPromises: Promise<Action>[] =
        Object
            .keys(tokensMap)
            .filter(a => tokensMap[a] > tokensWithTransactionAbove && blackListedTokens.indexOf(a) == -1)
            .map<Promise<Action>>(async token => {
                const tnx = await wmatic.populateTransaction.approve(
                    Dexes.apeswap,
                    BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"))

                return {
                    address: token,
                    data: tnx.data!
                }
            })

    const approvesInTransaction = 200
    const approves: Array<Action> = await Promise.all(approvesPromises)

    console.log(approves.length)
    for (let i = 0; i < approves.length / approvesInTransaction + 1; i++) {
        console.log(i, approves.length / approvesInTransaction)
        const currentApproves = approves.slice(i * approvesInTransaction, (i + 1) * approvesInTransaction)

        const tnx = await exchangeExtractor.run(
            currentApproves.map<string>((action: Action): string => action.address),
            currentApproves.map<string>((action: Action): string => action.data),
            {
                gasLimit: 10000000,
                // gasPrice: 30000096308436836
                maxPriorityFeePerGas: getGweiEthers(
                    networkGasPrice.high.maxPriorityFeePerGas
                ),
                maxFeePerGas: getGweiEthers(networkGasPrice.high.maxFeePerGas),
            }
        )
        // console.log(tnx.data)
        console.log(tnx.hash)
        await tnx.wait()
    }


}

main()