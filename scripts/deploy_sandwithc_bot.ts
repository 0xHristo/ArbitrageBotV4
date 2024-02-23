import { ethers } from "ethers"

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64")

    console.time("operation")

    const f = []
    for (let index = 0; index < 27; index++) {
        f.push(provider.getTransactionReceipt("0x05b86730f7c6eaad9c5ab0fe4b534c8f681810e6429cfc789570351853c95388"))
    }
    await Promise.all(f)

    console.timeEnd("operation")
}

main()