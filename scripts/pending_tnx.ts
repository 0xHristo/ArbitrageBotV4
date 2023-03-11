import { ethers, network } from "hardhat"
import { CheckForArbitrage, log } from "./historic_data"
var url = "ADD_YOUR_ETHEREUM_NODE_WSS_URL"

var init = function () {
    var customWsProvider = ethers.provider
    let start = new Date().getTime()
    customWsProvider.on("block", (blockNumber) => {
        log("----------------------------------------------------------------------")
        let end = new Date().getTime()
        log(`Block $${blockNumber} in: ${end.valueOf() - start.valueOf()} ms`)
        start = end

        // if (blockNumber % 2 == 0) {
            CheckForArbitrage().catch(() => { })
        // }

        // Emitted on every block change
    })
}

init()