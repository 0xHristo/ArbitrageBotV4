import { ethers } from 'ethers'
import { createReadStream, createWriteStream } from 'fs'

const args = process.argv.slice(2)
const readPipeName = args[0]
const writePipeName = args[1]

console.log("read pipe:", readPipeName)
console.log("write pipe:", writePipeName)

const readPipe = createReadStream(readPipeName)
const writePipe = createWriteStream(writePipeName)

const provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64")

readPipe.on('data', async (tnxHash) => {

    console.time("operation")

    const evm = await provider.getTransactionReceipt(tnxHash.toString())

    writePipe.write(evm.blockNumber)
    console.timeEnd("operation")
})