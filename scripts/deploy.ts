// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { ExchangeExtractorV4__factory } from '../typechain'

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  const exchangeExtractorFactory = new ExchangeExtractorV4__factory(deployer);
  const exchangeExtractor = await exchangeExtractorFactory.deploy();
  await exchangeExtractor.deployed();
  console.log('exchangeExtractor deployed to: ', exchangeExtractor.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
