import { task } from "hardhat/config";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig } from "hardhat/types";
import { NetworkUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";

import "./scripts/GasAwareSignerPlugin"

const chainIds = {
  ["polygon-mumbai"]: 80001,
  ["polygon-mainnet"]: 137,
  hardhat: 31337
};

const MNEMONIC = process.env.MNEMONIC || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = "https://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64";
  return {
    accounts: [PRIVATE_KEY],
    chainId: chainIds[network],
    url,
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.hardhat,
    },
    polygon_mumbai: createTestnetConfig("polygon-mumbai"),
    polygon_mainnet: createTestnetConfig("polygon-mainnet"),
    avalanche_mainnet: {
      accounts: [PRIVATE_KEY],
      url: "https://fittest-young-county.avalanche-mainnet.quiknode.pro/f6f7b4115bf91b29f59d506a4cc5e01dcb0a0d04/ext/bc/C/rpc/"
    }
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
    },
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.6.12"
      }
    ],
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    // enabled: process.env.REPORT_GAS ? true : false,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
