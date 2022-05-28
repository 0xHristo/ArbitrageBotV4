import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory } from "../typechain"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { Dexes } from "../tokens/Dexes"
import { BaseAssets } from "../tokens/BaseAssets"
import fs from "fs/promises"
import { BigNumber } from "ethers"

const entry = {
    baseA: {
      symbol: 'WMATIC',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      digits: 18
    },
    baseB: {
      symbol: 'WETH',
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      digits: 18
    },
    token: '0xAa9654BECca45B5BDFA5ac646c939C62b527D394',
    dexes: [
      '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
      '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff'
    ],
    amountIn: BigNumber.from("10000000000000000"),
    amountOut: BigNumber.from("10177149966809145")
  }

const main = async () => {
    try {
        const [deployer] = await ethers.getSigners()
        const exchangeExtractor = new ExchangeExtractorV4__factory(deployer).attach(ExchangeExtractor)
        console.log(deployer.address)
        const transaction = await exchangeExtractor.arbitrage(entry.dexes,
            [
                [entry.baseA.address, entry.token, entry.baseB.address],
                [entry.baseB.address, entry.token, entry.baseA.address]
            ],
            BigNumber.from(10000),
            Date.now() + 10000, {
                gasLimit: 3000000
            }
        )
    
        const receipt = await transaction.wait()
    
        console.log(receipt)
    } catch(e: any) {
        console.log(e.stack)
    }
    
}

main()