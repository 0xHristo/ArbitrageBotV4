import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory } from "../typechain"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { Dexes } from "../tokens/Dexes"
import { BaseAssets } from "../tokens/BaseAssets"
import fs from "fs"

const main = async () => {
    const [deployer] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)
    const quickswap = Dexes['quickswap']

    try {
        const [pairInfo] = await exchangeExtractor.callStatic.extract(quickswap, 34307 - 900, 34307);
       
        const pairs = pairInfo.map(singlePairInfo => [singlePairInfo[0], singlePairInfo[1]]);

        let temp: string[] = []
        pairs.forEach(pairInfo => {
            temp.push(pairInfo[0]);
            temp.push(pairInfo[1]);
        })
        
        const tokens = Array.from(new Set(temp)).filter((token) => {
            return Object.values(BaseAssets).map(o => o.address).indexOf(token) == -1
        })
        console.log(tokens)

        fs.writeFile("csv/tokens.csv", tokens.join(','), (err) => {
            if(err) {
                console.log("Error occured:")
                console.log(err)
            } else {
                console.log("Tokens saved!")
            }
        })
    } catch(e: any) {
        console.log(e.stack)
    }
}

main()