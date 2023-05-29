import fs from "fs"
import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory } from "../typechain/factories/ExchangeExtractorV4__factory"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { IERC20, IERC20__factory } from "../typechain"

const main = async () => {
    const exchangePairsFiltered = JSON.parse(await fs.promises.readFile(`exchanges/historic_pairs_filtered.log`, { encoding: "utf-8" }))
    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)
    const erc20 = IERC20__factory.connect(ExchangeExtractor, deployer)
    const usedTokens: any = {}

    const dexes = Object.keys(exchangePairsFiltered)
    for (let i = 0; i < dexes.length; i++ ) {
        const dex = dexes[i]
        for (const pairName in exchangePairsFiltered[dex]) {
            const pair = exchangePairsFiltered[dex][pairName]
            console.log(dex)
            try {
                console.log(pair.token1, await erc20.connect(pair.token1).allowance(ExchangeExtractor, dex))
            } catch (e) {
                console.log(pair.token1, "FAILED")
            }

            try {
                console.log(pair.token2, await erc20.connect(pair.token2).allowance(ExchangeExtractor, dex))
            } catch (e) {
                console.log(pair.token2, "FAILED")
            }
        }
    }
}

main()