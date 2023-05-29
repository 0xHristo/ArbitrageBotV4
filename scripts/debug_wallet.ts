import { ethers, network } from "hardhat"
import { IERC20__factory } from "../typechain"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { BigNumber, Wallet } from "ethers"
import { GasPrice, getNetworkGasPrice } from "@enzoferey/network-gas-price"
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle"
import { BaseAssets } from "../tokens/BaseAssets"

function getGweiEthers(gweiAmount: number): BigNumber {
    return ethers.utils.parseUnits(Math.ceil(gweiAmount).toString(), "gwei")
}

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const main = async () => {
    let base = new ethers.providers.JsonRpcProvider(
        { url: "https://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64" })
    await base.ready
    const wallet = new ethers.Wallet(PRIVATE_KEY, base)
    let provider = new FlashbotsBundleProvider(
        base,
        wallet,
        { url: 'http://bor.txrelay.marlin.org/ ' },
        137)
    await base.ready
    console.log(wallet.address)
    const nonce = await wallet.getTransactionCount() + 1
    console.log(nonce)
    const networkGasPrice: GasPrice = await getNetworkGasPrice("polygon")

    const wmatic = IERC20__factory.connect(BaseAssets.WMATIC.address, wallet)


//    const t = await wmatic.approve(
//         ExchangeExtractor,
//         BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), {
//         type: 2,
//         maxPriorityFeePerGas: getGweiEthers(
//             networkGasPrice.asap.maxPriorityFeePerGas
//         ),
//         maxFeePerGas: getGweiEthers(networkGasPrice.asap.maxFeePerGas),
//     })
//     console.log(t.hash)
    const blk = await ethers.provider.getBlockNumber()
    console.log(networkGasPrice.asap)
    try {
        // send bundle to marlin relay
        const result = await provider.sendBundle([
            {
                transaction: await wmatic.populateTransaction.approve(
                    ExchangeExtractor,
                    BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), {
                    type: 2,
                    customData: {
                        "chainId": 137,
                        "chainID": 137
                    },
                    maxPriorityFeePerGas: getGweiEthers(
                        networkGasPrice.asap.maxPriorityFeePerGas
                    ),
                    maxFeePerGas: getGweiEthers(networkGasPrice.asap.maxFeePerGas),
                }),
                signer: wallet
            }

        ], blk + 1)
        console.log(result)
    } catch (e) {
        console.log(e)
    }

}

main().catch(console.error)