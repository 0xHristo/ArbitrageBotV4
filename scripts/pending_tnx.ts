import { ethers, network } from "hardhat"
import { CheckForArbitrage } from "./historic_data"
var url = "ADD_YOUR_ETHEREUM_NODE_WSS_URL"

var init = function () {
    var customWsProvider = ethers.provider
    let start = new Date().getTime()
    customWsProvider.on("block", (blockNumber) => {
        console.log("----------------------------------------------------------------------")
        let end = new Date().getTime()
        console.log(`Block $${blockNumber} in: ${end.valueOf() - start.valueOf()} ms`)
        start = end

        CheckForArbitrage().catch(() => {})
        // Emitted on every block change
    })
}

init()