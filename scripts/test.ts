import { ethers } from "hardhat"
import { BaseAssets } from "../tokens/BaseAssets"
import { IERC20__factory } from "../typechain"

const main = async () => {
    const [deployer] = await ethers.getSigners()
    const erc20 = IERC20__factory.connect(BaseAssets.WETH.address, deployer)
    console.log(await erc20.balanceOf("0xfe4BC2dF4b9CC0a00e03555B791Bdb70666145fd"))
}

main()