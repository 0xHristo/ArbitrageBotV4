import { ethers, network } from "hardhat"
var url = "ADD_YOUR_ETHEREUM_NODE_WSS_URL"

var init = function () {
    var customWsProvider = ethers.provider
    let start = new Date().getTime()
    customWsProvider.on("block", (blockNumber) => {
        let end = new Date().getTime()
        console.log(`Block $${blockNumber} in: ${end.valueOf() - start.valueOf()}`)
        start = end
        // Emitted on every block change
    })

    //   customWsProvider._websocket.on("error", async () => {
    //     console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
    //     setTimeout(init, 3000);
    //   });
    //   customWsProvider._websocket.on("close", async (code: any) => {
    //     console.log(
    //       `Connection lost with code ${code}! Attempting reconnect in 3s...`
    //     );
    //     customWsProvider._websocket.terminate();
    //     setTimeout(init, 3000);
    //   });
}

init()