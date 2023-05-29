import { BigNumber } from "ethers"
import { BaseAssets } from "../tokens/BaseAssets"

export const initialToken = BaseAssets.USDC
export const amountIn = (BigNumber.from(10).pow(6)).mul(1)
export const tokensWithTransactionAbove = 0

export const blackListedTokens = [
    "0xAEe0ffb690B37449B7f1C49B199E1E3ec6084490",
    "0xA9536B9c75A9E0faE3B56a96AC8EdF76AbC91978",
    "0xA96D47c621a8316d4F9539E3B38180C7067e84CA",
    "0x01E0d17a533E5930A349C2BB71304F04F20AB12B",
    "0x4634ea4BA6Cb003E59C15a04422a95a9C11BE245",
    "0x8440178087C4fd348D43d0205F4574e0348a06F0",
    "0x1B43b97094Aa3c6Cc678eDb9e28Ac67dAaa7Cc64",
    "0x7bfE43E475EBEa07fa03337da551E18502C8793c",
    "0xB6aC4D432FD1a72a356F1871613Bdc0702D78c77",
    "0x009E61595C40DB5901Aa7CE67819DD0020938A1f"
]