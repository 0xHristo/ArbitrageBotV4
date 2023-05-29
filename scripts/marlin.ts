import { BigNumber, providers, Wallet } from "ethers"
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle"
import { ethers } from "hardhat"
import { IERC20__factory } from "../typechain"
import { BaseAssets } from "../tokens/BaseAssets"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { GasPrice, getNetworkGasPrice } from "@enzoferey/network-gas-price"

function getGweiEthers(gweiAmount: number): BigNumber {
    return ethers.utils.parseUnits(Math.ceil(gweiAmount).toString(), "gwei")
}

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

async function main() {
    // Standard json rpc provider directly from ethers.js (NOT Flashbots)
    // create the base provider
    let base = new ethers.providers.JsonRpcProvider({ url: "https://polygon-mainnet.g.alchemy.com/v2/<api-key>" }, 137)
    await base.ready
    const user = new ethers.Wallet(PRIVATE_KEY, base)
    // wrap it with the marlin relay provider
    let provider = new FlashbotsBundleProvider(base, user, { url: 'http://bor.txrelay.marlin.org/' }, 137)
    const networkGasPrice: GasPrice = await getNetworkGasPrice("polygon")


    const CONTRACT_ADDRESS = "0x0a..<contract-address>"
    const ABI = ["function coinbasetransfer() payable"]
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, user)
    const wmatic = IERC20__factory.connect(BaseAssets.WMATIC.address, user)

    const txs = [
        {
            signer: user,
            transaction: {
                ...await wmatic.populateTransaction.approve(
                    ExchangeExtractor,
                    BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), { type: 2 }),
                value: ethers.utils.parseEther("0.1"),
                gasLimit: 300000,
                maxPriorityFeePerGas: getGweiEthers(
                    networkGasPrice.asap.maxPriorityFeePerGas
                ),
                maxFeePerGas: getGweiEthers(networkGasPrice.asap.maxFeePerGas),
            }
        },
    ]

    const blk = await base.getBlockNumber()

    // send bundle to marlin relay
    const result = await provider.sendBundle(txs, blk + 1)
    console.log(result)
}

main().catch(console.error)