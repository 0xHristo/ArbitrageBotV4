import { BigNumber, ethers } from "ethers"
import { Token } from "./entities"
import { boolean } from "hardhat/internal/core/params/argumentTypes"

export const providerHTTP = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64")
export const WMATIC_USDC_PAIR_KEY = `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270-0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
export const USDC_USDT_PAIR_KEY = `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174-0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
export const WMATIC_USDT_PAIR_KEY = `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270-0xc2132D05D31c914a87C6611C10748AEb04B58e8F`

export const amountIn = BigNumber.from(10).pow(6).mul(1)

export const wmatic: Token = {
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6
}

export const allowedTokens: { [key: string]: boolean } = {
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270": true,
    "0x625E7708f30cA75bfd92586e17077590C60eb4cD": true,
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": true,
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": true,
    "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8": true,
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": true,
    "0x078f358208685046a11C85e8ad32895DED33A249": true,
    "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": true,
    "0x4eE438be38F8682ABB089F2BFeA48851C5E71EAF": true,
    "0xf4b0903774532aee5ee567c02aab681a81539e92": true,
    "0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b": true,
    "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39": true,
    "0xac51C4c48Dc3116487eD4BC16542e27B5694Da1b": true,
    "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756": true,
    "0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1": true,
    "0x41b3966B4FF7b427969ddf5da3627d6AEAE9a48E": true,
    "0x3629dAfE1dD50166F5552bEEa63158b3406Fe8bd": true
}