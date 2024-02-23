import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "ethers"
import { GasAwareSigner } from "./GasAwareSigner"

export const getGasAwareSignersProvider = (
    provider: ethers.providers.JsonRpcProvider,
    _getSigners: () => Promise<SignerWithAddress[]>,
) => {
    const getGasAwareSigners = async (): Promise<GasAwareSigner[]> => {
        const signers = await _getSigners()

        return signers.map((signer) => new GasAwareSigner(provider, signer))
    }

    return getGasAwareSigners
}
