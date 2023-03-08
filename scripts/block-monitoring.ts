
import express from 'express'
import bodyParser from 'body-parser'
import { ExchangeExtractor } from '../tokens/ExchangeExtractor'
import { ExchangeExtractorV4 } from '../typechain/ExchangeExtractorV4'
import { ethers } from 'hardhat'
import { ExchangeExtractorV4__factory } from '../typechain/factories/ExchangeExtractorV4__factory'
import IUniswapV2Router02Artifacts from '../artifacts/contracts/ExchangeExtractorV4.sol/IUniswapV2Router01.json'
import { Path } from './models/pairInfo'
import fs from "fs"

const app = express()
const port = 8088 // default port to listen

// let ArbitrageBotV4: ExchangeExtractorV4
const IUniswapV2Router02 = new ethers.utils.Interface(IUniswapV2Router02Artifacts.abi)
const paths: Path[] = []
// let decodedData = iface.parseTransaction({ data: tx.data, value: tx.value });

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.post('/test', async (req, res) => {
  const data = req.body.input
  const decodedArgs = IUniswapV2Router02.decodeFunctionData(data.slice(0, 10), data)
  console.log(decodedArgs.path.join(','))
  fs.appendFile(`logs/exchanges.log`, decodedArgs.path.join(',') + '\n', (e) => {
    if(e === undefined) {
      console.log("saved")
    } else {
      console.log(e)
    }
  })
  return res.sendStatus(200)
})

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`)

})