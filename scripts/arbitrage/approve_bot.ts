import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory, IERC20__factory } from "../../typechain"
import { ExchangeExtractor } from "../../tokens/ExchangeExtractor"
import { amountIn, wmatic } from "./configs"

export const approve = async () => {
    const [wallet] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(wallet).attach(ExchangeExtractor)
    const ierc20 = IERC20__factory.connect(wmatic.address, wallet)
    const allowance = await ierc20.allowance(wallet.address, exchangeExtractor.address)

    if (allowance.lt(amountIn)) {
        const approve = await ierc20.approve(exchangeExtractor.address, amountIn.mul(30))

        await approve.wait(3)
    }

    console.log(`Allowance: ${await ierc20.allowance(wallet.address, exchangeExtractor.address)}`)
}