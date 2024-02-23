import { ethers } from "hardhat"
import { decodeToken } from "./decode_token"
import { Arbitrage, Pair, Token } from "./entities"
import { updatePairReservs } from "./get_reserves"
import { readCyclesFromCyclesCSV, readOnlyTokensFromPairsCSV, readPairsFromCSV, readPairsFromCyclesCSV } from "./read_from_files"
import { saveCycleToCSV, saveTokensToCSV } from "./write_to_files"
import { amountIn, providerHTTP, wmatic } from "./configs"
import { calculateCycleAmountIn, calculateCycleAmountOut, calculateCycleAmountOut2, getAmountOut } from "./amounts"
import { generateCycles } from "./generate_cycles"
import { ExchangeExtractorV4__factory } from "../../typechain/factories/ExchangeExtractorV4__factory"
import { ExchangeExtractor } from "../../tokens/ExchangeExtractor"
import { BigNumber } from "ethers"
import { approve } from "./approve_bot"
import { getUniqueArbs } from "./generate_arbitrages"
import { getActionsStartingWithTheSameToken } from "./generate_actions"
import { IERC20__factory } from "../../typechain"

const main = async () => {
    const pairsMap: { [key: string]: Pair } = {}
    const pairs = readPairsFromCyclesCSV()
    const [wallet] = await ethers.getSigners()
    const approval = approve()

    const pairsReserves = await updatePairReservs(pairs)

    pairs.forEach(p => {
        pairsMap[p.address] = p
    })
    const cycles = readCyclesFromCyclesCSV(pairsMap)
    const possitveAmounts: BigNumber[][] = []

    const arbs = cycles.map<Arbitrage>((cycle, i) => {
        console.log(`${i} of ${cycles.length}`)
        // calculateCycleAmountIn(cycle, amountIn.div(10000), amountIn.mul(10000))
        return {
            cycle,
            amounts: calculateCycleAmountOut(cycle, amountIn)
        }
    }).filter(arb => {
        if (arb.amounts[0].lt(arb.amounts[arb.amounts.length - 1])) {
            return true
        } else {
            return false
        }
    }).sort((a, b) => {
        return a.amounts[a.amounts.length - 1].gt(b.amounts[b.amounts.length - 1]) ? -1 : 1
    })

    const uniqueArbs = getUniqueArbs(arbs)
    console.log(`Unique Arbs count: ${uniqueArbs.length}`)

    uniqueArbs.forEach(arb => {
        const aIn = calculateCycleAmountIn(arb.cycle, amountIn.div(10000), amountIn.mul(10000))
        const aOuts = calculateCycleAmountOut(arb.cycle, aIn)

        console.log(aOuts.map(p => p.toString()))
    })

    await approval

    const arbsInUse = uniqueArbs.filter((_, i) => i < 20 ? true : false)
    const actions = (await getActionsStartingWithTheSameToken(arbsInUse, wallet))
    const exchangeExtractor = new ExchangeExtractorV4__factory(wallet).attach(ExchangeExtractor)

    const wmaticBalanceBefore = await IERC20__factory.connect(wmatic.address, providerHTTP).balanceOf(wallet.address)

    const tnx = await exchangeExtractor.run(
        actions.map(a => a.adress),
        actions.map(a => a.data),
        {
            gasLimit: BigNumber.from(arbsInUse.length).mul(500_000),
        }
    )

    console.log(tnx.hash)

    const r = await tnx.wait()

    console.log(r)

    const wmaticBalanceAfter = await IERC20__factory.connect(wmatic.address, providerHTTP).balanceOf(wallet.address)

    console.log(`Amount before: ${wmaticBalanceBefore}`)
    console.log(`Amount after: ${wmaticBalanceAfter}`)
    console.log(`Difference: ${wmaticBalanceAfter.sub(wmaticBalanceBefore)}`)

}

const main2 = async () => {
    await generateCycles()
}

const main3 = async () => {
    const [wallet] = await ethers.getSigners()
    const exchangeExtractor = new ExchangeExtractorV4__factory(wallet).attach(ExchangeExtractor)
    console.log(await exchangeExtractor.myOwner())
}

main().catch(console.log)