import { extendEnvironment } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { GasAwareSigner } from "./GasAwareSigner"
import { getGasAwareSignersProvider } from "./GasAwareSignerProvider"

import { HardhatEthersHelpers as HardhatEthersHelpersOld } from "@nomiclabs/hardhat-ethers/types"

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
    /*
     * The `hre.ethers.getSigners` function returns a `Promise<SignerWithAddress[]>`.
     * However, this return type is obscured due to the shadowing by `HardhatEthersHelpers`.
     * Direct inheritance from `SignerWithAddress` is not feasible due to its private constructor.
     * Additionally, `GasAwareSigner` cannot conform to `SignerWithAddress` directly
     * due to the private property `_signer`.
     */
    const getSigners = hre.ethers.getSigners as any

    hre.ethers = {
        ...hre.ethers,
        getSigners: getGasAwareSignersProvider(hre.ethers.provider, getSigners),
    }
})

declare module "hardhat/types/runtime" {
    export interface HardhatEthersHelpers extends Omit<HardhatEthersHelpersOld, "getSigners"> {
        getSigners: () => Promise<GasAwareSigner[]>
    }
}
