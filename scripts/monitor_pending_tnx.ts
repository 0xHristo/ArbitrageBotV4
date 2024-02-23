import { BigNumber, ethers } from "ethers"
import { IERC20Uniswap__factory, IUniswapV2Pair__factory } from "../typechain"
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
import { toUtf8Bytes } from "ethers/lib/utils"

dotenvConfig({ path: resolve(__dirname, "../.env") })
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const providerWS = new ethers.providers.WebSocketProvider("wss://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64")
const providerHTTP = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/B2qBXV5FEEiyRD_PH5SOP1TAvQ_cNP64")
console.log(PRIVATE_KEY)
const wallet = new ethers.Wallet(PRIVATE_KEY, providerHTTP)
console.log(2)
const used: { [key: string]: string } = {}
const toCheck: string[] = []
let index = 0

const active_pairs = [
    {
        "contract_address": "0x604229c960e5cacf2aaeac8be68ac07ba9df81c3",
        "swaps": 12094,
        "distinct_swaps": 12026
    },
    {
        "contract_address": "0x55ff76bffc3cdd9d5fdbbc2ece4528ecce45047e",
        "swaps": 7518,
        "distinct_swaps": 7501
    },
    {
        "contract_address": "0x74d23f21f780ca26b47db16b0504f2e3832b9321",
        "swaps": 895,
        "distinct_swaps": 894
    },
    {
        "contract_address": "0x22fe41d182cada7f09022f477807a180050631b1",
        "swaps": 49,
        "distinct_swaps": 49
    },
    {
        "contract_address": "0x12a2abcfcadc04681929f0c199bdf812967207e4",
        "swaps": 71,
        "distinct_swaps": 71
    },
    {
        "contract_address": "0xd24f7a2e0aca240793b8b76a3bca8ff4c52530bb",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4a53119dd905fd39ccc532c68e69505dfb47fc2c",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x9e2b254c7d6ad24afb334a75ce21e216a9aa25fc",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd8d51ea2edca2c2ea15a053a5730f559d79a1570",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x2cc4a8f03983bdd1958717d3d4e5e30564989cf7",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xc46991072c7eac184f7bd69d3122cd1750300b27",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0xd724b218abd67ca32ce1038f742b535abd629f88",
        "swaps": 30,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x60a4f748614515ca753de2fbbb5be584887ac241",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x2ce5640cd43abf6bb87adcf17a7e714436ba530a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x19a4b9be0ee3e258f7616af8fc199376d13d527a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x69a2f61bd315a5a9314b029f17f13fdbac2864e2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa5cabfc725dfa129f618d527e93702d10412f039",
        "swaps": 776,
        "distinct_swaps": 768
    },
    {
        "contract_address": "0xc750b96680fcb957b9c4bfb4f50c047d4cb07a7e",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xa944017f1bd336c9675417446de6b0c4f0c39652",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xaab1550acc159d242f0f9c4d86774556984c90d4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5aac4c55251ffaef3de45e958c93b7ece4321785",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4d4fcf08fff520cb238cd1989901b913fe8804ea",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xebad590cf6506ae361d6ad98567d836284981d38",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc7d21537454ed4462c31bbf5a41dcf495549aee2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf0b250cbbb3a43fb1fd8ddd6a2bf9a2eb1c72bfa",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0xf4b715be7983c2e949f397d53f1a435868a9f25a",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x8f89216177144a553be966fd45e17f9e915e3ef4",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xcf5e73459f5e28d771793dd410061d8aae35da8c",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x311f29a42df6f745489901143666c024d4400715",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x131d254dd822717759f415936b84543f6eeff081",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x50bebdf98c8998cc7cd8e3ebd61bf532da21edc5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa623b447a71ec4ee16eb2a46958f412c930594e1",
        "swaps": 51,
        "distinct_swaps": 51
    },
    {
        "contract_address": "0x43c0367dd95d0c02e111af7022b7e789d8c5f8ef",
        "swaps": 86,
        "distinct_swaps": 86
    },
    {
        "contract_address": "0xb2b6d423e535b57aad06e9866803b95fb66152ea",
        "swaps": 151,
        "distinct_swaps": 150
    },
    {
        "contract_address": "0xb2a25673a6a1995df7db704c474235560466d340",
        "swaps": 41,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x14ca3a0c389e0326ca8c60ad2bac220acc294c87",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x2b072522b045b7d578ef6d8a2a31b060cabeca46",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xa1e513d9adee9288a46ecce56d6771dab33614e2",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8959f79a40f30d7d845663ac06fc0efccdad5bfe",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x70c5bf6dc24e45f6528a318f43ba221b26b58101",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5c2d9217aef2b7478f3cf301619cad236c345567",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa519470f50d579d192b596466f006249bef18f15",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf2a6013db7f7fa3ba4c9ff85ccb45accccdac22c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdf1d5afd6339ee4b02e2adc34ecbd6384e90cab2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x96d6f7afff161e7152bec4272b51cc007e4417ae",
        "swaps": 169,
        "distinct_swaps": 159
    },
    {
        "contract_address": "0x2fd7192046173c3007171134661b46151ad432f7",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x8ab47799cb0d49aeb9e3a47c369813a3a3236790",
        "swaps": 329,
        "distinct_swaps": 327
    },
    {
        "contract_address": "0x9d863d09ec27a7f2157ec48c6d2d4bb42375b187",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x9446021903191198288d60bf45fe43c337edaabb",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x1ed7ebdf91115371c13a5865ee8b8e48e6bb2768",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xec7078cfa291d0acea6819a5741e4e89e3c544c0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa3e93509892c162134f0160f473dc8959a4af148",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x98b10106c3e5b0493b79102c4c2141c288ce8720",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x077f6f7bb3223ed68de2b0590af74cf522befd4c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x59cddd0be2a26b6134ad457f94f579b99767b564",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x0c77b6682b6ffffe9599b41e39eba1c1bcf923d8",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x8c17c2ecb3dd3acb52ed5f00c5b79f9041e740a4",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x6d918520df5a1fb59e040115a20e6623c24a9283",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xd0a5df43a4c0ffd4981740ad50dc1a60529bc99a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x46563a38425ba0aaa406825ab992b704acc894b0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcbfee715d1b60d39c5bf2faab6e6feba01b4ec47",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x72def214b363d646f0aba67717a9a8412212f916",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa907e86e22bd277cf5a0f97df8e83c787e1af0fd",
        "swaps": 141,
        "distinct_swaps": 141
    },
    {
        "contract_address": "0x3bc397fa6fd180b28e6ff05262647f1c105417be",
        "swaps": 221,
        "distinct_swaps": 217
    },
    {
        "contract_address": "0x80ee26256e01bf43abd400463e83acc5462b04c0",
        "swaps": 69,
        "distinct_swaps": 67
    },
    {
        "contract_address": "0x7c666529d0e26a7f19d95c96077d6607d48e56d1",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xf8326c8aed2d21364fdd7d4ffc0c771755d8f55c",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x14abcd4fecedb9acd161fad42a18c25c7416b64a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x84e06113759d7671d5d79f0c50dcf19795aad6fa",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x822f7585206464ea89aa37afaf6d8432ed6db220",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xe59060fa724c54538be88396384e0551e58f566b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7fee8f1222a60336238d2898a856dfe2331412bc",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xc9e4a017ae5c2f89c085c534a38a3e6d3a183a43",
        "swaps": 106,
        "distinct_swaps": 106
    },
    {
        "contract_address": "0x7e95f968489382e695b2da320ca005b8d617b459",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x7ea4ffea54a11c8d00c57ef96d9711a451b5a72a",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x34832d9ac4127a232c1919d840f7aae0fcb7315b",
        "swaps": 42,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0xe2fcbd6ee5d42bc6d9885378f11e4bda6b39fe0f",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xb587734beec9833de4d96547c88ee3fbfd49ac95",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x871ff6e567c63644ad0399a8213580101e5d66f8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7d3e4b376ebd0f0d44d9fff52aa4af620adf057b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0ac72d484024364db53da4088d0e2befc3783ecf",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x32c856599c9a6823cc80682897584b93bac8a764",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe86019f172e947ba409ab7b9192f649b7c67c11d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x09af90c28d2f898841f351ec92bfabdfd59a71b0",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x5ebe76ff7a614ba72fd70c515fd56046da4556bf",
        "swaps": 58,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0x660ef398a52363f0a0f8ce78e2ea959a35b8fca2",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x3651b109e303ffbd44fa310b5c0129753d1d081f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa357b4aa07ee6ee71f7df0f0575e64925a7b34aa",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xb5600746f947c25c0cbc36429f87e6c88f9d6a88",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x67cf45e239793a72f4bd4d46303735aeedf5d2b4",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x9af4d3a5796bb09753a6509db25ecab6e607347d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4dbecbdac6cdae5d521bb7908b145198f6b76000",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x32a768e3f7dc13d4e8975c37183fef6289a8f090",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xc298b6bf545cc2a8425f109d6c20509ff6fdba03",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x315e00839a4d96b204d64545b18beaa2b54c44e7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1c6e02dd453929b72b7377be2f3ebdf083cca94b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x78507ba122b0d58f3556434b0de5503b9be449da",
        "swaps": 107,
        "distinct_swaps": 107
    },
    {
        "contract_address": "0x7105f0e4a000fae92b1299734b18e7d375968371",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x13a069c488b8d99427b87075a615904d7ae536be",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5bdfa88a3093b62b1f45daf4ce8b4a0b4f5b970b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcea1571d21de966aa5bcc23cec9bf16b7fec40d7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc5e360562d1115b6d9fdf3a32979b78a93ceb6d1",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xf2c9650fd759f93e59d2ae8f42a97c0600150f0e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8da3083e2f208344d8b6d5784c5d2c3cc6f95ac3",
        "swaps": 154,
        "distinct_swaps": 154
    },
    {
        "contract_address": "0x6963de09b1cb546c676ae059f43d7431755ec5d1",
        "swaps": 149,
        "distinct_swaps": 149
    },
    {
        "contract_address": "0x5d93c1c1a4cf02c0fe4dd94e8dc92ab060183129",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xa175281d984e8c223edc5775bbc9db7efa3b1abd",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xb15b23c8bdb5ba8dd36b0da43a25a42e1f749049",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe186dac06f75e7e2655db05a7c684289eaa19179",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x7f63f56851f54518c0659d936ea5739b2a300733",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd3bfd9c71f9f1af0770896478895ac9ff7d59d69",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x683d2685ebfc0c4d13d0f6e682808f5f4f534f00",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfe1bc4fc69f9413da32084e8653d17abba88a597",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xda7cd765df426fca6fb5e1438c78581e4e66bfe7",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x1378fdf505fdfc332adf3b39a906ad932b43b7e8",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x2163ee68a1280c9198d5cb14fc7b2dd3afaa1d85",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x085857a69bd877ba077557d3835844e225e6b39d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3f9e488e2a50971adb86a32ab2f4bc7546f87771",
        "swaps": 11,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x734e632d63cfdeed1875093f797724841cd14621",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc88439acc4d5baa723d8b9fddc330c35aefef0a5",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8075cda830ea117457f914b790daf93f93c66136",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x56f91f954271906496c68efe8cdf5d13ced09e8a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd8a63f6424165a1df0152ea3215440d7823a8eb0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0daee141372a4c96fe1f84b5de7942fb0d9bc9e8",
        "swaps": 200,
        "distinct_swaps": 118
    },
    {
        "contract_address": "0xb95e1c22dd965fafe926b2a793e9d6757b6613f4",
        "swaps": 155,
        "distinct_swaps": 155
    },
    {
        "contract_address": "0xbf68e75977f3823618725cc3f6ae4c59498593f0",
        "swaps": 174,
        "distinct_swaps": 174
    },
    {
        "contract_address": "0x72ba00635864c233be9c576817545706dea13270",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x73e00a164570d80cb574f6b835404f10831e8cec",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xfba51e1ea2d46c4d5e98f27e1f5333969d2222d7",
        "swaps": 21,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xd2b61a42d3790533fedc2829951a65120624034a",
        "swaps": 25,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xcc967a2e3a439e31dbc81b3dfa8e1347982ecd76",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2f101343fade55760f28f4183774cbc07f242340",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0211a62a67385cd26734cdbf0cf1d7e456e9326c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9ff7ef52f423e06edb23859006372974a9692f9c",
        "swaps": 240,
        "distinct_swaps": 240
    },
    {
        "contract_address": "0xe82635a105c520fd58e597181cbf754961d51e3e",
        "swaps": 505,
        "distinct_swaps": 502
    },
    {
        "contract_address": "0x6be6274b83fa97ab39c14d0de42ec006c11d3cab",
        "swaps": 96,
        "distinct_swaps": 94
    },
    {
        "contract_address": "0xa70bcc89588b40ffeb2750d60886172acdae353c",
        "swaps": 80,
        "distinct_swaps": 80
    },
    {
        "contract_address": "0xbcd83ab205a14648674fe67c97aad89b261cbac6",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x67a81a470cc17257363e38afc412a45b756fc6f9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x554fe9d321ef4619716e1a4bb9d3e26eaac97acf",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xae5faf42d7a9f637b82987b3c177f2f46fd5f3bb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8cc3e3170ff7d54fca9517f28aa2b8f2a3f6337e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc45092e7e73951c6668f6c46acfca9f2b1c69aef",
        "swaps": 146,
        "distinct_swaps": 145
    },
    {
        "contract_address": "0xf2128442ba7f5b4aaa7c5a817ec56e2f1930c32a",
        "swaps": 286,
        "distinct_swaps": 284
    },
    {
        "contract_address": "0x053b8e80ce9e521f9a1789e450ba582289e16b9a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x44c2995a79d5a94d812792263e111e74bbec782d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x70cee55c98f6da2685807611f115ea737d4a248e",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x06a00e7ebc7383a9d4261f991c357a228cfd3602",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x177874746d3b79023ab57a34bbfc561af2ef7775",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2ee43022e812f5c355cfc559ad6f8ced321d6012",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xf6eedc72e38229093e6ca95c7d224e0ed9d99d72",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x90a3c03d7b45c44452f92fc7f562e904705de0d0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x30151b8aaecfd305980411b4efd4167c53a2f773",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4097073e82edac2d758ecfd594139a891340d59d",
        "swaps": 124,
        "distinct_swaps": 124
    },
    {
        "contract_address": "0x9ea6cb9af6895c6f1c5f0b600493133650cf16c5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x215a484be9356e8630afeebb5be021a48a207c95",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdf2b3cabd02fe4cc0e15053fda2ef2c9fdbf9d62",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xf436257335b28e2b14861bf5f3b17b8a21bbd6df",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5e2698b459df67c38059228a2c34e4d9e298ceff",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x7c4ea113802a80346b5335474cc57701e22f58c0",
        "swaps": 9,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x61ed7fdf1cdd6703fc0ec456d4ae150dd824f122",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x275b53031088553b9e7964bc31f34aba4f4ad566",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf051d3c55a7436209cbe43148b35b6467122929f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcf636b336b56945a0a8b3578dbabff9953618938",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x55e49f32fbba12aa360eec55200dafd1ac47aaed",
        "swaps": 381,
        "distinct_swaps": 381
    },
    {
        "contract_address": "0xe95bead98cba0bd0f4df2da6d008f12d3f5b3143",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x1fec149e363b9c3282c2c3509f171ce2ac77dd27",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfb659315e36ae39917014da60f362b600e8cd0ca",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x1210e12c1457acb40dec57884e4ebfa5b9578968",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xd8eb2026e80e6b3caf3f8a3e1f0d479c6ae3709b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2c253e0406931d9ba1c255543faed40cbc82f96d",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x527ab7c0ca1d21605ec12a7dc5ae28a2e5674eef",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1bace63f0266946c017655614209e27762296fff",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5f9fe12fe854e1b6ee1bb91566787aa385f05417",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe013784a220a76c43e3f2380879c6831f3c2f20a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe9999752a4e978547f2bc1bfc6ba05ceb757b347",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd134c7785866f1bf800c2955b200c3b0efcd3f50",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x202866fd7419cff40688e7a9ea9366617a626be7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9d2b9dc50f844c655a637937a3caba3f2dd82132",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x0b749c51bc5ca6b866b45d957362702a0ca230ef",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x578a00f09ec1c69fbeaa5235aedaa8b0d0c25d4e",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xb7170565b6f2453385d4b0729008c72516e372ea",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xde4877338299c23b2371787739ba1b13d6bea744",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x07a5b2f5275cf61a5c7a5b766988f5cf30c9c42b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3a7a378fc27ef31da754cb86a2dba8f561c6534b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb28af240577ae1195bcfa3b057f53f795c4f12de",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbafc28120fb9052f67ce21bd0bdf6262d0eddb8d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbe69026ac368e0852408705a92e5701a47e7698f",
        "swaps": 80,
        "distinct_swaps": 80
    },
    {
        "contract_address": "0xb3a5551a6a483eee91417cffb6e934d505c8f3bd",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0xbf61e1d82bd440cb9da11d325c046f029a663890",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x356a8af4b85cebf8cb6a0331fffc562bce9967d7",
        "swaps": 233,
        "distinct_swaps": 232
    },
    {
        "contract_address": "0xfbae8e2d04a67c10047d83ee9b8aeffe7f6ea3f4",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x971684752715378d5fe714718427ec03b6f3ac1d",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x91bbf8ab5be4ccf155eee251d5bcb60d92b99775",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xafde692eff6ccff458e7f04cc9f6bd3a22acb5f2",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xff016b8dbeca0182d07daeea34d56d5634b6a288",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0f2e94e6b4597bd124af89f36c6422be5e2496ca",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc1bd93c22ee16fba9a1c69cf70f9921ede907c2a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x087aacb2712196e7d6fe3a3d0695750cb25d3696",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x98503d87aa4e9c84ff5d2e558295a0967fbbbeff",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xadbf1854e5883eb8aa7baf50705338739e558e5b",
        "swaps": 3627,
        "distinct_swaps": 3605
    },
    {
        "contract_address": "0x4a1e496d0929cd992b47335d10bd1db6c92d99a0",
        "swaps": 76,
        "distinct_swaps": 76
    },
    {
        "contract_address": "0x6bfef4292647aaf8f42a55847adaa98f05c30385",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xacc6662c889a1dddc9a81cb0db7fbede86d94313",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x48063376eac95806a59ee00b901b6104da960b98",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xf77c378b9b8bd9569be4bbf60b945048f5da772d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xf63b80af6d52f57b7f1dfb2a857f5e5592d0620f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3081480d1602a2bc9408b48e79aa517757dbda8b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf01bbd5470b72e9c06d183127d1cba55ac6a8702",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x97e85a1938c55705631af4cd7a743dfe9bba57a2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdc473439753a95b53c3f13326a12ec7eedb73c3a",
        "swaps": 142,
        "distinct_swaps": 140
    },
    {
        "contract_address": "0xf850c261adc576e6713d14af590a40d55936a982",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0xc5666d43f06c073e869bce02407569f578b2072d",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x196a24963da32a307634b1a8413d0b84573b3d37",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x39d736d2b254ee30796f43ec665143010b558f82",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3e18d95104a82a5c966a4d7048e9b6301e5a2faa",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x7ab98d6a6a42b8417f020daac74b5a72a23c6739",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xdc37ddbf79d98b3a7c3c11426e33fe440b8dd806",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8300012a652624f595d8f840b5e89b1011df494f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x66d4192cfd56c5a066542f6fc6a83fcd03c4065f",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xda12716eae93a83a1f4e2789640b1e9b55c0cdbb",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x827c594dd4f4e0cbb8428dc5685ed93637a29919",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0xf81dff70d8e9030a7e1f93de272c6ed4332ecbbd",
        "swaps": 284,
        "distinct_swaps": 284
    },
    {
        "contract_address": "0x93cbcad1f9642a80e38d980fb872215237d91794",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x1366c529a133d4153211410126f12aa4e31aaac5",
        "swaps": 128,
        "distinct_swaps": 128
    },
    {
        "contract_address": "0xb492608ddf9220cefe9e9e9d45f76031590d010c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5ab20535c09e9a765d160e364b818492f2fbdedc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9f3769d46c1b5a5f1e56d78d94053b4957a798b4",
        "swaps": 62,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0x23ff7f092ce795ce955d3b01e28c4d10fe6dca6d",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x49668ee947c8461a4d3bf01ed7218a7d8e3739d7",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xa0a2e0238b3198e83c7dc6575cbbeb45ae83b4d9",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xfc93312509bb3612083858e4bf160d15b1050aea",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x1c97203667ade27215f4754995755fff75e683cd",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x6943df114f3b9fa566558a12bce850105bbded66",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xc0e3a8a70fd8b0a174a7d5c07f535c39b6afe19a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa900acc5e012729c792e9b7886e745579e6ce781",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xab7f9d5a70ec116089e01c3ed3c9ced0075dfee9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x25e8bbc103842f0dad2465f4e04cb8d44fb787bc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfc2c57d15fd138a461ac2274f8d23bf65695b8d6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9b74205381193cc42429da19eb8deea11a7b3f80",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xcf2abff7b321ccaaaf4faca391aa4ffc87efec13",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0xbffad6894968cc81e5f583ae02a746aa1fab44be",
        "swaps": 120,
        "distinct_swaps": 119
    },
    {
        "contract_address": "0xbfb605c8b2f69a7b7e70cb51a8c2069879ba810d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xf08c4ebae711242ca26c6c29116badbc9af123ee",
        "swaps": 68,
        "distinct_swaps": 68
    },
    {
        "contract_address": "0xf1f40bb49886e758455e93e0816370229d088d5d",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xbf5d409040057405ae947907d0eeb2255a496dda",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe17672606cf179278f63e15b8a4bcbf936058233",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x163c45fb7f84848786a16d8cdb396f78787d6d99",
        "swaps": 3,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0f8c677f8f80a30ef265ae2666a44b84f5940291",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdb783df049dd7a5006223dbb07ed400348af9b68",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc3c7fcd8390ad35229a09131c85721edf672082e",
        "swaps": 4,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4093cbaa22e962c572558d02ece9d1d2af169d8f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x860368634ec99d0461abc2a8c88c419f82816a6b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7ebed1c342243d8ce1324dd9a9840da1d10a376c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5e1878eb8a10cc8690798ece6bfd3425e189361e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x55b9f4533d4548e322052e718eac7ef5d92d5a7d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf60d634a7ba91c298e26efb9b76eaafc66e7ba09",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x24f262efa5bfb1af267db9be87eb12a734788a01",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x216941e9c3dda2a86c1e6285379e0301bc8c0c4a",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x979b711b779138073997c5ce1eaac11c11d9436b",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xa7c858261f33debb1718a6d417e3e4fbffd9e01b",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xafeadad187e3c80efd2c7066e9db80db3ae33a4b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x83de9a874e9bedaf6c903f87a913e2af1fd87e9f",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xb42e494d9e5455ef86c845f322dec7fd8c63eb94",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827",
        "swaps": 5134,
        "distinct_swaps": 5024
    },
    {
        "contract_address": "0x19de521cf66005e0277dbee71d67ae458c358d99",
        "swaps": 56,
        "distinct_swaps": 56
    },
    {
        "contract_address": "0xe506e7c500fe6e094c37682dd7ed847306d0bccb",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xf52da9d1d41c8c543e865c10289eeb8fe31f08d3",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x9be9cce5b1ee578bc97e7cfbb2ad16e60379d440",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xc656dbf113b2a3dd399079f7ef6639c15e19a5d8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7b93196cd4861f345509c2da31058ca4b1c30d63",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb4c6b4b89624a6e204e799d5bf5b5d06eeb52979",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xbaf6296ec13081518c1f5f63a2332ca3bde36247",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5ea6459a87aba0139653e6eae79433c0cfaaac34",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0xc427ec5934c33e67ccca070ed3f65abf31c64607",
        "swaps": 45,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xc089c10fb638f36657873137828618ab02bd34aa",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x7102a8010def520eb81aad7272b2cd94f4411adf",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x619f43db4a1fd21f582b35d6628936d40a0abdb6",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x395c9d552671e8e0af1682f6951e012b8fb0ec5b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbe077e69ddcd29c89d0e3dbaab97257ec9ca9557",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x15a9840616fdd8da726d6df3a922f75e59943608",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x447b270c9d4bd9806b6a1b62a6dfa538e36c9d49",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xe11219f635960f229e2ac7f5c408a7b23044ce62",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6df66882f6f0320f08a1a673b9b9ef57d34b1950",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe7c714dd3dd70ee04eb69a856655765454e77c88",
        "swaps": 206,
        "distinct_swaps": 206
    },
    {
        "contract_address": "0xa8eca6cc6fb9f8cfa9d3b17d4997cce79e5110cf",
        "swaps": 222,
        "distinct_swaps": 222
    },
    {
        "contract_address": "0xec54584a6da0c4e4d8029f47da4d361cc2279bef",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x2f051db1634eea2081590860ab8e756d452f2239",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc08364eb467fadea5f45d6938da654f1bc7fbac1",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xa0d6567bdaa90b996dacfe3140f16a45b9e66968",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x6deb445750970455887a3b8e1d99c3ba7374bc4e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x14a0fe781fa4a1d9a3dd73b0c0ac90e8e7962128",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9aef131948ae4b95747a20af563e87ec67373131",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc4a707353599436859af654f829b75e635fde289",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x602a5e1cec1308e8a2bca54f6a2f336b6ed5d223",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9bd48f2a1ed9ef9dca022c073d25d2da3a26e595",
        "swaps": 88,
        "distinct_swaps": 88
    },
    {
        "contract_address": "0xaede02a6bfcd7b9eeb0cae2de5cb04970e0475e3",
        "swaps": 72,
        "distinct_swaps": 72
    },
    {
        "contract_address": "0xcdf59de1d771e265ad8a1571532181e137258f44",
        "swaps": 82,
        "distinct_swaps": 82
    },
    {
        "contract_address": "0xb80873d79efc7c35c5d8ec86184abf77242fb7a2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7896a4678080d833486e8fc3697448791e014059",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0x55d860a7efcf4f1bf3047a6497ba8e1fea69aa7e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4e86e53a00042bee2b1c431327cca54590178096",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf4c9c78e031061272b1751e1f001c4ae4e30f7e4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdf9549017071b88a5b9a7252f875632bfdbb7fc7",
        "swaps": 187,
        "distinct_swaps": 187
    },
    {
        "contract_address": "0x462390ea53f70f7570eeb2002c0150af519f93a9",
        "swaps": 151,
        "distinct_swaps": 151
    },
    {
        "contract_address": "0xf051fd77e70f139dce7a74e483275df1d059a6e6",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x81e3dd9a4d58ec92ad575342967636ae1a24cf2b",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x8790d3f87091d19449eab2c190d0c5eaa1b233ec",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xc1f7d8bffd697251ad9cf8e7db238f0186f2c88a",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc3fe05f7e9d0a9e95253a6932cdb9d21914a0729",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x4ea3e2cfc39fa51df85ebcfa366d7f0eed448a1c",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xb5db659c561dc84ec9d42d4277a5e01f3b69537b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc308d358733399974af7e057f4427661e9eeb905",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5a2181bd0ea3aa54fc9e947fa26ad9c85645ee6a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x001e44f474609d8528cf6b4d30f3379c0e2ff03a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6bc74373f010cdbb4175f023cd85c97fdc70ffc6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xccb9d2100037f1253e6c1682adf7dc9944498aff",
        "swaps": 522,
        "distinct_swaps": 507
    },
    {
        "contract_address": "0x41744ff8fb7581240b94fbb43f87ba9027e0f133",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0xfd1d62ef77ae33f9782fba5c1510192de60ed52f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x123dba896a46d0472a65d697d2e6b079805ff4a1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x161f9e00446629292b0c4986ce5283b25ef40ee3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa0fdaea0881749322a7778d9c35a95ad777a5eec",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2f5a5e6ff15b9b342e6292e2f179e7199f88922f",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0x332cd6125acc0f9ef3941181f1ca4b806c30a9af",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xf64d2b41ca5392ec86d519d616603d2bb85b2a5d",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xc3eeff848fa25a8c24aab89164c925bb719e8b2e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x698becdb6f3a2cd21123a05d2143beda55841918",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc424c63b609c05f9629204a1293baec072e027c9",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9d83ec41803e455c7b37c997053636e2f8dcb714",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd86fb14dc7da5e5d970ec9f8556c0314e55107b5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1585d301b58661bc0cb5a8eba24ecae7b4600470",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xb739fa89a078e20a878f74be15a72beb52e49b26",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5327b307f6c97229e0d941b71a6553ae660402ff",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x6e82d9b6981461daa10b7a8130aa99d134b1a150",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdc22c3c23d94cf60ce61f7ac73c05caab0ed4668",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0xe4984fc367ab9a8c9dc6978d5c0d22c6626c6c54",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x901debb34469e89feca591f5e5336984151fec39",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x921586e35bc38e360deead11ee5a9a1aae74a25e",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xd79410766e927b870ebf0ded890ac35e5af8285b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x9faa8e197080392e3fa47c136e2035d74822060f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf32371bdd49d3c8e8614f45c8d60214a1190a02b",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xcea9785d0c20c6e8a855ec9c3f51166cfabeec98",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x6f52a6be6034af8a73211445598a4d2f38428d6e",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xb8860bd872a1d08031a7cbf4c1740ba3c9ebdaac",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x42df1575ce83435ba7889a39887abd04e621a54d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9e4673c2e48f9f12bdd9097bad13918999c346e6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xea8e33a7e75efe674aa09afc424d73fa6870fe43",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0b956e9ec376add320d995b6acad669bc9960942",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf68c20d6c50706f6c6bd8ee184382518c93b368c",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xf9008fd63c8d58a19c86f2950ae60f276ad5fd29",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x7ccaea2c1b482772aa851f1a8b0af627705c07c7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1c84cd20ea6cc100e0a890464411f1365ab1f664",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xd3924ad8f881514eff89503be9027b877e9e2bd0",
        "swaps": 7,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3687a214697037ce5b2e9cff7bd025081861249a",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x152bc679fb4be5b2f254179b36c0804ad61ca5fb",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xf9abe8ee42f9581ad1dc6eef0a2d2eb31f421d41",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x0a8cff4b99af73fdc0284ef56061de6b6bbc2393",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xe28934407f9305cbb3eb5b7f7484d742987e069e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcd7593f9002dd012a4e06130ced9034ebd96654e",
        "swaps": 44,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x0ccc84b6506003487aec687085e82c2f912e607b",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x2b1b90fb77b110977a6ee542d762c950c1d2c84a",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x3962250bcc0505c0e288b057230fa372038aefb6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xce955d4e7aa7228a12dff628ad620820f3b405c8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3e353d24857dd791f37ee75765998113cf462e48",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x9eb792c780d3e3714f245c596c8c8993bf6fc605",
        "swaps": 964,
        "distinct_swaps": 960
    },
    {
        "contract_address": "0x85d5bf6231c6195764cb8157843a79e173362d3b",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x6fe49eb1be9ac845b429f1de7bd8866ef87fd489",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8d76ee2b310a8e0fe81095ae26c3f9ca8805d4c4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xae67289a092387184f6286788a6c8c6d8a8abe79",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3995fb93384a8907e949c072d41808cbaca4038f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd255b96a6ab9334ca5a721afcafca50f9b94dc51",
        "swaps": 66,
        "distinct_swaps": 66
    },
    {
        "contract_address": "0x9d6d31d8bd564cd77a70b7a0cc1416be9dcd8b6f",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0xbb7b7b24708aeaf775684286f915d1fb3d969cad",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xf366df119532b2e0f4e416c81d6ff7728a60fe7d",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x387da73edc7f30b2a7e405eb57d35151314bde1f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2be9d477477a25660f29ce8f68c2e14ffb6ef5b2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x33518bc7de6637826fc8cc4af9639dcbf474ebe5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd5d076894b21d68c7c98f35a7b3c4c8821c296e9",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x5051fbf72b8190badc753aa813c8c8ea0792d9e0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3bbc21c8e5bc4b98baf04cee298bd303a2faf1da",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdea8f0f1e6e98c6aee891601600e5fba294b5e36",
        "swaps": 173,
        "distinct_swaps": 173
    },
    {
        "contract_address": "0xc4299218dda4af0faf0d07c21e52b9b29b5a5a57",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe55b43ddd6b340b7f373e40e446c682359906c3a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x059cb379906b0cbd6f21c29520b4649cd8b11be3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1a2a3d2e5a0e9701d5ccaaec5ee8a6c341212d1c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x28a65755de4ca2348e42aa8f06a594124775b05b",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x8874654c6d2b03ba32622a90640a89b09ec748f9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb7ff4eeab22f78425fa8dbecc64efa9d6c91db03",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0edbef889ecb230678474ca52b1795e4f1624cb2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0d13332b2d659b32fdeae89e30246d2c4d673f13",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x86b7249272fabb82ef36550ef898ea539225e7f0",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0x5428212fbb75046d6270c0bef4bc49882e2bb6a9",
        "swaps": 76,
        "distinct_swaps": 75
    },
    {
        "contract_address": "0x7051810a53030171f01d89e9aebd8a599de1b530",
        "swaps": 68,
        "distinct_swaps": 68
    },
    {
        "contract_address": "0xdb150b346a190e72e3ea62000011a20184aadab5",
        "swaps": 63,
        "distinct_swaps": 63
    },
    {
        "contract_address": "0xf2131f47368747360b9cbcb62427fd45cb272986",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3075ae553a4ed7d522f46bc89193a7ec4e70dfad",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x99de6f5f93c7cf196e08703b2634b8fa87402db0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9d9b8a9e1b991e578f8a545227fee4824d591e67",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x6e89f5a8d1f4871ae012173a7b2e523a6cdccd9a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5afe6b17841f426eaf9fe565fa28c46a09708581",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2940df6bcad49ce8592f643dfe65347c1c920255",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0a5decd7939b1f176c8fd9f1fd213c6c1d12a76d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5ff4e0ab9eaf1c4b9df31bd08a1b83536294721d",
        "swaps": 307,
        "distinct_swaps": 307
    },
    {
        "contract_address": "0x7d33de209e031ed97f857bf2412d7e2a7f4544e1",
        "swaps": 67,
        "distinct_swaps": 67
    },
    {
        "contract_address": "0x2dae48cfec770884a2dbc43b43affb2ecf8d41b2",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x390caea4ddd2f22fed09c895044f7ea9708b171d",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x60a147e97fceae284c90a452a734d11950dfa917",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x623c0ec86dac8718cf957504c8babf56ee2be4ac",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xb8d0c94f154cb162802eee15e45e44cf650364bd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd91bfc30d9a414456e37002d6ef7d950592371a6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6b98a63aad9a4234b5fa68a9979ef511816f470d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe667a0c8a7472cd28b21ed374b78e1ae22e9ce6d",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xf43c496c10d44085c1cba6b5456a4522e239d912",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf6b09c0d43f38047a3cc9b7ee2b5ea87475e7818",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x1c832e3b7345f958c152c3ebda8401e9f569f342",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5938dc50094e151c7dd64e5b774a2a91cd414daf",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x9e8f1b214274e1e56529d6cd092d553eef5a636c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa97b5c4c7105ecde9651d4647c145638d1395bf1",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6bba135663447a5e749bb8b60d3e18c9c2eb0e25",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb75b890b228597ed22a69987f5ccfba37f14b3bc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb962b8ee5410264657c836cee25e6fc14d64b7a1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x95efe9e1efb09aea596bb96db4e6d58e64a6a616",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8620a28eab3c0c621eb39b942bc03302d2cbcbf8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x85c18ac3ab26c2c4024478e2da01b4067dc9ceba",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x411a34d3e47d9694e1c6ac20c694f55e3f20f8a1",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x5e2b1e14f4519071f7da18daba8af65d6f968569",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5024e2480b04a849ad682a9877a83931ef2e9ea7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x713a20bd6d256eaa44ba7d8901b7d6050db032bf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf70b37a372befe8c274a84375c233a787d0d4dfa",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xeb168c9d678dc34d64337f4ea12cf14ed6fbe34b",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x8bd73ddd0080b4ed65ac5471a6891bc81e71c6ac",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x6b122672bc3065767dc4f06087e0582b8c7d69ac",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd6a1ae9801359380ae1fd2b627ed614a6e0f73dd",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xfc24a83a657a1f3f299a5f801af8816e2d14ff46",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x11726e15a716aabdb756223204f36467d984e7a4",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xa617eeadd8deada9de20a1112e2da48265445a13",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xb0e35478a389dd20050d66a67fb761678af99678",
        "swaps": 60,
        "distinct_swaps": 60
    },
    {
        "contract_address": "0x2653b9bf00512058e7e9b3e431a81db9621a8ace",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xb936e5987bbef0dac10d6134eadfe72c3fb2af85",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x25058cbd6a1214e8f2fd8c15eab888a2bb39bc08",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x04e06cfe568752bb91d0a794dbcd93d34fd1641a",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd4a5a51e0c1136cb5ed374cb3d0b643e69330fad",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfec180aa4cc8ffbebc05d3cf8981b56a5cb8ef88",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x136dad766e0d39599b5f006a689bd8ca1b44431a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc8fefb523d3456c8a75d7a037cb6a81cea7fa538",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb756f871e1950e65a00ecc11a3e08e543e9d2a45",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xff1ea65d02c57cb55f73c79410051f100cb063f2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9a03d2036166e3eb71f86eef20d3d001802f4cea",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x7161c11c441c7d7387c18ad687752166e66f43b6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa53a132f6d8ffa8718a84cf81a40eb920c3eac2d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8621fd365b9098596a264ad0b2027afbdcc911a0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb705ff7921831776167e474a3304e7de032f4035",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0xfd0e242c95b271844bf6860d4bc0e3e136bc0f7c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4d03741e0c11a7f396fbf109e0876f025675deb9",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x0f26711e0c73928d0bf912113946dd233ee7fa20",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0x1dab41a0e410c25857f0f49b2244cd089ab88de6",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x6f6ae1d99359f59a5de95b3750d72d256e7b95f5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x84b840df3017831a6ee22bcb12cd13cb9e9a78f9",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x74ef3b95d3e48b575953db0b19dc4fcd2e31f4e6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcb60e17ea720ef331446e434be5de5f35fae8bc8",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xcd2c5b223fa8e9a26113eb434fea79748c4d8251",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2714839101ffbbe83129247733b1f8955e917332",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x4f92ef05fb13ab8d3272d9eaa2d050976d1790be",
        "swaps": 109,
        "distinct_swaps": 109
    },
    {
        "contract_address": "0x9f365d603b3ecbd38290d2d78f00158c3750398f",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x764dcdab30d0af8fd1f45755e3d905bc1e2f5792",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcdab961336023ab66d0daf5c5d76d74e4e86da80",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x29dcac6c332e61f47db0e4eda1c7aac35ab08bd4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9045b1762a0bc4badd08ee7b1a55c3871de9b7b4",
        "swaps": 969,
        "distinct_swaps": 969
    },
    {
        "contract_address": "0x8c9638e7589a74f882ea95b06516ec3bf6f85268",
        "swaps": 738,
        "distinct_swaps": 738
    },
    {
        "contract_address": "0xbbb94518c92bb24adec2175353ae4c62a023c34a",
        "swaps": 475,
        "distinct_swaps": 474
    },
    {
        "contract_address": "0x27bb3fdfac9109d0b541a401717bf45ed6f56de8",
        "swaps": 104,
        "distinct_swaps": 104
    },
    {
        "contract_address": "0x43e6b5fdcbc474aaea1ab84f61883f54a078c10c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x864b9e489a009125dc52dda19996a32a9d4e499d",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x9c3e6de086632973bce6e5814f7c621cd1799a3d",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x12f499406c48bd97a4de7cea2d145e43478e15ad",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf382a590613587392c1f0ff761c1076f03c9afb3",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa64630620d3be065c464bc62849980d943c011d5",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x31c5b64b59f8ed113fd6eb7399f5df0570a2cfa9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x65b7ba2145f01874e580df405e224cda61aa3244",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xfab88a7cdb9b0c81f958f0c8ccc1e9cbb6299704",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8432e5c41c5c9fd2a4c0c7def017efb4f89c1327",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xadf09df3282070476e82b2391764568ff9fd9bec",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2af64089156efa9ce3677c3392ef8fbd9a06a8ad",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x65edb37cd6934d8eb825c0ceb6cfbbc33a1935d1",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb78906c8a461d6a39a57285c129843e1937c3278",
        "swaps": 281,
        "distinct_swaps": 281
    },
    {
        "contract_address": "0x95e6c356c87a5ab6cc415040f1c794e82015207e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb60d9ef5257dc2e773dc763b6e51c6ea529146c9",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x6ab8e5eb8514a7b5cb3ce49112db52bef40ebab2",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xf82e2fa636eec66cfe1b7759635d81d651c5894e",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xececaac630da391fd32c47a6c4bb0543615268ea",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xb137fb17be1436f855cbdc04ab4ea618444c8847",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x04b0e5a7fa975dfd4fcc1df57c7368c840f3ca3f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfd526cd8a5217654cee8dc2aee652357359dfb14",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd6e3cc3c2fdb3cb9459919781cffa6c11791da6b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x68cce7049013ca8df91cd512cefee8fc0bb8d926",
        "swaps": 49,
        "distinct_swaps": 49
    },
    {
        "contract_address": "0xe728bc603cd492d128b9067e73a0d024dfa3dae7",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x4bb452b8b74864f44913f100bee280daa61ac298",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x69437901da6952da49bca49ffc923dfb82abfb16",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x61f1d8c911bff2d9e698f3ba8f7cbd5c1373dd7b",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x58f49995ec802fd519a9699b23f9257ccc11b9aa",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2020e0d3c16157876111c7ead93883541f0da846",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb8c95412e31daf549ffee3f60e130f667524aee0",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x1b29352388144de7593e12e259fe4918d022a02a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7641d6b873877007697d526ef3c50908779a6993",
        "swaps": 104,
        "distinct_swaps": 104
    },
    {
        "contract_address": "0xefc483c054d5d0ca1e1e4dbcc1637b6adcf99efe",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2bbe0f728f4d5821f84eee0432d2a4be7c0cb7fc",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x460bbbdfe1440a4b1d4228ea7035291451957c59",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x27c59b2649b82dc15810ab5f1198d59d52a0a28b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd6d1ec04a4c8f73c423438c8574bb0179a9e836b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xabb4a4cded82f3e0f98f2964ad4b158bc1445d25",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd29025f1629d549b301f8c5a34a70efddfdbd209",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7e9e4641adf45f9dab4e809c55d7adb40f24cdea",
        "swaps": 65,
        "distinct_swaps": 65
    },
    {
        "contract_address": "0xee3987aa1b20944ef4f8f049cf1763007c06cfbc",
        "swaps": 298,
        "distinct_swaps": 287
    },
    {
        "contract_address": "0xa2937659873ef52da71a399e4079ebb2a7e5fff6",
        "swaps": 85,
        "distinct_swaps": 85
    },
    {
        "contract_address": "0x2d252d4a903a450afa9dac54cb696f0690259a62",
        "swaps": 111,
        "distinct_swaps": 110
    },
    {
        "contract_address": "0x186bfd06df0bff94aa078912c3210b00f04ee577",
        "swaps": 73,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0x250a890be232f598cd3249db912c683708d234d0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa1a1ff33619e41454864ba9519c8c61a559e0c7e",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x3734216a2b5f9f1d07bd97212455f1c370d17e71",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xb68acb5e1b44edacc304be598a713eca747da58a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x577aa7cacbad94cc0cc12a17209570a1d06bda3a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x979bcda813868b57f5f0d42caa1511f101161361",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9876157578b9f53a244632693b69938353915d5c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd8bbf9ce0b6b5e1c47aa13b76e79bf88033e0616",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1627ea6298010ca70b2a79b9ceac95efa9e7fbc6",
        "swaps": 128,
        "distinct_swaps": 128
    },
    {
        "contract_address": "0x7162c0acf32820920a741d8fa466b8e6d60d530d",
        "swaps": 51,
        "distinct_swaps": 51
    },
    {
        "contract_address": "0xecdc366dcab96c6ea1493914c910322bbbba8c64",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x50e67ed7e73e4bcaf1e99a3b2b3785d41e5c725d",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xa5cecf00bbac9bbf0177e50e0257b1a204db157c",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x283a334330532cec2ecfeb77095de189e1b62e04",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbfb1580eb61c9a7a00eebfb8aec867a65e100a3e",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x1313fab6da7a46c502d3c69c41b6aacdf3bd985a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa57ec7b4c2b0116e0bf8f9c6ab85468939849a66",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x47f1297d29efb7f9fef2b549118d6ad7cd4e8122",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa9368765a8855211e613715e5831e90ae1b22eb5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8b80417d92571720949fc22404200ab8faf7775f",
        "swaps": 328,
        "distinct_swaps": 319
    },
    {
        "contract_address": "0x29a92b95be45d5bdd638b749798f0fee107fdbc7",
        "swaps": 166,
        "distinct_swaps": 162
    },
    {
        "contract_address": "0x6b9338d1a22c89a99bbf2585af71ea3dbc63c1ea",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x81e796089262df8569ff11d8d3a43bfb5c4d9e26",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xcb3d6fdd0768aaf7400269987f1f64ef9172a05e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1f2f74bf3478ab4614e002cad1c67d3a84a5c2bd",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x78bb9c71223fa9152bd3caed4dde7efd4da927ae",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x43741b6af9370b64cd30b9ffd4f57c0ee1fe7b8c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5d63fba6f667c8befdf735d4f5c954a62de033fb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4b5f9fabc4f6f9c8dfbec38127f7fd925f80f6fc",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf934ad5c8a5d02d9eabdc18c4e58d513028649ef",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x254a6aa62a443d944f0ef77e9652d6ed7652b388",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0dd498da9a7d04fffb89c9005197241f7a68ecdf",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x94d979cebe0481eab8a1296818e81fc2636b0d2f",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x425ac08cca74f9f22ad807b623d41417f5d0d7fd",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x8c8f796d49d6720e62ff4acab35879538e57ec9f",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x5708d386d7a8f6f09f7dc1847fefe4371e7678f8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb599259ff9d99ad2a3b906aaebcece8f6e6ccd1a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1c5a040ea7b4df2c3e7370961491aab7b27e5ad8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x066b6655037eca4ff4c87af449f73c866554aebe",
        "swaps": 771,
        "distinct_swaps": 769
    },
    {
        "contract_address": "0xeae495187472b8db83cf9dc738ba3869fde5b1d3",
        "swaps": 193,
        "distinct_swaps": 192
    },
    {
        "contract_address": "0x516f2bdc4b00e207a8c6d3100ea14f1e0b4b6d3a",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x2d0af29764599aa0758d7cb259f720e919c50a51",
        "swaps": 125,
        "distinct_swaps": 125
    },
    {
        "contract_address": "0x92679486cb882338455e7639c3df309926438468",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xa1bdc426c981460f2029e9286938dc411e17e753",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xebe3a0130fb171d55811d2699d936ae55cf03ca2",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x8e67cc6966bde647dec1ebb2e8a1b3c046cd437d",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x74ee7376ac31628a66b2bb0eb2d14b549ab37275",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x6fc3360c48f6320421900b463c3075f37f2969b7",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x87bce359c3cf79b006c1254e3f20aae39e15a9d7",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xa7ec31358a7478efe7a36d2ff3b7e3bc3bd87cb8",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xbf1c5d73bbeef3db44e3d844f999471aa758883f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9f1fb9f997d8f645bdfa519847fe4d65c8f861f9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4154f789ac17a5d617634018b9d44a159ebae347",
        "swaps": 108,
        "distinct_swaps": 108
    },
    {
        "contract_address": "0x67b22409cd3ed98cfaba1bbdfb6ccc7e615d7ceb",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x07c82385909f8c4a9e5c38b0a0111ca064bc8499",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3ba7afa5f600be15607b89d03f98aa791c8ecef8",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe42864f9ae311cb167d745da468a07649c635551",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x382c0a6c947af95596a4a60f085b4c0a80f81876",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x9d8f89dbf6ed8a2909c4c2f4388a1f593b9b6294",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x231e0bfe2aa709ec2ec87b22803cf2ec9886c980",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x1f1e4c845183ef6d50e9609f16f6f9cae43bc9cb",
        "swaps": 1015,
        "distinct_swaps": 992
    },
    {
        "contract_address": "0xbf646010b1ae86ad7fbb4cff5fd93c7019331cc9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xeac1369f8ff348a88aa2339dac106157a238629c",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x77af777c5d8a1e9db541f60de997007c6e86d9e4",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x975ccbeb1e0e145f59df7291becb3eaaca8d1bce",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xf5164054dc7a1997ecc42b996b8bf12a2046048c",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x94dfd065b57f2a857a693e40f399c51d6b76c739",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x4109048fb780285fa421f5cf953db1341d3ea19f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0da8cdf9117f731e7e1b9c40f14130e7363ce443",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3a38b3c1a38e5ad51a5e9207fdd3a719c65d84e3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb21c3387aa3dc5f476ac8678e3f3c9520eb52ef9",
        "swaps": 358,
        "distinct_swaps": 358
    },
    {
        "contract_address": "0x034293f21f1cce5908bc605ce5850df2b1059ac0",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x0454ccf24c13b7ff6936236d926d5f1c0b1dffac",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xa94c7022c494adea0e2ddefc6e7054f9ad22e41a",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x370c7feb6fcd9f0804b477e3c807392e59327764",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe606f6898cade38b042e95fa3e5507b0cb4ae051",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xba96d902ba8321e43f55c7c7e581994fb2adf6c0",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x320a12caa9e4879d2082aad714c78c5f4507ac59",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x3f20b4ae47cbfbb50942ea2e8822d2a71183faa1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2eb553bbce473187047ac04bd01d4dd77fa01337",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x16d9ea3505df8e762fdb08cebb51b9a1250e9ebe",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9be680e053481622806b0f1f1496a4fe9f06a539",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa4afc8af259080b2fd2fc9dff5f79918a81988c1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa4819aa1493e1c7257af2a7a5667d415f3c9f720",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x62cad357ebc6fff4e67ac536b1b61722251c1ae3",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0xfca921d46ab12b54eb22aabff798a4c861419ae0",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xda512c82a440df9a6e7aeb4bb5f0ead3cef2d098",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x4d9c94c6f685e7640c1b69795aefc1c153a805c2",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd43762f7883c7db479fc74cde8bb670b02084436",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x0764e07278bc6413d7676f7f404480ff91f3ccc4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x6c853e983c0bdb31841438a765825e51a1fc0a6e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x49d8136336e3feb7128c12172ae5ff78238a88be",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3f8261daff5302bc396a5bae919c0473d80dde90",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x052fea3caafaaf3f95ec536b30714bff78dbac5b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xec0338139b40198ce7aed39be3bc2ee7bd998568",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb8462ba8bc53c647a941072bdfece27f21f6833d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe2a118148d0e8a4192a711b41b746d3b1cd3800f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2a0e6a1fc7aa5a3bb4ad89c97e688f5cb87178c5",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xfabc5ec75d07a7bb6af59f03c993727db584dc14",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0x7433afe84df37d0954ff87d7f5788f124f8597f8",
        "swaps": 255,
        "distinct_swaps": 253
    },
    {
        "contract_address": "0x9e76388ac98996d3c22efd7d71711d900bbaf3b0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0668e13dc61991ac8abe1880e0acf5f58eac7141",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xb1290965e96578c6855746d75bab793979acfdc6",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xf55d6db1949e0a73af858d0bd90adb3abbc6a415",
        "swaps": 100,
        "distinct_swaps": 100
    },
    {
        "contract_address": "0xa288eb82d946bee81436812b476763882df6c3ae",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x54d4f6abedecbb3119d9da899e212c5464996a04",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xee543b71113ea14e2acc55ee7b92d9cee0837164",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x94cbad3f6224f1917a74ef9681abe4f3251baf41",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0765d2c08914814e15aeed29d207ab1eb2e07c1e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9facdd2b79fdca9978945bed0cc35fcfe32b45b4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xab518c01bf71aebb69f04881e858a7baf96d5d8e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9c7bffea755b759da5aaa60d58161d2a66201b89",
        "swaps": 793,
        "distinct_swaps": 790
    },
    {
        "contract_address": "0xc4e90ae0298e0e7be0102cce64089231e1e2d67c",
        "swaps": 274,
        "distinct_swaps": 269
    },
    {
        "contract_address": "0xfc26a77efd7dc3308a79a43ae4c0b35402f1bfab",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xda48d9ab5193ceda83396c24237958a5be59f9b1",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x15551bedc20b01b473da93e6cfa29b1eb7baeabb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x64d1393b53e3c4a8b04fb1dde2c7b40bc0897222",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0x4d47194a157b1041584080fd5d6b9d14313ffa09",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9226908abf9e7fb625c06b53c8eefb37f125d4f4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x15f9eac81721bb4da5d516d3cba393932e163017",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9bf3715fb4b4508c2c70ed9e756f9410d4250293",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9231a299db60fd636fa7366bed582d1ead7467c3",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x3f0b8848476c5eef3546e8f404218b465cb13e1a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x30831a2c9c224903c8e9712d2eabb023e5ee0c23",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3d43f63d946e37ca4263b991d49ba1ad364c25c5",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x2e5cdafcb09632e3d25e69fc8e57f9dc52e35714",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe8dfcf4aa11d8eb4591e6959f8670ead1fa9fb9b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xae1d2b41447c8335fad0af7260f5604358dd3aee",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfc072b42b96e5516c917579cab8b49537622024a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x641ca8d96b01db1e14a5fba16bc1e5e508a45f2b",
        "swaps": 110,
        "distinct_swaps": 110
    },
    {
        "contract_address": "0xa6f7eaea224cb110c89f5ba6dafbad1e1176e85f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x61f411536b089dc1741dd71d334a37816ef56735",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x118889a8f4dd073ced039ec7af455c2f2cdc286b",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xe8661fd61a7154899545dc02b52e15d12377a764",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5aefd5c04ed6dbd856a5aeb691efcc80c0ab7472",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x3e9a0586088caeb2adff32b0c06cfa44151c7a5b",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xd694462db33e90f4f9ad047b68f5031f2470a235",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2b6bc4b085f50b0be8babc45d14a96947506bc32",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2f9366d4d1efeb79edb97437c37d4b7fea795026",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8803a9d6d316d1abc66c4ae01f3d16bc8de87964",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0efc75080188b7eab25704a77e0d8c579561ecb2",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xf627e14c318045066dae0a36997c8c1f34fc0d4c",
        "swaps": 49,
        "distinct_swaps": 49
    },
    {
        "contract_address": "0x631676ec6fa89c078f2995aa7be0eb52b1ab9cb8",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xfe663bfa84750ae564d45175022fb6b40f18fdc8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1c0ccd758c1da634d17ab8c590ebfb9409ce2c56",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x9f48f74db18d082e5d22da3375c72c7eaf7a9ef3",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x9ea187bfd47be3f369031dbb28f8e244c1027cc4",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x0630a5b9ff42e85ff52c91cbed97d81c3a4aba3a",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x1e65870a5e00e47ef9fa80a47fc119153bc55ac3",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x4c53fe4c3b78fb16115da0c59863f0f5beb22d24",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe9fcc427c37bb731aaccbe3145b7ead957297559",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf52dd4063d034e50f56cd3d37c6816498f0e8b70",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8d4fde3403e6d2d6525ad1b4ea4680c7ede00b79",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x21f9ccc081a17b89c54cd215fea0097fcf07b125",
        "swaps": 1211,
        "distinct_swaps": 1210
    },
    {
        "contract_address": "0x3b211c86c533ce0650a7f813a8f034e4b901b478",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xea0fb60e2d6610210554e698e6e184857eefdf94",
        "swaps": 83,
        "distinct_swaps": 83
    },
    {
        "contract_address": "0xa975ceeb05b379cf67fdfa63e7b2770f9f1d72c6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb417da294ae7c5cbd9176d1a7a0c7d7364ae1c4e",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xe379cb7c6a786ab46eec42a0610c8411950f57e3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x033a85f18e468d07902637c391fc8b0ad6a8c8ee",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x56c86afbd17fc779255a4c12bab10fa3c2ca96d4",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0x905dcc700fcce9a49b7d907e371230995a45ebce",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb735e582db436bfd933d6938a6e96f01ba79125f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb78ac4fd3aee81a407e3a60c17922295bb7711c9",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x1b5c4489442c5351e99071236265e83d316d27e3",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x33d39cf8a90c33a9f92b4b401cb68a8bfbcdd5b0",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xd4bdb68ad7490149587c1117f9aa20d862105d14",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5efc1208910803d138314b60870a1370f3647b8a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4f3fd61b6acbef7439eed39298c5e0c29376c7c4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x477105dc933f7684a6d9d19ee1d1cff72038f325",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf8b5e03841c07a72035f719979ccd6f4589bbb8a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbe83240eab06a5e8b55a828d72ac514dd0318a38",
        "swaps": 99,
        "distinct_swaps": 99
    },
    {
        "contract_address": "0x7e3fdd799543d5bc0a6c53f0490d3f0dc264f334",
        "swaps": 55,
        "distinct_swaps": 54
    },
    {
        "contract_address": "0x737da5f520b47cb15af413fdf93f036d83113a1c",
        "swaps": 261,
        "distinct_swaps": 259
    },
    {
        "contract_address": "0xb6ac59852e7dd283e30d7139de7040796a23de4e",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x3bffc6bf7e8b572dcffdac4227ea749db49acfa1",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x451cce13c6e013f463df6c156b7661b19df6541a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb01f765d598471103178d4cf22be3cf86ca72875",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xd4f9134ba896fb6901cd6a5ea4eeb683eb1c15c6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2016852944060e5dd0b7eb08eb43b15980a582e1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6381ddfaf83c30bb06cb9914969d9fd265ae61b8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x81bfdb6626715a1db832e65ea1cb0a32a506916b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x78a8447b5f1a10b071fe583f1775a206ebfe033b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9f0c603476c3e41de989fc830e63961b23255332",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0xd2673540344bdb0507dd3adafcfe12551df9edf0",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xaab5254e17380511887aaba7e96a5339a519e26a",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xae3b364089598981c57a3ff217cc912fe981f377",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe0a297059ecf946c38b78c6de71bcc00cc14953e",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xf98df36e59e5567b1b3f0574cac590aa18b2f670",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa1a4b1cb0e2311a28412f2e852c229ad722cd32a",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x3bd75a6a83f7efcedddfec7253ae6aefe9b3f813",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe88a33ec106e725d5237813d6070989775127cf5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x29f71aa6535a6a50ef03ea60b4edc8f8801bc134",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3a32be9bc400d41ae36f27d6cdcbb071b10907a1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x59377dbd9f550568540cae0b21412bee1cc3f439",
        "swaps": 58,
        "distinct_swaps": 58
    },
    {
        "contract_address": "0x8f07eac653cd812b3ac691729cd16616e232de68",
        "swaps": 66,
        "distinct_swaps": 66
    },
    {
        "contract_address": "0xcd756b776dd81d787d55cfa769e312423dc4bc68",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x54414d54988549d0b583b2b8a9c70c94b74548f7",
        "swaps": 24,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x577b47d03cb13861dcbf317078954a3d062e5333",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe12a0b6d024c63a1c06886d8f2a4a6f879e26720",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x6be45fc523f959bc62991b195fbc058f54b08370",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xf9d3c29d8b578cdd1a74237b9e57c620a1a7b584",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8b6631324d4bb1759f708dde77e93ba898bb58c4",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x3f9e7641ccd328ce1eebc36136651cff5d636a74",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x882624931b4a799d50242e5b25e2fa2719e4d072",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x096c77c7b446237f607a1d5309bf06c643b17fd4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4570da74232c1a784e77c2a260f85cdda8e7d47b",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x34d98012fd41454ceb030aeec0dfd47c4c9ff997",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc879bc72136cb6519b5e0e456bc9d727e106c582",
        "swaps": 112,
        "distinct_swaps": 111
    },
    {
        "contract_address": "0xc52f4e49c7fb3ffceb48ad06c3f3a17ad5c0dbfe",
        "swaps": 64,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x8ceed6619aeffd5476315b90eb081485da2aebca",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x3885503aef5e929fcb7035fbdca87239651c8154",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xb023e038ee031c4550b0ee322e85de78621077f9",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd13c2af8265f6e72e5c7de0bb7f36b26cba3b355",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe6b34a361db84799237211f66eda5ef1c00fe0a1",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x51ddf4d70da636b7e2d6197eda8d99c1b89c5656",
        "swaps": 51,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xbf257b2eb31ab824a26cd49d6d58910e80854cce",
        "swaps": 152,
        "distinct_swaps": 152
    },
    {
        "contract_address": "0x7090f6f42ea9b07c85e46ad796f8c4a50e0f76fa",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0x9663d76d187aeb20374874c20a1348538bbef557",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x0762b81ad16adcc59909d4e4117a04076eb8808d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xccc11926a9383f6447824afac6de1785f538050d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4c3b231c0e7ec48f3c94fccda4bad08827b87dbc",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xeac34a5425fe41574396fedbcddc11a53025e750",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc96a37d98f1701098e1324cbdaa793c182fa55a1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0b23bd7d56160272049c6b33e2d4d575b6be46ae",
        "swaps": 256,
        "distinct_swaps": 253
    },
    {
        "contract_address": "0xebc4f9b1ce66258ac3a48578ffeeba1330ddb68b",
        "swaps": 1367,
        "distinct_swaps": 1351
    },
    {
        "contract_address": "0xb9ff3d3470715edc6438f8a9a3c6f8fd4fedb751",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4756ff6a714ab0a2c69a566e548b59c72eb26725",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x6abbef4779508a376df7f67b1618ba04cc1e9d60",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x881204fbeea7958bb6ed7967a13c4ea0fe073088",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x11e8ce3ec0ee6aab254b00d95c1e3f5a59c10c4c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcbbe4da39c1403601f65efd45fcd8c793adc48e1",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x2ac46f35f536494156920f1969950c8b57f0a003",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x763dd5e7fcd83a2156e65d358bfc19246072893b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x863696001b65691a3a1958a0ff9776aa48e86aab",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa56ef0cdcf57c895206f175251cee9317c1460d7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfed35e3dbd260639ac2e65f4bbad6c519a2f6366",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcf5ad46d7432778149630b5a644356acece2ed09",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7b66c5e8edd94e830619f309dcd992665f85629e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb631c211c3530708a2a02b434ba2b565395573e0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3a9d40e4341e341140dd37b700ac75481665ed23",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x44eb80e54a22c740c919607599a3bc46750a3b71",
        "swaps": 337,
        "distinct_swaps": 333
    },
    {
        "contract_address": "0x689e00ededcddaa881d6d9c65a6d3c09f5c7c41b",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x8f772ad886cf5991f94871c1caf315c6a571acd8",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xab4b9f608f2b5e53b259b1878b68b93a1309578b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xb933e9e1ed78612e24f79cdf6976ef19fe0e357c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x50a4dc86a288bf1fdf93c5206a938790d26f2a46",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xcab93fd2ae5843305a3766b862e01c4bc54e4fa9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4917bc6b8e705ad462ef525937e7eb7c6c87c356",
        "swaps": 168,
        "distinct_swaps": 168
    },
    {
        "contract_address": "0x0991e9b2d3cc7cb03cab6d85ea14388b37553800",
        "swaps": 353,
        "distinct_swaps": 348
    },
    {
        "contract_address": "0x30ff765cf0a288b1e8cbf977a28bd4fcc06add53",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x531269582e1455c8555c1bdf75460dc69e0f63d6",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0x700d6e1167472bdc312d9cbbdc7c58c7f4f45120",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x20f75c3a9b93f721b2304e50e81ffed8d60210f8",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x171ae0580280a6b15185a5d72725800581fe71b4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xca260a4a63be332a328ef91124ee2fbf26738c48",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xc8ca2ffb41dc09f3fe1113e4036ef4d54dd900a2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x933d7045ddf5e2de167e9bbe4d0e74a7bfad0337",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x4637bdb06e6c3d6af354665e6c161810978dad0c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb6fbb59945c7dd8a1282c47a60fba77081c8cc2c",
        "swaps": 376,
        "distinct_swaps": 376
    },
    {
        "contract_address": "0xb97977b27a3ea8b4ceed1c738eca671a0ddad5e8",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xfa83a1e180fe060ad51d855f3315e7079f66245c",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x8c31da732e8ddf1c903bbcf001484061e210c9ba",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xf086175a42226209de3102270636fb47d72c1e98",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xeb275d1d930f157504cca7d7afce38360c7302b5",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x78a850be3b45822c104bbfc1d316d985a8d257a2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa8a1626ca342f25a844a6c207d6b83c6d3d82bc3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6e53cb6942e518376e9e763554db1a45ddcd25c4",
        "swaps": 191,
        "distinct_swaps": 190
    },
    {
        "contract_address": "0x16d57b97efc221ee6abfa491f363b316e7da4e08",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x66c37a00e426a613b188180198aac12b0b4ae4d4",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0x244c4b75c83d38f1458e322996e09d9e60f55d77",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x95697b1b83e0f28017158bf2a2adc6ba991088ec",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x785a9bdc0cc1a6200ba60016f3fecb2c1bc8a172",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0xd1611c994e3819a149f351b4ddbb15449cef9ded",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2cc05c660f35e8692ca99db95922cb744d44ef20",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xb8c598dcec679fc53c7966e2070bac9a7761d05f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x0cf4382db40f8522b92fcad48e09b04b0af13d87",
        "swaps": 60,
        "distinct_swaps": 60
    },
    {
        "contract_address": "0x5efdbcf93f0268527cad07d9880199b3aa8abe6a",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x2bae87900cbd645da5ca0d7d682c5d2e172946f2",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xdb904074ce1279e379c25c074dd602c2d1bfa6c8",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x536a61e4644fc1932996d2bf1bba26b6efb120d2",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x982c529fd47cba8f627c2abe30286c69ab593501",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa9883307034c68bc3ac79a6ea67fc1f9bd27ba3b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x48aaa0bcc94cc57528b071ac1d5f70cf89df3dad",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x01fd0d981dcf288dd9afe4d1f75c82a76ca2128f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x80e64de22316797a1840ae6289b0ecdcb1f983fc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5e5c0e7dcb14ad8ef13e5280ed8a1ef61c97d1cd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x80fdedef0954c63c27d783ab36fc666eafe5a54f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2f2349d7d94300aedbf55351ab9c071a4a4487b4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3a35feb378bf72cac9410a2cfcbe989cb2ff02d7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdee9dc02c517866d33a9db1453b3867d61a24f3f",
        "swaps": 221,
        "distinct_swaps": 220
    },
    {
        "contract_address": "0x2fa82ba3a3ead9316f191bd83fc41dfe95a967d1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7b3e67e63906d8576466c2f48158a30be0a9e36c",
        "swaps": 59,
        "distinct_swaps": 59
    },
    {
        "contract_address": "0x9bb608dc0f9308b9beca2f7c80865454d02e74ca",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4585c9888910397ebbf9d9e1870d1812462dc6eb",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x602fe85ceba5d27fd4d48c241cfb83ce045a179d",
        "swaps": 61,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0x6442b2300fe1ac27841df51cf5f074de9316b096",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xfc11b4efb817ece8ee0f93d141b3db914176a391",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4fd19e59a1041e82acb3ecc6773ee99913076868",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1a45a8de4d836cd7549b7f2c1b69e141f08c9051",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x46a139e6f19b69f5d383f1e1a10bdfb8d3e03f1f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xaa5d2b2e72e6fdbfe3acf96bacdba0f226b76a21",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xba0b900574c7f7133d066afeca7737d64fee9e08",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8ef139998a743d2cad66df2e750a8c4936f306b9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1ecd1a5c690f4036348154d17bcea4b1afcbf108",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x173e90f2a94af3b075deec7e64df4d70efb4ac3d",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x856ad56defbb685db8392d9e54441df609bc5ce1",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0x0c9580ec848bd48ebfcb85a4ae1f0354377315fd",
        "swaps": 12,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x316bc12871c807020ef8c1bc7771061c4e7a04ed",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x0a126ad4e9c446c6219519062932f624d82e075e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe43dc3c74bfc717950ff1094bdb4190d746c0662",
        "swaps": 13,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xef4adac585a7051f660e8d98e0b4e0edbebb5138",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0c4ed68848bcfb3c2dc3eaf7b0d99f4eb068bdf6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2e8c56c1dfa41263739c3341093ae5e9c4d9ce67",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x424377e5c0af69044cb0b77acacdd37b0cb440d2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbdad9ec2c8f1a80e8abcdf2f2ff82f8bdbaf877f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3733ac45ac15b0632fae2aa7e93e360ada05d356",
        "swaps": 133,
        "distinct_swaps": 133
    },
    {
        "contract_address": "0x36fd128df5eaab39f15c2341ddfed6259e1704b3",
        "swaps": 319,
        "distinct_swaps": 319
    },
    {
        "contract_address": "0xe273d3925f6dc6ffedf7aa082594653376a2d38d",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x7641f96a2b7b4708bc9e8f4d7ca08e232c31a3dd",
        "swaps": 74,
        "distinct_swaps": 74
    },
    {
        "contract_address": "0x9393b653ec05dbaf50c72e8d64e3aed23517beea",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4e45459daf7f10b3b825fca477d8b5a19671150a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9900fa40db262155b4828479e0cb6c99f04e647d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb3570262db2cf7754ef1cb85d43cce52de97b1f3",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x3d93261ae1a157e691c8c1476ae379c5eb8f6e33",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0x38fe052f0ce76a2239115589098d2fb5aba01d80",
        "swaps": 17,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xc7822550dd0f36715e5446986ec2da14e0bae40d",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x9a1176cf7a867ac31abcc7741f3afd5276810eac",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5d72bf8f600059642a242448c48ca7f51f5c2548",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xb06f5bd6083a0ea630780337989329aba5b68e61",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x6399c8700047298fbb31f68a7fce3d609e559926",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xfcae1672f179945693b053a4da5f2fd87fb3f3e4",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x4bd7d310d196229dad98c1974dba46ca91290b5f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xdcf1d095ff886da257c646d7876cbd16dd1b8250",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xce1923d2242bba540f1d56c8e23b1fbeae2596dc",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0x103b6d489824b087f739ca1997994fd5da49aaa0",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xdb6dc240087a29187dc34f91af95f627ccf3003f",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x82188c21263a893bf34d7b59ca56d04e0a0727fe",
        "swaps": 36,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0xd876d019590b252463732f3153475d04d57ae13f",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x3f9650f4a2339b87aca35461a47f030c9cae7d38",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x39c3ff4f1008115ad6c8a9cba4238bc0556281d8",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x222789b185a145ccbd19803a448143252612d012",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xd31052f1fd2f90badcc4bad978c91ff3a3edf919",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9d916846d805ce3aca7c7819eb5d95bb1e1c5c5a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3a96a8e95019832d0a8eed53f6f3d0f0de0a875d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe1628a0e5250fa17271cef1ed4d892cb32d5add4",
        "swaps": 118,
        "distinct_swaps": 118
    },
    {
        "contract_address": "0x9102c3ae522459040d0652bf5162518246375a44",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0x1bf94343171c2c24b7b565c4d80acbbec67b7677",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa62bba0d65ff451c313b1a8bb3cf102ed214793c",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xa5f2796cc82b6a845da92d617fde091e2f05caf8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x91a94765df00f4c148364b2a2c624a854c6b3a1b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5b84bd9f7f86a93740b5dd04443805a8572cb72c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe42301c383ca8bf9bc8780036f01f434cefa5466",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0x8c7f69b76a1c97f72efc6c7c19140bf94d33e133",
        "swaps": 90,
        "distinct_swaps": 90
    },
    {
        "contract_address": "0x237ac473ac0ae4551019d9298a4118b3144f26a8",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x303aeab53c499dabc08fc0e5aec763a962a51c4c",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x95ad49c07a50da43770a85bc4a1f4abf7e58b1af",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xc6e50c7906327237e15f5c5234ffe9f8123ce84b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xca4068780b8c5f0ea048f55f05e54f9772b5cdc7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x274a1bedb4c390933aa790191e4fc5dabe909515",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x405ac4ca19761996c3ebf588d180c16c29376a9a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x37d585af3927b836b06ca3a85504cb9b9f5f366b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc87388ffba9de8e99ea7d429821a00059093621b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x730b09e3c5ccd17a2dd9d9c4254b96ca4bbd1023",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd4634a9705b3d47bd39e2f1ff50bba0cff622c8f",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xebca34c9fc0be6a37deaf62ddd064941f53ed246",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xf9c439473e41d586aa1353b5a60da64d8c323de0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcfc4cbf94b26f94e86863e1b1f0ccae6f119dd5a",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xe507a93b99120d916229ee6d4adb4204bbb04edc",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x9d826e4af2e111b478fd2da50f3bf6b07d299f6f",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xbfd79964392d63ad920251cfde57725153179072",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4df3ce002c65a15e1bb18d8145b21a87cc638414",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7e24a40439fabcf42ef75099bcae123c6d8dc0e9",
        "swaps": 69,
        "distinct_swaps": 69
    },
    {
        "contract_address": "0x124de7e03b8ee7363974d5ca3b1868ddf3a23cd3",
        "swaps": 115,
        "distinct_swaps": 115
    },
    {
        "contract_address": "0x166bda40e360f14b4375a87e3fc9402f5de755ae",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x844a8e6ec4cc3690ee753732805e245fc26e8636",
        "swaps": 31,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xd29a84ba6deb95063bd3a0a32212dcb272156bea",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x8cdc6f5e06a1036af799605671a0f3a444744e99",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x9cb293ece9b31dd22acb149b7d1adf7c9ceeaeff",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5b2ea367786102d327d427ea72be8cdbc55ea362",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xeadaacf89d788a880cd73f1421707c8cf2dc4fa8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf8860588ed95e7aadedea9349d2a6e4cbbdcb1e2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4eb96db42f67dd9836ea029dd89298f52d60fd96",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x42ed6d85ccf43859cbc46f6efa1f21e21cc24030",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x1f253e0bf077117fb41089fac86f5e6f0141a138",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x08bcb3173ec8886e18685d52206b38d79a29d00b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2233ea70be0c1d2172947a7b872f084fd093528c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe22b33b115b6c06dcd429077c1dbf4c54b4a9eca",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x75a7ed573fccd6f0e5406629dfc0a3bdef9908ef",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xb43f2a16393c90f190f2ab3f0951b7e23a03276b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x634eaaac7c6149e79df7fd27e32924eb0a1fa761",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xb8ec2277843a99e757b57a25b5aaab51b8dc99ff",
        "swaps": 34,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x35ea40f1b8c0eca91da769b4964cf643ff992769",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x2962895587e945b75b0a84b8cbad31ec442b01ff",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xc4db759eb4702473d0d78e6dbeeba18ffb5f1ae9",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xb51a9147c458e7bbb5cc4828c23be49ff9a33afd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6eff87a7802e887b28fa3df1947c517e0e1bb3b6",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x1cceed3b2c5843c0736940be9d8b7e1262525e89",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x802b1cab8a38f568dd5e651552bae528198bf7de",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x16825ab5a38114adbad025fc9bc9f9083c8160d2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb329e8c8b4c22549b2f94f264361385723d5b24f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6b596bc0ca2d33282fb89578594c10f64cf54fda",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xa7e340eead5dff3752c4818ae1aeeeb7b81b78d1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7826d69f7c09710919d548d313d77223d24e7c3c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x719e82f077a2d5c03f59547324306d39d7bcdf01",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x6d5b9d13bd6322cea0e52ee5fc71ff5e2af7fafb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xca58f341a158956884d359f83c6ebd05e0390806",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x85de135ff062df790a5f20b79120f17d3da63b2d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xcc2ae5a788d2f20f8eced42f0a575fa808285558",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xfec454cba10647bb0bea8499d78ba2d8ddbd2a0a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6fb8272368e8b7c7ffe35b718b11e7894c8528d7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x668ead82210982831e99b92daa7f0228f5f42cd6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x96fdd975c4ba24c49e21140284ee09d6537e8ef7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0bb064bc8d01ba9c3557887e21ef59736a3693c0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0102b6ebea22fa1725a8c0678414c279621cff46",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xf58c22ff037978f98ef9c808f84c814866bde208",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x236c3c0c45b2676e76f10daffa0d8f20ff69f4d2",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x238f9b3d76caeadaa98ac16dbcb68648b43791bd",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xa86eeb274f5c48b5ffbaeda1c41c2bc7fae79b55",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x809eb07d2e25524d843eb88c30bdcad9e1a75055",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf93b5ee31448a6d27ed2dd1a9c1b6ff916d3364e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd0bbc0b7f702e4fc9c4717b6286db15263410db0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcdc5d8ad7883d53a07891e8a5772974c8b96c26b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x37aef785d8d958f9fed5ca384c9316076be59bbe",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe2d54227645799744ca53070e5c65b70aa630fce",
        "swaps": 148,
        "distinct_swaps": 148
    },
    {
        "contract_address": "0x66cbd9c3275371227a99b321d475db2f706fc269",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x4b8110f73ff9ed8c08ba93a33aabb3f472170496",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xde9d7807dc28b8827f98875105588218368d2146",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xec3434a26545a8a04dc3971c8bddcba23efb1b61",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x47bb2d406a9b936106558be20e8aca5a3c5d006b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x83fdce3f2025aa58bc99d89a43ee5d2bfeb74500",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc18bccf0458c3cac31dd6dce372b71e5c5387528",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0b8d6d623c57ec495969be6ba7dcffbc2b80e638",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbab50a0ac655c998190d692fe7a78e9332c8359a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9c8ec74954c57d02c8ea17c2f518fb16f4126f89",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2f2c4a52616663d15e3face26db6305afe549edc",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x3fc0e07798aa07df794c40705d7d2aa8c68043d4",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x37b31ab9b66b0047e55d5d3158157287976318c5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xeef611894ceae652979c9d0dae1deb597790c6ee",
        "swaps": 3087,
        "distinct_swaps": 3066
    },
    {
        "contract_address": "0x995b1f650b7285b1e39a79232ac04f2f1e285422",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x625f89b73cead0811efbc12ed40eb8829e169a65",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x3ff616172e87429a037e4b42843fb11bf0c945bb",
        "swaps": 56,
        "distinct_swaps": 56
    },
    {
        "contract_address": "0xba85aeaa410dbc73809c3786b8ebc411aff3196f",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x1ed1d74107d3c07f75b81630a7055a0a7560b804",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xfff72f6c640c347726ff2b318e4dccd6b28862b2",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9a410536f72ad0fc94e6e6ab28fb298a7abc9ba0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb3ad0d6115c1204120b7cb4148ece44532bd626e",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x7c109a28fa7cb756b2ae93de2ffb4e9290110ed7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd8d27f5d78d69869344e426162b5759b81212a46",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x718f21a521e9ad6db3ec5aa6763875cd2b8b8701",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa4a336a5034dc16243571a8a5a168f4fd2d02095",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xda94b4061290c0c180fc1bcc3d4724bcba9cfa5c",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xdfe1c52f29defb9b956c9ddad3716d5bb2c09164",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x97f593c3191ddebb9d13d79cdba7b612fe9b2b0e",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0xa5cc7c4aefcf984b3fd58a856cd083f72b2c6e4c",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xa6ea6904651c11b937e8c9f5d632ef7b77f30e39",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x3f24e142fbf05d16ab1cf79e6df3473f515b16e0",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8bab87ecf28bf45507bd745bc70532e968b5c2de",
        "swaps": 9,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x5514dce29647630300609c2d63694fc5c5d55c71",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x001a5201fd46f2c77eff4f5bed1382e500e20b08",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf9a0d64cd880a73a5e0647c397ac718bbae3b9cd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x253d637068fbf11b18d0f2a1bf3b167d37802687",
        "swaps": 299,
        "distinct_swaps": 298
    },
    {
        "contract_address": "0xc56060af39152c614fa67e169c0dd1809a886e4f",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xcff628cee792668a2a9a49bce347395ff14e4bf5",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x645a563946b96b5aa49f8dd8f408afb46febc8f8",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xc500639d7922234b9b02a58197e4440b144b9c6d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x316addf512b2d3c98769d694d7c17540c3bd477f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe8e01a0f487234b9f7655bfdd1ef922525ad3c47",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1100e7747e2fba316ec699f804b3070a0ad525e4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x631ce985be5aa50ac0e49ba5a414baaf999af107",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x106ee8184fff7be45750b8262a1ca26e95283a1f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3cae7d8bd8c20d0ae2faf738f8d4b0fb02ac7947",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x9d5373d95e95ad9e47800f7959d4d8c195c35df1",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xb20e03cc86c0d74bf06cd6f31c57cf7c7ba90bed",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8a61996bf6f9d8f60faf6e8f0e4c04dac97e190d",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x6db145bf810377fdcef7508a3e62d5f0c4e26ce6",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6cffbeff35848f48ef69f4649e0a3efab138b9cc",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xa8f74cebdeb6525bbf447b5e76443e4c46f3f7c3",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x67ae613b08d858d89e5b48b636ae11af349a7e73",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7e5c8556c2e29f37c7ba0d7f29e6c4ea5bfec044",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc0461e1e61afe3b7a30477e179f9d3aa87c7cddb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x184c6f1e09d774b59cbb9457f80aa88aaae92cec",
        "swaps": 90,
        "distinct_swaps": 90
    },
    {
        "contract_address": "0xd862db749534d539713b2c392421fe5a8e43e19e",
        "swaps": 116,
        "distinct_swaps": 116
    },
    {
        "contract_address": "0x94383a45f09a22b9326d2e1ee5239fcc94d70f9b",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xe772ce47ff5d55fdceb0417dd55e03928ffb57c7",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x6c1fd089159aa70311e5cc0fef16f985a89592bd",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x9f87406b82390d98516aea7a319eef754bf02712",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2220d261ffdc8946526e73f1b668b0464cd61bf9",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe8c21e0377fbf10546566b04b391d9c66baebc91",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xeda53f1ff96b3d144e06adc810aef26830846e11",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9dc72fe6979c27329dff4390da7a69e6afe95597",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x0a7bf11b6837433f3fa3a4f6ee405d60a0c325cd",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x728161fdea6517641ff5ef2c0e4d8d35d3ba48fb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd4f9f898d40471d387f79a22b5bff5cfd37823b3",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x686707a31bbd952d184b90505b47263fb677d62f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xef4150a29e6a3255755f697a298c26f7f0e85f42",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xabca5f54b7fa4319b059a73a6a4ce4b6e4a5ab18",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xca42686f56ae8141942cfcbef20a184c16ed261f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x206b8ae78f43275ddd419370de88dc155b7608ee",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf4245c80ee7e390abc8eef0f37433e27fc1acdca",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb086deb2d90ff135b0c7a991a01eb36a98000732",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb1f3555a7c3753ab4e6df1d66cfdb25477a36ce7",
        "swaps": 90,
        "distinct_swaps": 90
    },
    {
        "contract_address": "0xe3cc3bcb738af9eddf3a70a797945d7534dfcdac",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x289a848f25194f5870d7c0bb53014ee31660399e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x972d0c9d46742d04a35e2521e8ff1657e8107b2c",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x98843f4d05ea6391d6e0cce4b465d369326888c6",
        "swaps": 27,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x928ed5a1259b1ce7b7c99ac5f100cf0db16b424e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe68a24b1bfcbff901fb63050117ec6ba9249e6b1",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x707720a317a282ee3cee6b0a323b6441b24fbf37",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x932878b226dae59c7268ad97e5f3cfd95a900bfc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x94053f00ba1fa9db7cdfac10cd165110f9c7905a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x70bf5ffcc6090a8d243fd05485ec4c084bd10ae5",
        "swaps": 360,
        "distinct_swaps": 359
    },
    {
        "contract_address": "0xb5f05231f422de78963a42dbc671bd42eddb5d77",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf30ad3fec379b7507f5abae7578ebf2744c9ca22",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x38e2a417d8160a795e1e49a61d16db224c342a81",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x32f3a261441c45d3bf5889bf8586b4aaf9e52d22",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x03afc0563b287caace97b1de84e087fe5e478027",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x7862a9e78740c5aab4f664b5b92042a55abee9b1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa93e3e80544fea28abbd828644f65209ec381bd5",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xcc1d0846b78083e484daaad59b26495b1f650733",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd4ac3fa2d4a8091e86cb7a10fc92ffd32664addf",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xa5081627176b5c9491a915f1c9f4094384920a1a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb57b4ed838e36a0e0179fe78e500854b5d6c43dd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfd037002a2c27b121517945c9372913295c42245",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2367eaa68445931e9497fe7c6e2e6e5227eacb73",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x772368e5f618685fa6674fe21b908472e9004b73",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc8a1432d1b93eb250bb63c8ab65bbc27d46c48d0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb210c8ad94b776a67d9130c69cee96176e2bca74",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xe837c9afd026d346ee6c2aa57b7011df3abc2b44",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8422afe8c0285c393dd0f63da1fb12642fb154fd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf786969925405fb3fe0202d1f4fe325461318815",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9edf511d35a9220537d9756be806f7586df9c954",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x986e5dee2d38096668f5d5a54ea85550d436c996",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc9083616b2f6599dfd37296559ac60c2bf067734",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x432a8a7635ba17f6abba5d8d0aadb8e1363bcb6d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0806a407d6eea72788d91c36829a19d424446040",
        "swaps": 1582,
        "distinct_swaps": 1578
    },
    {
        "contract_address": "0x2f653881b6865a41cbf2d7ffb4af1a959ba057d3",
        "swaps": 68,
        "distinct_swaps": 68
    },
    {
        "contract_address": "0x80b3902afc046e6c41dba93bedb1872f78e541a1",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x42acf553bca8f9af8dc0b3e507931ed96f8a91f5",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xa76b0d74151541451bccbaced4249483cd510097",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xc328509ae036617f31ab07382d7074fd10122b1d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa489020ff71ad8e40cf80c6f522675fc829ab68a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2aa5308573c3b4c0a5032b64cf7e593610a4de43",
        "swaps": 69,
        "distinct_swaps": 69
    },
    {
        "contract_address": "0x7dab6054518f67ac69b0afa4c46ff16dd2bf560e",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x3425ab3a6a92aed14c665fe8c9c206386540fc14",
        "swaps": 160,
        "distinct_swaps": 160
    },
    {
        "contract_address": "0xb5a7c572741d77f34d2096f928beb6168f31a621",
        "swaps": 113,
        "distinct_swaps": 113
    },
    {
        "contract_address": "0x8167d3156fccdbaf3e43ae019a0e842e5d1f1ac1",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9a41f05ef5d75992f652b6ffff067a5c4498005b",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x3ba08efe9d1081173749d06aaab713c9864bad86",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6fb8fbed8efe57e7c4f6f9d9f50b9bbbc16a4801",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x5004acbb3ca1035c07fa6890037e43b92e0943ad",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xfc067766349d0960bdc993806ea2e13fcfc03c4d",
        "swaps": 91,
        "distinct_swaps": 91
    },
    {
        "contract_address": "0x8d7ffb5d6160911c4b3f7f67f02dfaa87456c571",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0x9caf7bbeb28e4e69dbb255017d231d98d0e1ca9c",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x90891a7c7d3e26a015b69d1d377da7adce780e8a",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0xc8ecb75d92de09ff8e7f4d93675e253ec6b08519",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xcbfaf7a8d20133037404d1856fc569a1d9e75d44",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xf1f034098692d807c8d92c1ef8922df92aee4bbe",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d7ecc37698c0fd4fdcae47bf25f740d9188a0a4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa1746cf26a0dc3272815d099156bcc2c2bab40a2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbc75ca91d2844841171340bbf686855c85031409",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa945e334f25e869a13ca0bcf8e6828963b270938",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2f466b153e6b0d7466aa36c3f3835e2d146fd916",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x4cadcdfdaa5da1a9d1afa76116ca8a20c43f789e",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xa1c3eb6fe2bb452aac4d9247478594bf04750017",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb4006e16debdf8ee722a1853ff6fb192a4909e98",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb300f1750550c5dc5887952ce37277c59d7d50e6",
        "swaps": 236,
        "distinct_swaps": 236
    },
    {
        "contract_address": "0xf9a77160098f346becf6ea6f8f411207922f6677",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x3dc363ee215a92a9407200b889c13437633a88c9",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x137d567164b639b43ba8ddc8838e7683e7452e17",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe74ddd4692eb3db446a7b9fcb4f2cc9946271db4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4c23ebfbb967b2e0c48291d3c92fbc691e952b03",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x955393d46c0dcc73aeead903cec779faa73e317a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7f41df2a38526e4e9f434457e666d76459207707",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfd0d4cba23ed8307d4e92f8c4468ecb6f976774e",
        "swaps": 61,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0xc67136e235785727a0d3b5cfd08325327b81d373",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0xf972cdaf2772feb03becc0a897bbdeeeaaf82264",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8ad4b3f2c3cc0e4b017e48290f1517824830aa04",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x869f6819b1f7688fbf13ca887d4bba2c103dad37",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe1e178b6b53e3597b76e5ecf69f60dca086d7f9a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2cf7252e74036d1da831d11089d326296e64a728",
        "swaps": 822,
        "distinct_swaps": 814
    },
    {
        "contract_address": "0x7d88d931504d04bfbee6f9745297a93063cab24c",
        "swaps": 272,
        "distinct_swaps": 272
    },
    {
        "contract_address": "0xd5e31aa72d73f1cc96673c1335f56075d1738b62",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbdd016dd1f2d1e842c055186fa5f3b62784a800b",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x068c9ce6abe3544af19fcf7a55ddf7c92614fb37",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x76b8dd7ff50308203cb047718e2ffe835f522472",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdf82e44f2c579ed9db37b66f9ed7af04e5abb9d0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x029ca490887ebec7ddd07d1463f2ec654ff62c15",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6cbe0446e2a7acc58316f8b3d6e7a7804f5548b4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe32a72d8590e6b4bf0c9d604b3e69641ef3cd2a2",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xc56baac876f4f0f8f2e3a995f37acfa2eca92ac8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2a4f5a590b5d27635639dac861c7690d11aae4cc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x47ee7e6a997ba0d1b02b1de786a6324f8e8cef20",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x16d1853ad3f3ce542ebdda631d6493d90ec25791",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x9292aa90f81dc77fe6e6bb34b276502b6a047f7d",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x494cbe8fe15be02f0fb78e50d3fe8154f6edf757",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5ed127129dc4c36afc58464377ece25b0a8f3c16",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0xe5dff8d0d7f772406a6bd4a62a847b61bd9b841e",
        "swaps": 48,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0xe4604f5f8380a6c96c0dd4734638e12ca49bd1b0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0ca60238f931decd9ca035319ef402ad5a7c6435",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x32e228a6086c684f1391c0935cb34c296e0dd9cb",
        "swaps": 88,
        "distinct_swaps": 88
    },
    {
        "contract_address": "0x8975ddc1c651865af89b617e0aafd5be5a1b9076",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6eefa7f8136b5bfb260bdff148206668216d8a73",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x369138bd68ef108d667b803787e4edcc62e6bc4d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x15ef04c00733030aff1a6dc0c74e855589d0bb4a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4da977db0e667a19411ce939516bfe043d0bb456",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xba9c0286fd6d2535c5b3cca5353743a8bfe45241",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbc5f68921d98e516732d03362d6e1090461a9458",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x0fa764e106d2f7860437ffd682e4488bec7259a4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2c1817748e7da6cac7ca43216b82a2de025f5878",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xdd228fdc8a41a02bdea72060f53c1f88a2fd48b6",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x2d81b620073f17e92b740e793d17aa4dd8db2265",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x9cf34b76eea8ab750c4ae51f9f733f31d7294187",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x0035d21dc1d2cb95614019744486edcd42aac4d6",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x2fa26a969e8b77ef3195d1a3da6c9d80c44908c0",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x3ddce8aad75f318a8ee0414eb66e9f16698754e3",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xea056be5b4943c1071ffea7a4170eb12fbbae352",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x69a0165bf2bded181161f686bb3a1790da8426ab",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd2eeeedfcaf1457f7bc9cba28d5316f73bb83b49",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d88e57f8488ba073909b0abd939d9f4cb22fb9a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x453be4b5bd586d07db048a0931177355acf4d31f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x32340eb37cd354b24fd7a1ed654ae2dfd22805e7",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x233fd298aff87ac7d333ddd74a52ae175fa75768",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x681d3e674dbd2f4fd77b74d517b2dbcf2fe612e4",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xcfe3a5bb2c978858f2ce6f913d1dcd2e08ff4dc6",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xddf448ac8554ddd416f5c1940c6f097b7e0c7120",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x396f4a3f4c3277011cd45e4f7280d2edb73e20d3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4b4c614b9219397c02296f6f4e2351259840b3c7",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x7c1ad16996907c854dbcb5b145ceea06bff120c3",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xd3187917afd8d780f2e3fe1687552c4f4cfeba7f",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd84a040428c102ee6109e7f4236e2fb40135f1e8",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x7a744cc8999f260a38e3be3a25009cdb36652fcc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1b2d3498d9a6c45818122f835f10ab13413a3aa0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9f897324aaf3a6426165341ff1747688151e604c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x34ee5d9b55542764a535b16dc0b33f5415d1ddea",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0x85f5e5e0e93d1fcebb72aa5a5e449aa8cb9a1083",
        "swaps": 249,
        "distinct_swaps": 230
    },
    {
        "contract_address": "0xd6ab3f53b1d71837fc1d66b856eeba7b87157e50",
        "swaps": 165,
        "distinct_swaps": 165
    },
    {
        "contract_address": "0x634f9d9f8680349b518cb615017c105af46ccfd2",
        "swaps": 142,
        "distinct_swaps": 140
    },
    {
        "contract_address": "0xc8a4ec0fb62768a29db8398487fa07a2a0ce1ae8",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x7de874b542d4d7cd35eb28b08372dfa17d5e3a53",
        "swaps": 88,
        "distinct_swaps": 88
    },
    {
        "contract_address": "0x567587345779d8b51a9096d34070ab4b92670861",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xceb239036ff352ad814d6da5f7f934ebb29491a0",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x82c416d534f3f487fcddf4dd37fa5b6f27fec8bf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdc4391cc4f5254c851b4bedf532e6b0f953d376e",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x79b3302210fbc6cb67d7d9238398b02cc9f7ce78",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x57e38f857c0622c21aebc000509147343b5bf877",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x4b41fc6cd5200b87c65a21b6dec021c9f1bc48ba",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x80326fdde94b8cd924b7d615ac3a572615124e9c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x065d609ff57e8ce4ee5fbc3c040a442354e8a2e4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd4247f8aa893fe223f02ebfbf41476b8a2fbb522",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1ceda73c034218255f50ef8a2c282e6b4c301d60",
        "swaps": 223,
        "distinct_swaps": 223
    },
    {
        "contract_address": "0x9cf2d4266c8349c894cfd640f602e70eb74d41b4",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x328767469ff1d88f62ca26b18bc7d8c4de6e86a3",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x89d97d96fa57a83e285a5d1709fc5345c8e92d94",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x9d77c5cdf81b012dd2d7b90534d4c4f0cb1c7560",
        "swaps": 30,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x5dfc1721cef19ce2cef625f488d77fab86802fd5",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xeb4edb0a3802ffb6fa7f0a9635a112dcb1774b03",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xd4689694e9928564647ad483c075f271419b2a5f",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x2b63ca6fa39abe270da7acb6c7bdc5a65f8724c5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6071707db68349b1b474b4ba444fe7e512b7fb45",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2f52173148cf684cb36bfa0071b7e3421d69be81",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9aefc9e7faa3cbc32414491199d63b29e30b9e6b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3490268a42b1e6e35bb55a90ac831acbf4147522",
        "swaps": 159,
        "distinct_swaps": 159
    },
    {
        "contract_address": "0x1aeca28d0f816ae4e75fe35aefccdf1e23b3235c",
        "swaps": 69,
        "distinct_swaps": 69
    },
    {
        "contract_address": "0x3ddabae496c3e3cd0ebf6e53d10360c0969b71bd",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x8d230bc52ffeb77458e895766712d2103709e121",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2e99e72e96d813d94416897864fcde4330212407",
        "swaps": 17,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x839b2f0e5d2b6f97de460f962f756f80646e3f27",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9740a46b11b47010bcfb130cd61882feaa0f6e70",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xa1b5e9ec859feacccee12697a9b2655d10212c74",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x9179ca05f45dd00c066754759f32d7204099bdb6",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb9da6601d7e9aa4b09e99a2980fe498fa8d31a60",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x773b07aeba012a05bba9bba322eae117c3d33ebb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1006f4dd43e76e5b5351b91e3829189ffe68dc93",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0adf26e0eef260e57faea3dd2e90428098878a5c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x01ca94a8e0f05062d9d98b4d260a4a5544785217",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5f1858d2e0e23d36ed0e229372f158d27bf495ef",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdc9232e2df177d7a12fdff6ecbab114e2231198d",
        "swaps": 282,
        "distinct_swaps": 278
    },
    {
        "contract_address": "0x25bae75f6760ac30554cc62f9282307c3038c3a0",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0xc9b02b8d52e5d34bec0e0a3cacc0ba39480907fc",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0x162c9786c4878162801b600367e00c8fec5a3a56",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x103062f71b7106a8df6fd2a4dd9368358c44a9d0",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xa3515590babbe0fce9c10e0f4df91539a5f0036f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x669b2fe0e9b3147060e07f86942ffa5e4be869fc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xecc89c265abe55376e098a081c8144d4e407a82d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d86e3e1448783164d7cf8269c6dbdc6615b7797",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xf939863bb282b3e87f85218a0eda0745f0873d4e",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4d8cbab13640fe6196ffed5a19aee0d3e2c30a4d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9d4993e7ee94e09383809fbd9f24877cc00d5db5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xccc2f653df3a9abfdca4e53e19ba2d90564f32ae",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x72c3e5ff31e25c954f92f73b567fc8b1a84df31a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x171f13ba4ff986dd61ecee27fb6b47dbff36a862",
        "swaps": 7,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xfcb980cfd282027b7a0544802a03b8af63ee9cc4",
        "swaps": 65,
        "distinct_swaps": 65
    },
    {
        "contract_address": "0x65a931bc4a43cde5dce012e61b45ec1ca817c952",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x52cdca249e87781d1abbe4ec9739692c0b99b329",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xc1dd63ca154837ac4356d888f7c10fbbe442407e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x12b52dd6a2265d9ffa07a547f1fcacc5947827eb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf332c4a690608f4ecadd2c339ce365d8c4883dbf",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x0f75296c5a3dc37b37b7a83087e1b5c57da1e2be",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2e6a02e6f1f9a2e9ba1f4a6aceac3d42b0cb56eb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3398787dca0f1bd830713ec5294ade196a198984",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x00e288acf24e2db00f5569159f1007158a38a1fb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6011188dbd5250f4b1dfbfd795097f25f3963eee",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x8095d1fb36138fc492337a63c52d03764d12e771",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xdfa3ddd1807db8e4b4851d2e5421374e433a2983",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x8e5c5ae2542116b5715b12bb2d391a770a607075",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2686681d4bc35b7a5a993aea1d42f68b70f4cc2b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc9d6ccf1297fe13d956b4116926326f88b068e8a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbfc322915fa9bca3dc058592aad8147311942641",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2d21d44ede21df5130ae33989e820c1276513f70",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xea8272a56fb2398fb85ce882e6004b8caabca224",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x43afdff03953769d88df838825739d80e343e554",
        "swaps": 442,
        "distinct_swaps": 436
    },
    {
        "contract_address": "0x8168228faaa765532732555604e90441cd86687f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbeebd1aa9e953640c6ba750df8d8dd2e4a8053b1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x84d49beff6aecf52c461eae687d959d64edf2427",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xd4b829db6e1ea8e85e9f8e55185e0a52474a575a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa301f032a43ab35e5c07b84dc0386cc68fbf34b4",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf3fd4dd8bc006acd09b731b47a8d8fdc9877e653",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9848460dfa736752b39723f388158dbb13546f00",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8c1337758da4f5f9a97f5bb8035572bfbc9a1482",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb40ff17a34b6727f49ad8e17a521f1dfd8d04654",
        "swaps": 65,
        "distinct_swaps": 65
    },
    {
        "contract_address": "0xa629252b0e41111a0aa0112ae04cee4bceeae476",
        "swaps": 60,
        "distinct_swaps": 60
    },
    {
        "contract_address": "0x4642dafc5281ba5a8d35b2896e0d925b23c6883c",
        "swaps": 79,
        "distinct_swaps": 79
    },
    {
        "contract_address": "0x5d577d6cdc82d7b6cac7a101766b68f45bc3e34e",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0xaa425a55887cc054b8762f4a2950313746954ccc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x71e600fe09d1d8efcb018634ac3ee53f8380c94a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd6982e01d183b3a979c3294c2f48416458f0e19c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6815c440c5c8ad500e1ac6c301f8057b84753268",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xd8da9e594ee7dff6d807d60e105ccaee8c7c7737",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc4cde91a38d50d37c394a9726a6e2d9ef4007c03",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3b9e90486516f5a14994a94bd558f2843b3846a9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd206f68b753086920338088e5ed9b2ab7607f5aa",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xef71c201e0c1bad60f28cba77a31349fb9534e2f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d129a39e1c93b6ca2925831d86390af8b675c82",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x06afc56a8e09c6b601426da95ef8c81408deb5a5",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x3905a66397a603c4f8fc10405e75f3a82e0e64cd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4a3b009d4f55123dd132523bb48f2ba47e8dabd7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8d04201bd11b842bca1cd917bda66e351df5f448",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xcfbfc969638ca98c9edd570f4ae71038d9cf6ea8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa866f286b79941b72456cf05f04a22bff33a34d8",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x04edba974311112019d11d3880c359719e6d6102",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd085e8a83ce2a8a6ef8e7a52da994c84087c165f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdb5098cc000673afb6f4123cc06d58de1be225d4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x69926d1e7ba42da1bf07becb44fd5e58dfda86fb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5249b6693b8ab23e32dd4d7ff2210f147b77f056",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6a8e55f519f77e55c678cdff56e9d5acd03b248b",
        "swaps": 60,
        "distinct_swaps": 60
    },
    {
        "contract_address": "0x6fb2d3539828b77ad037ae4f45f27ff24ad9d9a0",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xf0696be85fa54f7a8c9f20aa98aa4409cd5c9d1b",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xc284a7549048245a941f425a4fe9746b174b0770",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xe513b0ce898299b2ecd094b700d7037d8309a4e4",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x12e7b8c88f9f0babb3907c46c6453c34a5ff838b",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x5db91debc4a56d28ef07639b621be2f903f40bfc",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x85ee8f07dd203786401066b36f6fa7bac505ecab",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xf8889c3b46b26153887de2e5b41331af60d156f1",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x8d0450871530a40bbb90e5692706b26c46a3a401",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8f680f80e66ad130236905679a3eb615ef4f212e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x94010dc3316eb3634a74439d46b112b83bc612ca",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2f56959ffb3cf3bdb494237eb7cbff427a6db30c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc34f686947df1e91e9709777cb70bc8a5584ce92",
        "swaps": 91,
        "distinct_swaps": 91
    },
    {
        "contract_address": "0x2922e104e1e81b5ea5f6ac7b895f040ba2be6a24",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x0639c76249f8d41e5b1b32aee236b24dca4c4057",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0xaca3c664453aaa69151876768bf317e25c7f989b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4c6e0ebca60a15612f3f420c4d7ef95ef47c93e3",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x75f44b732e12d556f4398c57de621845fbd33c97",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x422f43a620e795e139183947851fd914a11dd023",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc55b1a988b8f580516ee28fcbfdc04710ec1997e",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x6a531f87f234b867ac198de27bf2f4d7f9b0d680",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xa9c3e6354e9026f6324c6e0ce9a20d03dd468d16",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x6043ead7e3a32bf4a9e68b4889bd1649cf71ea8d",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x1d340d322886f96475aa39f5867d6b3fed574f7b",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x094d902c4a2c4ba8eabe10c5bfcb04930d5936f0",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x394f946d368d4d4d4a10f4bf8d87ff8ef3f3cc8c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1bc6d92de81bcf62b3ae693f81dd7691c995baa8",
        "swaps": 51,
        "distinct_swaps": 51
    },
    {
        "contract_address": "0xec6d33ea8a25e10d1095a32978499c66d72e4811",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6e01a7e55987bc195b54fbbdaaf40e57544b23c3",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x7360e69d4cd40a5b25283898740e098dfb9a6e16",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x56442260e102d201098b479f0a39324ec8510659",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xe53a79f3a587dd3505fecce63d5a44303d3e1c19",
        "swaps": 9,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x82c88952ed55d6f1590a134aade256c2396a00bb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4a880fc63521fa9fb416b433f3551245e2ca01a3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7736c061f651add44c3118b00ef9b14168a75fd9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2385b2be5b0005df8e23cf695a83b400b10e717e",
        "swaps": 581,
        "distinct_swaps": 568
    },
    {
        "contract_address": "0x2f745816763383e4fac923a5207eb0a9359b52c1",
        "swaps": 128,
        "distinct_swaps": 128
    },
    {
        "contract_address": "0x4db1087154cd5b33fa275a88b183619f1a6f6614",
        "swaps": 712,
        "distinct_swaps": 705
    },
    {
        "contract_address": "0xbc7de021cc17a0399bee6b9fe9531e78c10526a7",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2656c899af9382ccd30d79e54ad970b83e14260c",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x3482d6348874485ee6a24af144a6bc3cd33d37b1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3db9dcfd86e32ae8741026e798395d7b09d902dc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8929d3fea77398f64448c85015633c2d6472fb29",
        "swaps": 1684,
        "distinct_swaps": 1677
    },
    {
        "contract_address": "0xf69e93771f11aecd8e554aa165c3fe7fd811530c",
        "swaps": 854,
        "distinct_swaps": 822
    },
    {
        "contract_address": "0x447016eec356e01eb62854cb1058c4553f864cce",
        "swaps": 761,
        "distinct_swaps": 761
    },
    {
        "contract_address": "0x56ea2342232ce09bc204e5f7d3641df4303bbd8a",
        "swaps": 218,
        "distinct_swaps": 218
    },
    {
        "contract_address": "0x654812a5089524f32c5d934d43a70248ac493051",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3dc4a4b4fbd8e795099f04a47567a9ba4b4e38db",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd7e474d79de0e6c5b8e25d9bb2ca725eb37b80e4",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x7f2f223a851e8380473cebdbb14ca67d323e061d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x7aad0285cf5f62247738551cd640b8503c633e80",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xb625c5d5ee98d9fc8949cd096ec3335b288e2e9f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa8cda6ff9b741a848fc2c8036b4405e393777110",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x37af44875cec15c44f5a61dffa0d22deb2350e2a",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x92a8e122063816665b34feed1a768e26c759010c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8ade205aa68074d59a2b9e96b4e802a79eac9b27",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbbce6773705d8cda1dbdb9a046a4f1dffbe3cbc1",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x45195c0e49512df039bdb66f9b50b8d8a4e2ec48",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7ab48ed3c3e402b6dfdde35e4e2c0b69b70a5294",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xba8a6d86cd5577426ffbea6c40b7334650ff3900",
        "swaps": 162,
        "distinct_swaps": 162
    },
    {
        "contract_address": "0x9d22b9a5af1ad326d9d0bcab2c3eea3f93cb404e",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x2f9209ef6fa6c002bf6fc99124336e24f88b62d0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7e2ce68e76e94cb4c35b3ab66d03e66efd7641a7",
        "swaps": 85,
        "distinct_swaps": 83
    },
    {
        "contract_address": "0x5f5b3d5d48dbf5758a3191250be433de347af4e6",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x726d3a066e4fb249bf7eae39350b790fc8144607",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x253137ae855c8eb92bb21cae93f5f708a51428a0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xaa37a31755e36aab0c62dce390415ba8f6dbbdce",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0xb724e5c1aef93e972e2d4b43105521575f4ca855",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x3cd18d001a9152b3157a18c3cae7b7f4b7e1977b",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd13bb7742a639bcddd622565c0569d5f457d401c",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x0850f9bf21cdba7d2817fca8e5f9d3b96feff3dd",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x19f186e7e6e22d66cc21fe58c381e1e4a8230527",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x5c1403b6ec043a752a688b36c8f25e786f93c90c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3a849003c3e7432de7f85b258fb37d6dd168eb3b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x6f0f154edbc4468034f4b4fefec5b6c636dc4600",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8fd4be535c4beca15b6f0e8961d2ce1ad546ea8a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc2ae5ecb29f57528fd4a918f9c5b73c8c6409b86",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd88810f3fe698862669448dce29808b242b9a1bc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x809f7c69a7f24e0f74174c044770d5d5679722f3",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0xba78b8505d0431c6a1cde37d5934d4df17f975e7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xba9510b4fc0abf4f2002435c05e403a8ca00cca6",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x53e27dadf6473d062717be8807c453af212c7102",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x63ff765b55f953d1786a0ab877c8859708f04486",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xfb9523a90257f2ce2eea2b68ff7da1020784792a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x58c95aec7bf378634310f139a2d9187b0d2fa66d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7a81ab0f4fbfcd8cbfc8e96ec8cad5e1e0c67c97",
        "swaps": 192,
        "distinct_swaps": 190
    },
    {
        "contract_address": "0x0c17f6885d61556764f2ad692b2a440317f2ade3",
        "swaps": 102,
        "distinct_swaps": 102
    },
    {
        "contract_address": "0x020bbba5d7a7270f1ed36939198e55c5a7f88af1",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xe725d4fa61f55472827728f7c25e769969e5d4b8",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x91343ad5dd71632ffa50cd0b794dd30e8ba2e143",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x46eef19210b4c4549b08e2f79b61943c0d120f15",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x6d310371d82003551d25c0e9ee850ae68e07c97b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x284ec19a7697d23becea7a012fa6fb1f6d0616c7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbf79de8d42555256ff27fbb8baa9d1e311cc67a7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xef98d15cb6baa11f17e03d4e74d04d9ff9053a7b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x032d86f50ee9c0c361f268bd7c08013465e29968",
        "swaps": 4375,
        "distinct_swaps": 4375
    },
    {
        "contract_address": "0x76e0fe81c8b291bd28cbc3c59ebeba22c10b82ec",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x5b39aa8780b667bfdc8e0a7da3d2b4b82e5f69e1",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x336b812479ae126e2a3fbbd296dc0a465c092b96",
        "swaps": 14,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x2bc31315675cf51fbfa91fc0b881d76e042e65f7",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x64b14db5721ec3d380224a6b0fc423d8c5aeba97",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x227f800fcc1968a63d3a80a70ca050b8b3ba48c6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0d11818aae3d3de25d6e48ef6bb74e04c186aa62",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x79b1be10c6142ce02e50b95ba724062ff1f05835",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x63e6248de42c6d1e9dbe426de740ed987415bed7",
        "swaps": 51,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0x766e4f370677df1a43545f9876b9af835bb9efce",
        "swaps": 24,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x798800253e872c5175698091ed99b577553b07b1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x562322f8e7131d0bb9f487ae566935d3be96406b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x266e55a1bc3eb466ed126b27f24d423d79fcc2fc",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbae1638dc1bc5392d26b8fa03b34b59c6b65b352",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9ad5cdc89001a2eb0cc7713c788f843de881d803",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x048d1f80f1abef31b2bc9b69f7c5fe0792809bb0",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xb8d784a237c0822f870f7f474492ce9e22841d66",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xeafb977098e8f2f80222bfe8b578ca91e79f55bb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4e3ff257237f8aae760b1b705626235431f87997",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x5223b2f033dce7d9de567a260c915e37f7d300a7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x267720b5d8dcbdb847fc333ccc68cb284648b816",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x78c22af1fcd383cd38f629c21e1cedfe3c3d1b0b",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0xb556fed3b348634a9a010374c406824ae93f0cf8",
        "swaps": 147,
        "distinct_swaps": 141
    },
    {
        "contract_address": "0x46b7ee7846e9526be1d0cf5b88f98d1bb07ad454",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xe933d0cb22086186b0c31748828a4067167c00da",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x545a497b5a5bb7a8397ab6d1ed938492a2519229",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x371c84482708ab4a6cabe4400f8b82dc784635e4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc4093bcb6ab179342fe87eea413e77846ec679da",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5753128c81ddc7c1df89dbc557d33a42ea52457f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x733cc311ebae030ee877c9ea6eccfbf659c142aa",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfa073a2fa33085bab2a3d4345fd1eec7d46ee4bc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x932c25e4de9afb989e7ea3eddd3dd8ed6e55643e",
        "swaps": 113,
        "distinct_swaps": 113
    },
    {
        "contract_address": "0xd236ca19caa7f8ed19797a5fff7e89e256674904",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xedde5ea95faa7b38510e2af259d14a2319cf7712",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x12909209228cedad659a6e13d41f82a4d53ee8d1",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xe206a8cf617e64882667c29f1541617235e6050d",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xfccc85cf6fe78d1bbb1c5d6cee0008b6479160a4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0838a1b1295ef395ac91761adb5025c67f304816",
        "swaps": 31,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xae84338c62a61c5e6551272bd0c378d244deb4e5",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xfe4e86ad1e6ede8760d7609e7cc05271fdbc376b",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x7cd6e6d4e86af4d173aebfb96183c398af564cc6",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x8b4e46729fd43351c0f5ef383abfa7b63c9ca8a6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe6d3e74ff74fc1e8b84a90f827133553282b62d0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe81709c6246189276c542c668a231cfed670877b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0c8adf1b77fd9487884f6fa26f4ac019e1322e15",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7295304b10740ba8e037826787d3e9386fd99925",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e",
        "swaps": 2307,
        "distinct_swaps": 2296
    },
    {
        "contract_address": "0xc4576e2a3747d819ea06a0da1648a2fae8bc3083",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa8fb745919d959fbbdfab71b88e82bb4e6ba502e",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0x4391b72e683bed7f0a410ac5b9e3c7de0689f71a",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x83ff48de547bfa9b334d8b22846de5a6721a679f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x41be5bf3070366aeedfca869ccca2b3d96b9c396",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x7c8520b2ca2e479e65dde71e922c2abbf496ee75",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x181975b18d048d0c4432d15f7690e74139045163",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x18584b6473e6d32190b0a7c3291ac4955345ba9b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x336abf07d7cf7263ea718cb63c160d500bf8926a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd9284f192f5074f1e47681ea525c3a080eec8fce",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc3e1f70ad75c48e30d1710341f8e7f193322042d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x19fcfd016a5fa35286c1fbb3f96fe9b3ff44530e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc0f59e5b18e1463d73bd085eef45249c72aea4a0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xdc4248dfc9b53a622dca2c64be9af7460047d589",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcb86f5f58b62eb9f97cc0c6a2c216471e1363924",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x14dbe3e6814fd532ef87e4be9b4192c018752823",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd17cb0f162f133e339c0bbfc18c36c357e681d6b",
        "swaps": 734,
        "distinct_swaps": 734
    },
    {
        "contract_address": "0x25007f00a12f32b9ef3158875fcc03a094dd29dd",
        "swaps": 655,
        "distinct_swaps": 655
    },
    {
        "contract_address": "0x304e57c752e854e9a233ae82fcc42f7568b81180",
        "swaps": 1210,
        "distinct_swaps": 1201
    },
    {
        "contract_address": "0xecb4c0e089541e4938810f304debbd07e7562b21",
        "swaps": 194,
        "distinct_swaps": 192
    },
    {
        "contract_address": "0x75992e8266ab600d4e9b0d7471db6ba0d75b44b8",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xb0e69f24982791dd49e316313fd3a791020b8bf7",
        "swaps": 85,
        "distinct_swaps": 85
    },
    {
        "contract_address": "0x6f90b28c87b756560362d944cffcaabcedd2dd41",
        "swaps": 200,
        "distinct_swaps": 199
    },
    {
        "contract_address": "0x0aaf30e02688f17e4c9517dbd61b7aabee657dd3",
        "swaps": 41,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x1f3627fe74c08da410bc4cf0456dda647972cc19",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x6cdfbd1bf19b03959caf9a1c6c308c84e9944df0",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x56de3448c9ee1adcb05f26f5093b593d492695c8",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xe3014ff72a9a6ec43e0ac8e4e2b94f44486a40ec",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa0f330f5fc47ee7a3297dbd6be6fe60cd0346b26",
        "swaps": 203,
        "distinct_swaps": 203
    },
    {
        "contract_address": "0x4f3b8fd5617287d1073cd3275c3d040265624575",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xcac30d122e66cc07f13c1a2bc5803f6ba8a55a52",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xadb3ad31eb7ec5189e709de7242186a0f935f678",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x38fbdff275aa144ee76581c56f02bd254840e5e9",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x630144415f6a084ce89461cf4f53b9c6368270be",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xda5a2d1c048e58e2d1e6b55d840c2e2294caeec4",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x051fb3adab3a5244a3621f1d09edb467586a0e6d",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xea63830eac8fd7349bc62ed8b2a6b28a835182eb",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x8001f60a0c109f9e28186c7594d8b24f00e85f39",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb55316aeaeb4e5375236679e12fddff000065b5e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x864cfb8302ddc956b2b05f69b01c55b3a7b1b759",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7f7c12acec546cdceb028cc5b57f7aa2d91f0887",
        "swaps": 175,
        "distinct_swaps": 175
    },
    {
        "contract_address": "0x2177ccb01ec6a3a4d567e42d51f85a65e3ac5ab6",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xdeb5ba95cdb496199532909cbbfc2db99eb4378f",
        "swaps": 11,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x57f34a01fadb760a218343e36299ffa29cc9da62",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x836051a89124d0ec92d4d614e23915dc00898566",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x203c9145d7514188e99c7d532310c390b42310fe",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3a2fe73866bac2d28501e4e6149ef9057463c365",
        "swaps": 3,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x951c3d1eb282010057dff9ccacbdb6a74e1c95bb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x157fd56769a0c70c4b50c729894d232bc809ef4d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf25888828ef70960aaa8b73dcecf59116734a91e",
        "swaps": 100,
        "distinct_swaps": 100
    },
    {
        "contract_address": "0x587381961298a6019926329468f2db73c414cf68",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3f606456e46e7abf9e2d8503333fe703f9bb2375",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xbaba126658af2e2abe96a5e35fb9da6ef69bdf1c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2ddee40f6c1770fb228672f2df980a0d8607e375",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5b587ad0ddb1ee7d5ab4a7ad7cc2ea8feb149a68",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xf94a0694928719682860b6616f13f26c4d05aa4d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x7f18920f55fc7fa290007ffa795155c4a7b30ae8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x631f39d22430e889a3cfbea4fd73ed101059075f",
        "swaps": 228,
        "distinct_swaps": 228
    },
    {
        "contract_address": "0x2193c6abc8b83fd406353de7b7ca6e111b9b6348",
        "swaps": 110,
        "distinct_swaps": 109
    },
    {
        "contract_address": "0x264e6bc3f95633725658e4d9640f7f7d9100f6ac",
        "swaps": 652,
        "distinct_swaps": 597
    },
    {
        "contract_address": "0x27d92f2c9b9b44ab2c196027830fef5f52a1b995",
        "swaps": 85,
        "distinct_swaps": 85
    },
    {
        "contract_address": "0xd413957ab08111ef5ef2406d9f20fdff16f74297",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x3c443ca1c986258beb416cc35fae95060ac4ab13",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x7662229e67366a7f9f44a6a2230a5d03aa2e935a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d2263ff85e334c1f1d04c6262f6c2580335a93c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x425cbe1c7f3dda28ebdfcdab7f2fb8ceb0380ad5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd2aeaf9922c043732184010d2bba943b3ee4dbe9",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x82a54e66c05fcd555adae593848a4257c9e51ad9",
        "swaps": 1046,
        "distinct_swaps": 1046
    },
    {
        "contract_address": "0xdffe79ed576cae6030ffe588e4c53b22d3b9391a",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xc3b95848e80647f63bcc4aaf95e5b5b96e8ecb50",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x72c973f5c4d0702f0123ec655a7c50dbf8f7f019",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3e4424f28378152d3346b1230216bcb657ed6ed9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd501d2a457bbf6a2c09df0f4817fe37d37feb3eb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7600cc75fa9045986efe0bddee8e18621a8dd49e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5e457fa245fa276451b746ae03416fedf608b875",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb7315aca62905af913e636cf6e9040f05252148b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaef35d720c56ef3c259bccdb6931f331c7f15b3f",
        "swaps": 105,
        "distinct_swaps": 105
    },
    {
        "contract_address": "0xdf8139e9bebecadecf48bec8c8064ccefb618e2b",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x8654592dc347205b1024c1f9163712fa49acbcd7",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x73a041fef8271c619791e0af6a6224945b7a446f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc41efb34697eb859abf9e971de6b9695e3404b0b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd4e653612b8623401c0fec91aad577d67af11d94",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdb68c1089b51955e302f88cd97720daa8034d4b9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x769750f4ed2b4a1df83e9099d365ed36a12b358b",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x7cc6152e6bfed7a24bad1a8b897cfc3d6d7a64e9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfae493b88b7794057027b723845933d645dfadb4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3f25a4d97eb3c554c1e33b3f3e5901a287b1b744",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdd55d8b013e8dca41f7e32cb191245060c546099",
        "swaps": 75,
        "distinct_swaps": 75
    },
    {
        "contract_address": "0x2e7d6490526c7d7e2fdea5c6ec4b0d1b9f8b25b7",
        "swaps": 107,
        "distinct_swaps": 106
    },
    {
        "contract_address": "0x36df04d3304b73b816b5a8300fe51c2f5853fa1b",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x7f821d684158e133eb520f1af194ffa1900cd539",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7d99b5b3d346c91194b14cde47655cc3ea144dcb",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x366dc82d3bffd482cc405e58bab3288f2dd32c94",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xa78cd5b016a6c050663ebaabc4a8d3a81460b036",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x49cecfa5c62b3a97f58cad6b4acc7c74810e1dda",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x964ce4d45d986daef6103a9c616c913a40544817",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3c8efca041a4de1e3a4cfd1beed0af527337bcaf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9375df24fd34d7a82d4bcdff2b763f4bf05ca2ab",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0x03b67a0ce884e806673cc92e9a1c4a77d5bc770b",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x7ef9be18fff382d11fec6d0acb11da4e91d31f7c",
        "swaps": 1382,
        "distinct_swaps": 1382
    },
    {
        "contract_address": "0x1e67124681b402064cd0abe8ed1b5c79d2e02f64",
        "swaps": 162,
        "distinct_swaps": 161
    },
    {
        "contract_address": "0x4e56843592da70ce073ad6599b3fb3ce3bf02f3b",
        "swaps": 33,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x8df6f7da556b9e70e272434bdc581dbb4848dffc",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x07c6f1244d6507314af43c49322faaf4a5659fcd",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xcf3fd9e4285387296a9bc8d97230c7c458d2451e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb1dd5322be07fb2a40ae7fbbbac96781ca2b0602",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe1d38d73bfdb3bde747ddb176b0112a03f057246",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe90056b377cbbb477e3950505ccbd8d00b9cdc75",
        "swaps": 184,
        "distinct_swaps": 184
    },
    {
        "contract_address": "0x1e022a0040051bbd735663c2275a30ea0ac04495",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x24d462a1c33ada149b229a0a609df6e8b55ebb3b",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xc3b724fd566c451e7d1299621b824ee1f16377c5",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x627e302c459c055e9242a830b1fc8f62e3ce3757",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x92fac626fe193c00e13b553a7313057124cac65a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2d18f8b79c1703298b0dff74e3bccfda8a2e4711",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8e77380906692991888978626cf703a4635730be",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x4f21d2c37ade3eaa9827aee42f6d12155d83fbf9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x418f7f0f52388f414b8388181c270f3a820d2849",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x68ab4656736d48bb1de8661b9a323713104e24cf",
        "swaps": 312,
        "distinct_swaps": 312
    },
    {
        "contract_address": "0xa86e9bef477a0824159028c2e60aeebfaa2e60fa",
        "swaps": 104,
        "distinct_swaps": 104
    },
    {
        "contract_address": "0xf0e020a4675b4776a3bb22843494ce6b42ebfa0a",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0x4c03c9a862da703f2644d38f092b66e7b1742355",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbf1ac395731307e83cbf1901957ed0a4faa15a02",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x962ce6d7d552f46e770d94d8dbee100670d878f3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb3bbd8b15571266daba81c31f4b3ca581890df70",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x24ad14c25cc9a805fdf86bb12356c2e0d319b024",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0359001070cf696d5993e0697335157a6f7db289",
        "swaps": 188,
        "distinct_swaps": 177
    },
    {
        "contract_address": "0xa34ec05da1e4287fa351c74469189345990a3f0c",
        "swaps": 1519,
        "distinct_swaps": 1478
    },
    {
        "contract_address": "0x29689ab7fc5438c5039864339f2a4f28e25f1ae5",
        "swaps": 63,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x65752c54d9102bdfd69d351e1838a1be83c924c6",
        "swaps": 135,
        "distinct_swaps": 134
    },
    {
        "contract_address": "0x10e14e23686826915efcb23ed9b128750831bf4c",
        "swaps": 97,
        "distinct_swaps": 97
    },
    {
        "contract_address": "0x3de61fbfd17f6b4d51a7a5e19b0bcbafb1e56992",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xdb869dab270331c6fe2e690f3b6c93a077ed53d5",
        "swaps": 51,
        "distinct_swaps": 51
    },
    {
        "contract_address": "0xb443b53bfcdd96714cba31d662c53edc8d00e186",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x35c326041cd6953b3f20ede7d471426f081eb810",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x3f30fdf2bc38308fc7a4523c6da402ce89f16e02",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x83b8b65f0ab52c52ac84574290c04334b40aa1ca",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x81cb0cc047b973a138071e3b4bf8933a429b8d33",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc85e995a03401692e651d8d03eb4fb742ab3eeef",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x49f659949632ef5c5f0cef8ab17bbf02549591d0",
        "swaps": 339,
        "distinct_swaps": 313
    },
    {
        "contract_address": "0xede04e0cd393a076c49deb95d3686a52ccc49c71",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xbcc871ad1ce206b0a228c133c3fed98a7bc8c4da",
        "swaps": 117,
        "distinct_swaps": 116
    },
    {
        "contract_address": "0xe8654f2b0a038a01bc273a2a7b7c48a76c0e58c5",
        "swaps": 107,
        "distinct_swaps": 107
    },
    {
        "contract_address": "0xc51e9041c49bd7524edfaa9c2b7e0139575f4c31",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x5bf52d98ac3803ebda316e61fb43db6ea869c83f",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x1fef1ce437bb025c08609e0c14ab916622bd09f4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x16b277f0f9eab60b743e83dfce1757022246a414",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdca9d3379b05a7a008ce77167bd23d94154b6e8c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2d6027077de6b03acd5e99b841b30d040877aadf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3bff8725219504d31f544b55480ba00b0d4cb173",
        "swaps": 194,
        "distinct_swaps": 194
    },
    {
        "contract_address": "0xb786e08e78c12178aa13f699643e9dc3fa7ce230",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xfa776cb50b9fdbc604709c7b39265a62a4fce481",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xfb079009417fd337a6ff470fe980cdb11ff7f145",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x7de19d534c6ecc2f5e236349d36b7d5bb645bfef",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8a3f448f7cfad19581b9876d695554897ac334b9",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x5cc98a2f246e922e73c8648669026babfa4de68f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d8d8da69e0f40b15860512afa40826625ac4890",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x395a32dee341d69ac846d379d02e76aabba95060",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2be4d59697d532b9c3a09163aef62f34c0bce603",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1cca8a01d507cee6b1e8551742f8c2c51f436fba",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x56b8936a96cd5ee5c5837f385a19b4c2999fd74a",
        "swaps": 195,
        "distinct_swaps": 193
    },
    {
        "contract_address": "0xbd6c583724985042046b49d721d70b2e1e53f9df",
        "swaps": 23,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x3a5deb79dbe1636f69c42766268aa2e7346fa627",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x8330a1262d49d7b41a47b914f1d2eb20540c3b11",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x018438299d14e7946dc48d20c2a9e4b97dbee8db",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x005a7654990abf44d11a1c7a2946e8bdabbb6592",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8af511761c74af631258d8ee6096679ff4838cde",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5e58e0ced3a272caeb8ba00f4a4c2805df6be495",
        "swaps": 1555,
        "distinct_swaps": 1518
    },
    {
        "contract_address": "0xbb8d020de2b18efad343ac762273e8e998022842",
        "swaps": 835,
        "distinct_swaps": 826
    },
    {
        "contract_address": "0x4fa5d5143394e52eeb834e46f34449aa0c5b9507",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x3a1768691ca30ee9114f37bb8b4b6cf787025265",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xfd7447e44a1c58cce97c29e0041d7ee47bffa752",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x5a45f2403379df7e90449a37334515f1f2506d5c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xac36f05077fd747f5a2831e6ea8be42b1bb9e428",
        "swaps": 15,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd4d648a20bbadcbd98b3a692874ff0fad5da56e5",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xbf07644abbc646a7b784f879e90132f90cad674e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdaa4745705cdc72fdf274e5d75d0c22b109104d2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x423d2d4f02b239f341e1593606630d1f4d84ce5b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x20bf018fddba3b352f3d913fe1c81b846fe0f490",
        "swaps": 424,
        "distinct_swaps": 423
    },
    {
        "contract_address": "0x994099df72e8e07182a9575bcbf84ce20281503b",
        "swaps": 379,
        "distinct_swaps": 374
    },
    {
        "contract_address": "0x9f685a03120915a4cf4321807d895a05987916d2",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x2e7d9d93d19d90baf2f8bd256d15a94baaa0b443",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x9556c3c45333476e0d2466cfbbe8f001055bdc41",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x767f8bd67a5f133bddf3b285c5e2fd3d157a2cdc",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xce175f43522c949070366516a0fad5bf98a56e52",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf95762ff2acf16ce087b1419c557ab272da61d0c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xde84c8f0562eb56a5fc8f07819cef1faf9df3ebc",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x571fcd84e6eb3a2c80825bfec0830d2e9beb218e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x47e6f8011c0326e2bc2774f6e84b4ac43ba23119",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa528f222d336c8edf53603ecd7d1af1a034517a4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x43d0eaaf1eae61f491262d6b8c4a96e608798e4e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc247196054754e06b884dda49a935124c779a934",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb064e9b00d713496d54617c3ef6e659072b8339f",
        "swaps": 1110,
        "distinct_swaps": 1110
    },
    {
        "contract_address": "0x3977263a15566523459ebbea9a203a41161dacfe",
        "swaps": 25,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xb84a90e1cfc5e2dd9b17ddeee64cd95f81b35012",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x1fc4a2523349bd6df30000b923bb1acb3a27051f",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xbe935151ca21ffc5bd1ca692e670e37cdbf5b605",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf7f07072160eb53a71a9e0ca082dc02fe75ffa9f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x324d2194c6958f54c9ac86947f415fbf59e2cdcd",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x7b72870da19ffd973d7d3404446a03cec8f73b4a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb2edb5b02e8cc9590daa8c4b004a06d7ce71c543",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe3ae064907e9d49c7355504c25f8cae2e7831501",
        "swaps": 49,
        "distinct_swaps": 49
    },
    {
        "contract_address": "0xf6efcb97626a7fa0bf455ce3f808b36e18df634d",
        "swaps": 64,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x53d62e9fec7a6b1edd5960851c17762e87db33ee",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xd7ed09f5766b7fa19977ca547beb7caa7b3f1a12",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x095fc71521668d5bcc0fc3e3a9848e8911af21d9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6c31f09d66766d6c91ef4d31bf31faece500f8ef",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0dd3bc0899a5e3cc17100530774bb5e8f0492f29",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x160532d2536175d65c03b97b0630a9802c274dad",
        "swaps": 249,
        "distinct_swaps": 240
    },
    {
        "contract_address": "0x383be588327216586e131e63592a2dc976a16655",
        "swaps": 68,
        "distinct_swaps": 68
    },
    {
        "contract_address": "0x23250ee43d684278bd5e869a6a4a7682e5c7ad2a",
        "swaps": 98,
        "distinct_swaps": 98
    },
    {
        "contract_address": "0x4d96bafddd87551001b78c493b6508d3c34e58a3",
        "swaps": 18,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x5f803c9fd476365c838048248822823b5ddd65ca",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8f81248e1306081448904fe9857dd6696a521a4b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9e1292bdb3053abac0ec9e574b660bd7d780be2e",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x60e9e75e66db9a57732394f834c912ddc6d78cdf",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0xefbe61cd97ed5419e435da5c6b14d0c982653826",
        "swaps": 101,
        "distinct_swaps": 101
    },
    {
        "contract_address": "0x771fe4d403b1c0fc4c95884d8b0f15f7233910ee",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x92928272c2d5e6230350b1d9791edcf9263644d0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x08a945b6de91a7d0e242e55484a99a4a5f3810a8",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x4051d3bdc7843fa9d1a217ba66a9d62271d7e7b0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xad7cfc896e685bff3dbc0f25e2df3f7219962678",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7e2eaa9514c7a56b4d556ff0d1009cb9c7f2b89d",
        "swaps": 359,
        "distinct_swaps": 359
    },
    {
        "contract_address": "0xe55cb144e02cffb6fbd65d9a4bd62378998bc267",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x01ebd3e57f4af47b7e96240e2b7b2227c902614a",
        "swaps": 473,
        "distinct_swaps": 466
    },
    {
        "contract_address": "0x7ba331a8b360f4c31e6014abdd6852f92fb21557",
        "swaps": 24,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xc6ffd93e2cc2a221dc466bd78385117dda4fd7d7",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa631cbf12af93a84738fb4f6c612219d19a53975",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd443ef0e331e3c6488d53e180e53fdbe6414eedf",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc8151b4f073f5828d088334995536728b5a4957c",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd72a0667aa4eaa5bd57a5b8db0d9cd302d86ee41",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0xe571cbb3a4fed59885c8be8c34ccde4eb5c68761",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x809534fbeaa323c656e48572a211f8e5f411a300",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6bf74766cb2bbe6d4f12fd0ef5b7cabc10177748",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x975866c8322c8ff47ca9961ad7f2a97177e300dc",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2a7b0b31f91af2715168e02c3c000b4571c04aff",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8b0630cb57d8e63444e97c19a2e82bb1988399e2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5c4b37dbb6cf29f1b432114e104ba4e4a6c27ce9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0f45bd7bbec6ee9794c49372cb8bad3205b32576",
        "swaps": 26,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xaed3f8c48c15eef9581892c2f18b9cc3aa7848f1",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4e1868dc8d125153bf507cb1933bd1754a4c7bda",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x88f46d357c65c091d3e3b17f5ad2929a6134338a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x18eccc07347fd85df7f879f576795711abd4d43e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x609602abe648b1c81e4444c7ca9ffe90d89c7b77",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x689335d4100d5b149efe7d69563b92f1bc32576c",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x6389691b3be5cfc3bea3451f4a199f1a6027a42b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd6d1188e8bff9ed534b4f7e3af5fac3a79930803",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf1f7909d1e9ddbae1aacea422d2ab11dcbcb05cd",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8ddd0a4246e2c19341d34839e7d45e3739bfc8eb",
        "swaps": 652,
        "distinct_swaps": 652
    },
    {
        "contract_address": "0xa87f12a6fce37966432b16fdf54dc1de33305b40",
        "swaps": 112,
        "distinct_swaps": 112
    },
    {
        "contract_address": "0x1a317c64fa48ee330e8abe0ad6dce3a83ad6648d",
        "swaps": 147,
        "distinct_swaps": 146
    },
    {
        "contract_address": "0x7618bfe5370859848ba26243b7beb1cc163a484a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xb843e0ca9dd961ca27df331f1e7fbdae308415f9",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0xfcbf0623bcc79cf5adab4075dc815af00c2d2c5c",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0x29596afe78f9990c54ef737e148a8d0525ca611a",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xcda2abb19db926d242f871c87b81575dff7644f2",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x77ed9e1d57e354feb373d3f6177f949eb2baba7e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb6d9a4649c579b8768f1cb55e9dd6ba99581e4a9",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x4a889003651d513de9de823a429a84b0e0fcdcca",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x20945ac0eb02aed8bbf405cf6b0e56655841e447",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x2651d7b53baf1925d28a3b5a3ef371274e630c4c",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xb493ec489b6a459bfe0959e2b00b59be8ab9bd07",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xae414fd41e6570112709cf8dfd8a434dba82c4ff",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb082cfeb44d315f7915a7920408d0b076c5c8ed8",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9665654f5131e4eb380e55e17bed625d94c12a46",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x350d4253f1616d1bfe86611db6623c83387de2e6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x597a9bc3b24c2a578ccb3aa2c2c62c39427c6a49",
        "swaps": 273,
        "distinct_swaps": 273
    },
    {
        "contract_address": "0x70294d7aa244bd342c536f9b502152564057162e",
        "swaps": 378,
        "distinct_swaps": 378
    },
    {
        "contract_address": "0xd928ce1d0f2642e44615768761c0f00c23e0d588",
        "swaps": 93,
        "distinct_swaps": 93
    },
    {
        "contract_address": "0xf8cec010d18ea784bf63f8a6521afb589f93d05f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xcba9d57e29ab4eeb9aa69cd82f93b64505055a3b",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x71ccf81b24d500705d54cc8b6d420b1131a9e5e5",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xc78d5a7ad095018befa3a7f70cb144363d80b2a0",
        "swaps": 933,
        "distinct_swaps": 933
    },
    {
        "contract_address": "0x290a4793b4e972188482b8046e7ea2ea5d3fdbaf",
        "swaps": 277,
        "distinct_swaps": 276
    },
    {
        "contract_address": "0xc7080deb5d75d528ba36eb3bec0b4c27797752fa",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x8b2bc5cc1be7bd8342d8975c8d63993c58310b82",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x75d4877fe9e2b16b744832c8d91ce15fd0df294e",
        "swaps": 50,
        "distinct_swaps": 50
    },
    {
        "contract_address": "0xc2d6614b754866730b12a1506d112398094f27cb",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xc6fcf1dcd41d123234fa6a2b884406a63ce54c32",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1534d7c91bd77eb447acb7fb92ea042b918f58bb",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x45f1fdf08cc876afac4465362eb138fcf69075ae",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa19460a60cb48d8c5aaa10b874f7a908e0483ea5",
        "swaps": 7,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x0e77f1e0a697853bb9b814f3cad9537f87a5da29",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xcf8f29163209f64618a193a4dcc546ce6afa24c8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4f0135b0b4892d7f60206b336985f8014701fc01",
        "swaps": 37,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x4d7956b3dbbccbfa5e6877bdc0cad2c6cadc5f68",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xcccec4a90b3435065f5e1fec6346be9da1b7b5ed",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x844b78b8bdd94154b1118ae2c90624d87999c23e",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xadcb09fd3346c72c98753e518397b336333cf227",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x7cf36fbe73e7a89b9df734d8698bd2aa6fe60918",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x0bfb88ca1ec456b671caf804ffd4a3517e3673e8",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x644de077c87e7e15bdedc541123108cb31722c21",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x6eacff0ba5a4ca7d2bf60d37b6302338c1996b37",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xb67feea7aa780630872e3f26a21bf76d83ce7ef7",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x66ff795535cf162d29f6b15ed546a3e148eff0fb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8d90928d7b7ba9aa9ca29b9c4b61b311db5a83c9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb925fb8d1c9a57bee1c0987631c121370cee3660",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x94aa4ca7796857a303c70a053af3ba4fe8fd5924",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe66f274542fb624f5489ebb9f6e953e91a9908d1",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x1a5feba5d5846b3b840312bd04d76ddaa6220170",
        "swaps": 168,
        "distinct_swaps": 156
    },
    {
        "contract_address": "0xbdd5e7d186ec062cc46c0fb52a48f52827baf941",
        "swaps": 330,
        "distinct_swaps": 330
    },
    {
        "contract_address": "0xf5e31f3c652983430714f08389e3165e8d26b166",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0x7348e171621bcd3d906d5aff54a91104fe7febda",
        "swaps": 35,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xb8c3d5fc01718095d5494a42fb8bbb47f516e28d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xefc4532daccd44ab1d20690162073ea1478fe34f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3ef3a87d745fabcac255e9352ea402d20f922c1c",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x5f5abc1e80748f98eb22f9aef4ca6eab49b63bb1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4ab66a7138f50db9b7adaf8ce8afb3f638b22f7f",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x84b6767109c15ab20edc6d084699ca8a450ade78",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x66998e89e011ab3dd70086b0f44e2d2c8628bb3d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x32eb817d549d348a2ba1cf39ee19bda7b5da77c4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x82404e05857e83ba35faa99824245cdf641845e3",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x94f3cc628a30fee244056d7e3fc29cf72e9df873",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xbe5e909e758bdad9531ad903b7bd90758664f6a4",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x5b13b583d4317ab15186ed660a1e4c65c10da659",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x5976e166fcceec2c071a048b556822ae19b01f6b",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x495b7a0610fe3e9cc11a031de466e8475a27375e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x52c0c2a6df97d92c89e6697863593bd65222ce26",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd58190075d5c32567940a766fdc7bf5e95679df5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1ef09baf09f1df0e9789918a85f8e233df58fec4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d204a693ade685e0e5e8ba797fb6d8662d59faa",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa5bf14bb945297447fe96f6cd1b31b40d31175cb",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0xddd9e275729d27d7a8ca2b75531ed5549c97e9cc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfc75c54d41c213d32262961c4b31f27b7b234c62",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb0b5e3bd18eb1e316bcd0bba876570b3c1779c55",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x1b9c6d8b372c410426cf803fd20a815aa7b454c2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4fd2c690a1d5b67395652e18cd099a1508ddd5bf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x426a56f6923c2b8a488407fc1b38007317ecafb1",
        "swaps": 100,
        "distinct_swaps": 100
    },
    {
        "contract_address": "0x66aa91292881f93d4101417964e497b055bc120e",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xffc654a0d0f740748d9d4d0061c96c284c3cdf88",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x9e20a8d3501bf96eda8e69b96dd84840058a1cb0",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x12f6fc0ebb55137d8c3af8738097a7ee0cca759b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb51f546a5ed369f2a3fdf175b74e385dea67ccf6",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x43b2e41bb9b2ca91c2c1c9865c6bd36f2295d891",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbde62f5199eadb94e836caa4167c08412ab0017d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x907b6202dcee1ae5d3a9ccd929f736e5857a94be",
        "swaps": 307,
        "distinct_swaps": 306
    },
    {
        "contract_address": "0xce621ce85eabc6dd95088b81cab683dfb4628864",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xb1ff609d3341fe5a822faae973b8c5a227d8889e",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xf8f666d5cce4db0f8a82a5cbbe4b40b39d4d985b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7a7af72eb649bf4ce277d969dbce38f1a46f4734",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x16ca7dfee3eae0b3618fca18fc87b87380842875",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3c66fdbce3c642da06980a59b7ca1f8fa088d8f2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa651ef83fa6a90e76206de4e79a5c69f80994556",
        "swaps": 182,
        "distinct_swaps": 182
    },
    {
        "contract_address": "0xde990994309bc08e57aca82b1a19170ad84323e8",
        "swaps": 220,
        "distinct_swaps": 204
    },
    {
        "contract_address": "0xf4f78fda908563331360b331130342867f74eb21",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x3a1220e2c867325185ce768414c0f4cc3991e0b8",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x82ad43a1bf72733a49f28e691cd3cfe97ea22f25",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xefaec3b8df10b8b3dc111d781ce974f156a22914",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xadee60251d97f504f91b958da439e7e826b978d0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2b8a6d10d9d42f18afee6c970d0af8e692e5871e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc79fd400f59ffd6f36071735349f70858ebfdf7f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2145742d132dc2aaa7990be05c18022ee51ecc37",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x52f061ec0cb85f2570a5a9ab511e8f86ef454300",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0x30e45059c8f62693bc9ad73c617af2226a160b8e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x4201518a097ac1ec19e74f36835b9f97a038f495",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf5831d326b386d6b2a7470284853ffca9790b417",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xaa5dc569b0788938fb4f9f74bcda005755a285c2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8fe0c796d1b9e98958cd3ba10bad059933ae1e34",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xf063a6418b517a31c49c3b5972de15b1c2714bad",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x464d14006c890235d0e3e38fd959b6f539f040f7",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x56bbe587a3a96d0e90533d391d7f93092fb73c6d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4deb2d750b790f2a1a81ed51d9694675ae8628b8",
        "swaps": 401,
        "distinct_swaps": 398
    },
    {
        "contract_address": "0xd9a41b76b32f37b1a955982e13b22d3bb6cf7569",
        "swaps": 140,
        "distinct_swaps": 140
    },
    {
        "contract_address": "0x374552804f7ca26c307c8d31f4cc0d9215c87f46",
        "swaps": 280,
        "distinct_swaps": 280
    },
    {
        "contract_address": "0x85810cc42d5bbd3ec50af9be24d359e822eefd55",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0xd5df2d35b291290509927ef17b58d3d0f9c81938",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x91bffc2fad27d812ecc4aa999a96ad1e88572dd1",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x5bdda306c37179b34e8b8f6d75ac8192f8a42996",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf447183f30519214910adec5dfaed71f75282723",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x86fd28f9e3edea88965edbef5dde0ea6e3ece530",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x5786b267d35f9d011c4750e0b0ba584e1fdbead1",
        "swaps": 1116,
        "distinct_swaps": 1097
    },
    {
        "contract_address": "0xcb3716006b3b468624b2a246505ec0d22673e077",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x522ce6480f7ad5d903e82a07b2ebceba864ada2e",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf74dd7b21082b7d419fbfee0a1175c6e3ab8a56a",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x8f4f6fa56d78afed08fbafc3361e0b7afba5f640",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe82b0745ec3296c9934fb2f9cb7edd1bd57636db",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xcb2d86392bc5f12feb4c0413aa8d57ba151a7a25",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8cbd92bd3a7ab96c9c77534b4fe44c85a0afcaf6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2348f27811ef01e24cf107066b535f626c28c393",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x44bf909ad42969dfd5b595ff062c4f275ae8f801",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x179aa7462b5ddbb096352639b604efdd082ba930",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x4ba1ab4a35912ab7eb1562964b72314b2c1605e6",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x108d422cf9c9fe7dc9d9c119bdfc325777c45f0f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x5ee9ce3ff55e12f6699bfa407f4f4dedfb25f4bb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0ca257a6cae5c89826daae3be0a64170e34493c5",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xe57dca922dd0af6f47125e5eefc157a40caf52ca",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x75d63764295bfe088ce1685e971faa39bbc8cda1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1ea7163567885f76fabf11a8e5b2292db48d3e95",
        "swaps": 64,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x39eaa90a70e8fdc04e1f63db04e1c62c9ace0641",
        "swaps": 65,
        "distinct_swaps": 65
    },
    {
        "contract_address": "0x27ce41b9eeb94cc122ef3b5e409b2900d3e0a629",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x222c0afd1e55edbe640b58fe3cf12963b5e66d6d",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0x982c1f90381e31e7b7dbba8708126532b7cb7df6",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x406e9a7e99f0ee22599f922ad9241a5dc69c697f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4faa4b4f1257762e2c33fd39bcb0961c8d5583b1",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x74b9c3bf155a4f4d5925f99057eb4215b536e377",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x1237fea0b26f68191d50900bffd85e142697c423",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x76abb14d5967196988cc6cd88f9df88ce54db3a3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc109c6369eca80be90a0d50b297826e6e0cce108",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x93b50071e42716cf8bee66ba878619271944f6f4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x59be8033cc556e62e8cb836599cb764e8b05a5b5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf35402b4d896735309629e26eebdbeb9d2843d46",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x076d30b6a8f60b6b7abbf82556e1aafee83d1310",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf1ca944176818df97547bc11b8326ca4789cf5bb",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x51f41cf017eda142bec04997cd4e58de2bb28438",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x3ac83c088c69926cbd2a3fbb652bfb04cf1f2c9b",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xf3180ba9800f862df8edc962ec1fdd56e62b6b98",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd7217619279f31da063d738cf1bf7435764a07d9",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x7190041a6131cb12f113c7f3903a988366e99d0b",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xfdf8dcd97100a0a5cc36d6b4de12fb90517240b8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7b3dd6dbe672425574519511a85955a3bc25f79b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x3fdbe554066e27c95a7edf54e64acdb203054b7a",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x8f1dbed8545d743ccf752ff1805142778928c835",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd3af04d7c976083c1288759d0a91a4573922232c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8164e70a2532afc8ff766c9fb846adca2de53ace",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcddf91a44c579765227722da371136a4f12dc81b",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x0bbafa51e13829c9e96aa84b158f51fc80b276e2",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x0f53a48ac4b1da4550ec0888f77183421918fd09",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xe1f1db835bcebeb459e35f4f830c76473899d61d",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xeb951f0da8148a0a3fad7a568194ff9495fc464b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0442072cbc1cfec79f8d20d3d815b25fd086da85",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xd534a6b00e45bde6f5fdd7f940491c998743329e",
        "swaps": 121,
        "distinct_swaps": 121
    },
    {
        "contract_address": "0x5895d5dce7e898a0d2d9cbe3967f5849865f11fc",
        "swaps": 148,
        "distinct_swaps": 148
    },
    {
        "contract_address": "0xaa49d5f29cf6ac7411cd1ba9b224b298a3753ef2",
        "swaps": 171,
        "distinct_swaps": 56
    },
    {
        "contract_address": "0xac2a16e6e6bb4dba0f702e2d966e379d66e3c379",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x9e38459fb487768724259da07e123156fec6aaf2",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xe63943a376899de9accb4352ed7678ae1c02efc8",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xd7f243abaad742057caf134d8c3d87b35be6f0c0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcc8c6ca135cf59ed0f0ddd28b0ae1b350020742d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa5d3c10e70e461ccaa9370f072dc320ab036b07c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa38befbe0268f4167079ffb9daf2f47a6665082a",
        "swaps": 73,
        "distinct_swaps": 71
    },
    {
        "contract_address": "0x4ef715bd838546a967a60e004b52b00407f3b59b",
        "swaps": 239,
        "distinct_swaps": 238
    },
    {
        "contract_address": "0x67a0862612bde935ea03a2832712d9450f41ee55",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0xd3a10e1733a8ea63e02bbcdbe6fa2f6daf0ba54e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd0c585a5db3b18925a1527ef1d8ce901ec7ec9e3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x763069ba149831dcce2de7b58bb62ad6198c00a8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc43eff51abcfc42587f8347e94d476a921495328",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5dabec7037ed5c00fbde38e52c9859ac21cf95ac",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x407ad7715894ef949f38fff31e442bef18112c45",
        "swaps": 341,
        "distinct_swaps": 341
    },
    {
        "contract_address": "0xf3eb2f17eafbf35e92c965a954c6e7693187057d",
        "swaps": 1009,
        "distinct_swaps": 1007
    },
    {
        "contract_address": "0x20d4c6f341a7c87b1944d456d8674849ca1001ae",
        "swaps": 213,
        "distinct_swaps": 210
    },
    {
        "contract_address": "0xf07f13827baa6e9ff8e451d82985be9f7464b5b6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5d9ac8993b714df01d079d1b5b0b592e579ca099",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xd410e0d67f852f23b7056a40fd41c34c9aa7e644",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8ffb785e5e5f4e3a4b7c0360f62ff14818ce4d6f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb965c131f1c48d89b1760860b782d2acdf87273b",
        "swaps": 500,
        "distinct_swaps": 493
    },
    {
        "contract_address": "0xe3356e3064ffb87cef50b1a90dfe475becde1141",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x54e256dc87073de6e519b52a9a6bb5cedd881203",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xf85ca32c434e1031e0e9da1d2580b82e8ac14f6b",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x21ef14b5580a852477ef31e7ea9373485bf50377",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x1adb57769b5e5d88675b9c40c5b938742336a74f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdbe3ebacf6274ac15cbdaf1a1ef57d61220b760f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x89470e8d8bb8655a94678d801e0089c4646f5e84",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0xf7135272a5584eb116f5a77425118a8b4a2ddfdb",
        "swaps": 95,
        "distinct_swaps": 93
    },
    {
        "contract_address": "0xd70184a3f355537744fb2ea40f283f0c6d44ce47",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x37d4a87046091ab3a243e1138b2438561490d309",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xfe4735fb07aa69663d92da9f105ebb574b182c53",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x854f987f5a8c8797fe483eb0c2a06a1e6a05eab6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xfd85446bea250331e6e90f867de0f624175c81e9",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x9521f37f0412a034f92b9646188423fa51442ef5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x57a3a18b898bfeddaf88c60c09a081d9fd78f340",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf703847bebe16fc857cae61b8da8d6f9eb1cb443",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x758fb0585bc7746d33955a7216ad9c77ca05523a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0097b12aa9e25b127dab6dcad6f62b2af87e2f95",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0xf25c7db4539ad32ae12b890bd69817e9a64a45b8",
        "swaps": 396,
        "distinct_swaps": 386
    },
    {
        "contract_address": "0xa341af5b94ee3c579667075b8b6091023611e9c2",
        "swaps": 151,
        "distinct_swaps": 151
    },
    {
        "contract_address": "0x419d12435d6c7798b7684b2a7766d1f4cc21b825",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc58801771dbada5464305fe4806f23e836c48fdd",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc8174d091c288ff78de98303c2973140cbcf3b23",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7189aacc5cf6f74e87b31920dc05f2ebd6840018",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4f0fc2804ceb64da204e0527abd24c02d5dc8d05",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9c21e72fc2e3f256a766047dfce6d1775d4431d9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc84f479bf220e38ba3bd0262049bad47aaa673ee",
        "swaps": 880,
        "distinct_swaps": 880
    },
    {
        "contract_address": "0x03042572a59ac440a88209729a3ce1041edc7b05",
        "swaps": 92,
        "distinct_swaps": 92
    },
    {
        "contract_address": "0x7954006f16b4e6c7cb4073bc1d382cd3d32ce4c5",
        "swaps": 154,
        "distinct_swaps": 152
    },
    {
        "contract_address": "0x5de6a3cca10d3f788eedbd4923e31d4658bf6f9a",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x7c74e20ebf1b876ef2bc91f2d32ea545e2739290",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0x917273fbf265146201610fdc8c05b3c736f91f6a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x87333b18bdd1d5feae594559394cc54af11054a1",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x68c1a2b2802127bf56fef5c8c1fce77ef8b107d5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdd45312012ca27d488ba5d195d85a87ebf73352e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xaad4e3040bda892801351a499527a32856dcb239",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x477d11cf808eec1f110f58d343cd7ad28ea412f7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0abe99a6e281ff152c7cbbbfb7c2c4c0fa2ad467",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x429b932fab6f85aa41abdf65c0095c910d3a65dd",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xab1403de66519b898b38028357b74df394a54a37",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6be10c5c7178af8c49997d07d6a5444c15e58170",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xa54bcef2c7dea9df4ef3bf4baafa966e9311e7b3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x87acd3d73bc4d56e5a4fb36071de929a4571cda0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf8f3ee43ffff1325632a87e1c631abf7cf04af9b",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x070e37bdc2318983f4acc11ec8866c8cc5b2818a",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xf91524b6bff9201775e52b6feacb36ef5eb20e5d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x07cb6163f9a4290f2f6114fbb0223ac1b9bbce15",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x834150ebea03dafa1c7fb9c6e9dc5432daf1a53f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd21d11ab4266b5faa5781f74d3b9cb1aab202fab",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x273c39ebd4e0c49f8cc6e5a2b3c0e4ca355b5352",
        "swaps": 71,
        "distinct_swaps": 71
    },
    {
        "contract_address": "0x56408833c326c9350fa6d6eab70d41bab81b9037",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x19568b45aea4e7ab61ccfbe096efe79f3ca1b659",
        "swaps": 84,
        "distinct_swaps": 72
    },
    {
        "contract_address": "0x67508e590e1cda1b239b9b4847ac5544b0f32fe4",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x471e05a18919f1c98d85e8799aa2cb5eb686c842",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x67366f4f1b3ce7b87d00136df0fcea10109c2e53",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x89ee60400cb7ebc351a31ff3f5216147ae51e133",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x218e468b15469228f35b0e7f88425cd45fb982bd",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xdcb8b99e97e8f8536854aef67535e95843aa9bf5",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2981559677d8623f35ce87e3e189d9272d41edfe",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xe1d9a8305c33454ab76659b19ecdd69203118dbd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x550f4d9377892ac459e8aa51e04bde0cf213074e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9a54df69b65a6543f4ac421e36be5e22ba0d7541",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd0b4a463d73ad774f7e11f6b838ad2246e11a253",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4cd730c1b6714c4d23285b8d368f1da9c0dfda12",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xaef2b47b5e30661c3cc03b3e17fd8dcddc1f27b6",
        "swaps": 314,
        "distinct_swaps": 303
    },
    {
        "contract_address": "0xeefe518d89a49328580480fa3d90073bda074d32",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0xd1bfab43bc121521e385724b8ea756a1b1141d34",
        "swaps": 97,
        "distinct_swaps": 97
    },
    {
        "contract_address": "0xc432de45e90ed1aba40d89b932f3750281ffede8",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xd33519986a955cc6071c6506fb82e9a798b9872e",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xb96cc70666d328a68dbd5fc2dd7c0fb2f871bf0a",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x169c34ef66edfca0163dde597106cc67fad93e7f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7579fb88f46adc9ad97d51c3b22e8dcdb6f68a57",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4d4365bf7cae0a376a3e33920e98827a215ad83e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xbcdf529aefb71797cf2e7fb4792f5e11233ec313",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x702d22f5c5f853472a9ce4526c27107618e3a2d5",
        "swaps": 650,
        "distinct_swaps": 513
    },
    {
        "contract_address": "0x6fa867bbfdd025780a8cfe988475220aff51fb8b",
        "swaps": 579,
        "distinct_swaps": 537
    },
    {
        "contract_address": "0xe62ec2e799305e0d367b0cc3ee2cda135bf89816",
        "swaps": 196,
        "distinct_swaps": 196
    },
    {
        "contract_address": "0xfe0380ea030ec1d538b84265fd5eb6c8dd57f980",
        "swaps": 74,
        "distinct_swaps": 74
    },
    {
        "contract_address": "0x8de4e271042cee5ce6b16a2cabb0d9a73b444d92",
        "swaps": 73,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0xdc2d6a362ddd6dd08192f3fc20dc6fb7d18f1de1",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xc16e382aa7353aad0f598856afd9a93513542970",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x5189df751b1c6b630324b114eed6083ca238bc50",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1c77f417b00c2bf4fde611e05721780085e0504c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcda0c838094e403588b2b6981fe914b29612b66c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3a0e28cb72556562daffd9d5c3b7e45bafb7968d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc5fb609d8ae6e4deb4be844afb6df86874b49d9d",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x8c1b40ea78081b70f661c3286c74e71b4602c9c0",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x02572ca9142d7448e1fbe44978dada8f5ffa14f8",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x7fae0648684ec375176e2d0f171ca9814798d920",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x3b4f1a04fb1a171ef136d742cf4a77b5bb7e28c1",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x354789e7bbac6e3d3143a0457324cd80bd0be050",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0xd1f43b27e8a5336bf13bfea5816e498c9f515964",
        "swaps": 87,
        "distinct_swaps": 87
    },
    {
        "contract_address": "0x561ed3fbeac3c4e5b060024666f9a1cd2aec7847",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xdf401ad81944e68188334966f944a3b0c05cc3f3",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x1d5b5b99603453339b6f4353974d9d2fe1ec3a6d",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x3e4b2a244d0c632d2ac847b75e3bffe3d6727c40",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x8f850c4e61622a50d7eade603f46faf54d37db8f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf1c97b5d031f09f64580fe79fe30110a8c971bf9",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x18f4729df0fbf07df748f45a548c00b7e2d25bba",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaed9fa40ddda3c9802eb5cae34a401ea30bfd148",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x03f0e10035ae8d92926bcbc042abe703299e6bf4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbded75e911418ae4ecb117724b4b88458e3de88b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc3379226aeef21464d05676305dad1261d6f3fac",
        "swaps": 471,
        "distinct_swaps": 471
    },
    {
        "contract_address": "0xeb8ef7926d9cd80aeca1f240901e76ffa33b4adf",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x2a574629ca405fa43a8f21faa64ff73dd320f45b",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x2b9895b8c2d2fbca65b4a5b0935b522d7079098a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x6ab291a9bb3c20f0017f2e93a6d1196842d09bf4",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x9a079a5c684a364dc0d4d3849df6df408356b5e2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf1331019a14f69b5e4398b86d24b777209a46592",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaddc9c73f3cbad4e647eaff691715898825ac20c",
        "swaps": 234,
        "distinct_swaps": 234
    },
    {
        "contract_address": "0x27b00fe0413dfc2de52d18562a2d0fb353a9ce00",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0xe015d4705187b59495d741dd97e23e6cb0344c13",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x5b61832be41b394ef6daf49572e9b0ff7f26c653",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xab37e709caa261166771776f6b5b54cb8f23a1a4",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0x3985d18584a001735d6bb47182c91202811a2484",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x35c8e08ce3478d476f4faa9c56f3e019cd47b8c3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdef7e16a7935ee2c05fe57ef3767a8b2c9c3727d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9b5c71936670e9f1f36e63f03384de7e06e60d2a",
        "swaps": 773,
        "distinct_swaps": 770
    },
    {
        "contract_address": "0x46c753ff9d653f268ab173a3c8412818ba06ad47",
        "swaps": 161,
        "distinct_swaps": 161
    },
    {
        "contract_address": "0x32913035b054f09a0c0456a0c76d6fe394040940",
        "swaps": 108,
        "distinct_swaps": 108
    },
    {
        "contract_address": "0x692510dacfc02ef2bb57ddcfdfe5137650e29d5b",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x97b4f2797cc903d76f9b8ff41a94286f0b16198e",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xa75d2165edce9cf40aa1938903acd6e5227d3b16",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xeb1f46ba2f2dcb40f4ff1f2de281d36c66da127b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfe8bacb45a5ce5cf0746f33d3a792c98fbd358e0",
        "swaps": 107,
        "distinct_swaps": 107
    },
    {
        "contract_address": "0x4f03233c742ea20e73b46d5e33242b7770274ab8",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0x101009f808fb7667c290003605a73bfea7096da8",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xcf8e71fc8d8a0d21764c932db05ff729d394c1ce",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5f253778b993bbf0a994cc052b7443418fdba1c1",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xd3d352e871d5fbc56900fa4f321fc6f6abadec49",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9c7fbda5745346440b90b0f3867ae904cb7533a3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x356ce197b043378f90a9d2c26fd542bf91bc8ed6",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x1d35a3042ded4e498ef42c61e8e2c6c3c771682e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x75fd5f7d31f26dd840ddcd7284dbb19734cf701c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe8137f0c422249e7acda2e05d401b3e4b608d062",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0xf6422b997c7f54d1c6a6e103bcb1499eea0a7046",
        "swaps": 934,
        "distinct_swaps": 924
    },
    {
        "contract_address": "0x9532818c0b8dd5bbd99592ab600494aa1ee6e00c",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xd24f78881bfc55f1236c8d40cf33cfa44dde7bb4",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x9a0ab967ad241089440ff2eb845d2e999af7613d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3ffa7bb93cf076dd0482b9492506b0b1f86e7bbc",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x4485a5eb0d6d261af424b2a745f3277038e7e64e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe14d28312aecb1fd6d19bfb135167ea7ca36b8a2",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xe8b5b79a75783b9b6a164ad7a43c6f0c22aee141",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x72a95857a51a95915177b4c6424f867ea699bb22",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe38978f9650233d5f8bbbb2c6c2dd42878b6790f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x59eb8cf17c5455ae0c0533a29afba6c113841eb2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x575964128616b1fc6a91998371d92bc9546f5213",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x63cafa63d46a88083104c7405980bd5428379431",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd1ec85bb8f3d3adcb46ba430449966e2883ba176",
        "swaps": 113,
        "distinct_swaps": 113
    },
    {
        "contract_address": "0x0295e3d4c632d4a021886fd4a4c9cb06bd6778ae",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xffbf5b29879f61545a97d954b7bc5ec69949a0cb",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xf66502fabc81e64ad6e3a8fd60bda4a705a72bd0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4b47fe781f0642283303f04941a45700d6c83522",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x378fe5bda956e08a9bbf166058b942fd6cb27fab",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0052fb01c40e5ef4b7e1e5fb2e9153f837cfd89f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5e365db1a7213c0c5739129d80e95e64e6ed088e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x23e93ce78d7fb5287e4b6a8d91403bc5e7ac845a",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x6a49bfac47668f0520bc9a8c473debfed037a093",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xd33992a7367523b04949c7693d6506d4a7e19446",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xbefaba1c380d8b0a53bc604d8b809684775e74f8",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xa4592dbebf86e588eb90bd8a5e903173755e972f",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xa79dce7c620a128aa06284f5d9f4c4d843a2b114",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x310cf601eedef6eddbaa545732d129e7dab58d26",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x50808574f44773951dc40626351a06a984f7311d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x795bd83f64a7fdce8a2eeed40bfa16e3aef9c08a",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xf773846966a14b4300f42d0f73e8b347e1f706a2",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xe205efc81ff35e659986c433cc11f13138084926",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xeea2510d8044b5308ed1aeea427709eafa5c4d28",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf6d33e48f12694efd0443e8a78d4b6b8c5f90671",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfcd877cb5c3ecbf51e329df525213bceeef741dd",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xad148bc00f5c4856489c9e6744a527ae959a6435",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe60afed80406190c3ab2c17501d417097dd741db",
        "swaps": 423,
        "distinct_swaps": 419
    },
    {
        "contract_address": "0xae0d2798bbdd3b8c693bd4a523cded8edf32e3c0",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xd6c1fe4e4dd9a949c05c9b6904c353b87e3cea3a",
        "swaps": 129,
        "distinct_swaps": 129
    },
    {
        "contract_address": "0x021079e9c60ab36d62ac10087fc9b62047722403",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0x47c50542536b8599635520527b9ef41a22a9d841",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xad3302e3844b21306665d9e826dab621998860ca",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x0b2d5bf9ebbc0e44a5b8f1e1c2fb1d8af7aad1d8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x29761e548ec3f0b428414dc41a2d51bbfa0831f5",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x747375305b825c49fb97ee0ac09d19ec9ef94bd2",
        "swaps": 158,
        "distinct_swaps": 158
    },
    {
        "contract_address": "0x436803355d26943dd0bc9826d39f9079199a890a",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0xbba6e32f8d16e71a927f773d3ca192d91bd83fc7",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x719c1755e4d01230bdca870b3f91e70c5b771d1a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6b3aa71c74042e113bd0b055224d70a131334761",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x500b57ce4c859da217817261749a471dbe75f8ac",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x904aacef570454244110839cc2c8efe0d1c75565",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xceb853d3341808f8f1d0430da1ff36a236842bf4",
        "swaps": 90,
        "distinct_swaps": 90
    },
    {
        "contract_address": "0xf13ff9933818ed46ccedfb3d42708e92bad602f6",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0x373d3587d6782a44aa11507a39ce0b278724909d",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x9e15322796d96dbfcf03bdb535f83e070fa5de4e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfccabd913df5a17721c30bf23feb7ea865422f45",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x3a86e81b1f4311cfdc0f120309d6d14d16e2007c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7afa3085f397972acc067cea6c8955ffedf92c44",
        "swaps": 1512,
        "distinct_swaps": 1431
    },
    {
        "contract_address": "0xd0595ff44638182e6b54051493ec0f045d04335f",
        "swaps": 315,
        "distinct_swaps": 307
    },
    {
        "contract_address": "0x564d4e21e2b140f746d8004173f23bc8457edaf1",
        "swaps": 349,
        "distinct_swaps": 344
    },
    {
        "contract_address": "0x830fa036a875fb73c7f0632738a2f9a9641a7354",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xf5f728f1711c3be6b8beeccf676b88143a79d8db",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc8b265a3684145f76512f272b8b3d9c07102cd53",
        "swaps": 63,
        "distinct_swaps": 63
    },
    {
        "contract_address": "0xeccfd2e27c58429153bb9229e55e4b3efc827d1f",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x49c0441accc4ea95af354c1e63fdbf00d0825834",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x1d52ce4e81b1fa3c2ef5332f7a8e2ef65b92d9f6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x38bac64e283c898fa792bf2ee16aacccf482961f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x46a5d29917865dcca310780b0e1a008cdc6240b0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7caac644722316101807e0d55f838f7851a97031",
        "swaps": 183,
        "distinct_swaps": 183
    },
    {
        "contract_address": "0x59153f27eefe07e5ece4f9304ebba1da6f53ca88",
        "swaps": 373,
        "distinct_swaps": 372
    },
    {
        "contract_address": "0xeb477ae74774b697b5d515ef8ca09e24fee413b5",
        "swaps": 348,
        "distinct_swaps": 341
    },
    {
        "contract_address": "0x29b6469ab9147c4bdf3a966961886733de9c8cf1",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0x65769cc01f1bf67e2dd6bf147398ef0261e90dc8",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd6251d670b5fdf270bfea6de285003304dd5d177",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x40fc7dc1b17c9b0f8cabcee1f86985e87eb1010f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x35c2fafe34affab78235e1b5536fad21f9cc07b5",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xaca37a3282078dbf41a6d0c6314c53d7f9ced6ec",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2648ec89875d944e38f55925df77d9cfe0b01edd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7eb030172d5fecbe6c5e0d5c2cfc2b60b0d8664c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6649f12e210862e0045b3dfe7e6ea1f8f0565049",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc9ba162d07d762ad4c2a759cf806f8650b6c9a93",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xb988bf9071697f233d1e9efe3927b641237d247e",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x02e1cbdc81e3cbc51afff67e1476f5ee9a4c6204",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x44473c3eed414089388961e3e121dad85a2b4e54",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3bbb22b9429320d9e1757a9f27b8717e7a0dbd88",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x8f853bda964e847d9a0c3edd1ecdfd989114daa3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x478577fd3ae5d1c63c3023a2e828f22698589a0a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x5a961d15438a5efb7d832a6bbc4509c3819ffdea",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa83aba94aa24d83a357cfcd404bdf1a9554a94d1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbf453e64ee7f43513afdc801f6c0fab250fbcf09",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4f76de0543f06b7879ebf5c2908cefc478e29fa2",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x5f98d4150e299df500c2a9463c66985025494e63",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3af28cc3c87986f676e224d15551534823519edf",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe911278643baf7f8e4e6a7e7ed1ee8416d7da388",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x42f3bd2e0e6277b8757bb0e8332c1603afa2b391",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe50e01177344bae6997bc33c0311d16aabc7c194",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x31019e5ebc6a834c9f6333b948758e6c7985fd98",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xef45e5814cc503fd3691dcd9128f4200d4e46d02",
        "swaps": 242,
        "distinct_swaps": 242
    },
    {
        "contract_address": "0xa2907fb8c394b2278ac25499d655368aed69fb88",
        "swaps": 115,
        "distinct_swaps": 115
    },
    {
        "contract_address": "0x12e7e2e26bea30ae6ffc21b3e4046a157415c5b8",
        "swaps": 238,
        "distinct_swaps": 115
    },
    {
        "contract_address": "0x7b6e89276d465c087f4656d5d45510b70c2c4cbc",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0x45495965257cd16abff838be42bbb9b545f7fb9b",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0xdd00e6f6768a9b51576ae85306c6449b666318de",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0e5fc2eb24240b5a73482d3a96c1f44e2e035b74",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5db10439f3e91334884726d6a21f9158c0aaba5a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0b48b39c79d3d99a5dac95f6cbb13b490f818983",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x827ab2cbafdb21bb5f475e19d0c0e2197e693cdf",
        "swaps": 153,
        "distinct_swaps": 153
    },
    {
        "contract_address": "0x807ce16d33fd0711dd211e65a893fe5551c29eb5",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x83e5f826f35fa4a884ef53ea1497fafae1bed1d0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbfbb75bc384f70a2cf3567b9e2d89cc475a213cf",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x416cd487dc8195c7f67a82ff78edef3b3f13f385",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xcb7cc6469dc0e3f46cc1fb8beb96b4069aa0a88c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x64fbaff347f17b5f227fb3015df2272afe64d06c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x7e35d2bb23b81798bb15b1cb3d2f5dce5c04dbfa",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x75e90ac3e5dd5cc30a418f0cd1e15c8c89c9076a",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x8982d71337003cd172198739238ada0d5d0bd2fe",
        "swaps": 49,
        "distinct_swaps": 49
    },
    {
        "contract_address": "0xe12e4644d7969477fe4ae4d887c21c0493eecb35",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x695986e263140fdf9c34a756ee44fc86164a0554",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1c8e74b3abbb908f2ef26965f87c42457a84c5a5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x39efdf3380883ff53507224cad2f6a82feaa4de7",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa4d9008621289fce4c08bcce3024e9a0377e6cc1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x066a8c420a477520abcd92791d2296a0578f5c3d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4cdea948fcbd7052c6f96ae0b2a991da60c603ae",
        "swaps": 140,
        "distinct_swaps": 140
    },
    {
        "contract_address": "0xf0b65db5a285ebf4fead4db6b284ba20ed415dee",
        "swaps": 114,
        "distinct_swaps": 114
    },
    {
        "contract_address": "0xcad302f0bbd9749f768ee5b16b27b6602084a2ba",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x80cc7121def653e4f6a3c32d585099a1ec822a48",
        "swaps": 137,
        "distinct_swaps": 137
    },
    {
        "contract_address": "0xd4bf6b3a561472177fd44ab7cca5f18f2c649d69",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x264d5335e4ed0173f56ad3bfabac178a8d222e1f",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x5db4b169605ac0e7f0ec45709132e65844af5d9e",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xd98a73d24ecd74585cb4c65a2153a4bc591c19ba",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x1eff40e72394ff94ad23a8635378e8b49ac9de2c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe4699944acf4274ca5263d3210da421a75abf96b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x95aaab0fd05c56dfc3fde064073efa06f02e9340",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb7ded7c0be4f8b6e6e02c17c3159947270038102",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x256a0865971ef39f333b792e9aa52834dc4e4ac6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdc30d23c4d1195a9e8d35452d72d754572d1ce1c",
        "swaps": 148,
        "distinct_swaps": 148
    },
    {
        "contract_address": "0x5b14b9205d79cb9e8b6a3bca759f51a65e0155e2",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0xf0f2a89031dad9becb9a2338001a490efedd8c31",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2c901e64dbf571bc7be55c8053c4cb3d1260d3f9",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xbbe5f4998cc537a91e7b90c7925d1c7c5bab7ee0",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xddeb0671cc77e5d56aaf97aec247797b5794fdd5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xde41e0ffa80b16a0f53050f789e7328c93c367c3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x16d8eb3db09de12a815d23b280e0e4dce4540508",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xd452bcde2c4e1b811784dc63d25339b53649699e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa498a892ad0d3f70aa449798023aa1f4a0888268",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x7719758df93eedd66c8722a702f4d517d71a881c",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x95101c317a86b32a35526ada676ff5078c437662",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7a963b39f15291d47f6f50234783c456f952d79b",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xf4da7eedfafdd7160689ecb81bdf45925fc055e1",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3cc406f739708e61c4491751cdda6f5bdb38e9fa",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9250e8333b7fe3ef2bbe52bb2579a2339034ecb3",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xd9150c86ebd085249fa1239557e70736855f6a98",
        "swaps": 63,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0xb8642dc5989618395ffe75f5aeaa70df8815a653",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0xda5f7fbea27c245659ff5e51861d9c782c34664a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x773c9eef276ca7b48acc5ad20229f9c40c3d3b11",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4776c7ba01184d71ed56fb0ca751d355527c27f0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xabf61bcc0fa4ae367d4de63b716344c647b74d03",
        "swaps": 135,
        "distinct_swaps": 135
    },
    {
        "contract_address": "0xf87b839077db0e5ea5bf8b6460c8413abe72bc2b",
        "swaps": 296,
        "distinct_swaps": 293
    },
    {
        "contract_address": "0x9803c7ae526049210a1725f7487af26fe2c24614",
        "swaps": 140,
        "distinct_swaps": 140
    },
    {
        "contract_address": "0xd278f9597a4330fa1ef0ecff33240190b7e99e97",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xa2532d1fbed757936e13df51dce0077ce2f825c9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xac1188fd1f97f163af6a614b6d456393a25d7a26",
        "swaps": 488,
        "distinct_swaps": 488
    },
    {
        "contract_address": "0x4ca7bc1641e1c998c3e52a3d1b1ac73062f4fd0f",
        "swaps": 203,
        "distinct_swaps": 200
    },
    {
        "contract_address": "0x3d0f90c60c35fa9efc85a8b0fa63f5340c8aa3a6",
        "swaps": 50,
        "distinct_swaps": 50
    },
    {
        "contract_address": "0x086b7b3ee53dfa70f3247331bf94461866389e32",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xbafaf28fc995e69edb676d7e809b3819d8d31fd6",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x0f9d098b5ca1eff5b1f7fefebb429ba5c7d67bdc",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x21ed686f433037e321edbff73d9a54c40c9fe518",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x907157195ae34bc046a5bb2037993376bdebd477",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4485df5f2b6bf03935cee44bf41ba65c06650b84",
        "swaps": 170,
        "distinct_swaps": 170
    },
    {
        "contract_address": "0xab55c21663e56ac97f40522d3ff59e53a7a4d3b2",
        "swaps": 168,
        "distinct_swaps": 168
    },
    {
        "contract_address": "0x205995421c72dc223f36bbfad78b66eea72d2677",
        "swaps": 63,
        "distinct_swaps": 63
    },
    {
        "contract_address": "0xc9bc08ca3b000acadaf1cff0e302a293e9655326",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0x3e610ec0061209bc32027a1e1b00e73a618efc09",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xe8c3da5719a0067ae2fddbc32fcd89bb7aace4ae",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8accbcb2da6860172c3a6d911cf215f074419a2f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x3902b89e0e28a23f82086b87bb81ef5a1eabf276",
        "swaps": 11,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xd5ddeb3bab0b775c2b31bfd5526cf1c36cc48985",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x96355264dfd85f861dc2ccb1e4e7c677993ef2ae",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x230a6f45704037c800c6f4b5be23d00cf37054d3",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x9e2fbb31fbd68472f6cd54a1635b8cd64d78fc1c",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x09833c4fbd1d28971b89a84fed3e8c16e45dea7d",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xa2b22bc1fdd5766517c14ff5b9c423dafb7a41e9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2bea538fde0bcf30572bf1749d49a0a72013c8b0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc4a681264f93b8db5d554efb4de6ee011ada091b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6951eb8e9bd734290590c8e7770aebff19e4f043",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa3602315cb30a4fe3dbf2368d679f587f34578e4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcdbcc1ac4d4e18fb1f2f2d604144fd33e77cda52",
        "swaps": 73,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0x9361313412e16d03932602a66372a2d232fc8c21",
        "swaps": 195,
        "distinct_swaps": 195
    },
    {
        "contract_address": "0x010f15d8c641b7d2b721481a55e6caff6556a803",
        "swaps": 101,
        "distinct_swaps": 100
    },
    {
        "contract_address": "0xbf95cc01b6c9290ba0da31fd6bb1f33ec8617793",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7d2bdffad23e4d6d596616a44e1ec50751a475f0",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x47be4b1b6921a36591142e108b8c9e04bb55e015",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xcc921ede3bd08b3abc038b9534b3d517cdbc6f6e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb61fbe5aac9e91c16f477c8505cf21fb919048f6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x15c80bdf3de14a3ce0ce320c13874bffc9e31504",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfc2234eff1ace573915924fa6d12e5821635f111",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x2f88dcf07386d24190206db6592096454f86978f",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0xf01a0a0424bda0acdd044a61af88a34636e0001c",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xf6b87181bf250af082272e3f448ec3238746ce3d",
        "swaps": 625,
        "distinct_swaps": 622
    },
    {
        "contract_address": "0x409d68c26af235c81e2b9bb213603bb390e1d1aa",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x2e305680de5aa55f0c4750d17b5d9badcf60ee5a",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x997a59426c745934710e1130736a995673b9e237",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x022268fc83395ace2bd0129a8d752e35c24ff90d",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x8d7e70a79afb713f2217e9ba3bb43b5be1d5cbad",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc427fe6e5687da627d0feae6117a0de76b4bf170",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0dbc5ee7eabc9d85e8b560de051f9779807220d5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8ee721697bc0a4542359f4989077d65318bd1c69",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4c38938e21cb9796932b0b0cc3f8a088f07b49b0",
        "swaps": 785,
        "distinct_swaps": 720
    },
    {
        "contract_address": "0xbb549008b3167b3f2a8431551c2f6d7874919b91",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcd38d1b46cea363886b429a33099ac432a672e2a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x8053237303a2f8cce40f8e8e0b5d409dc7ee2b56",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x931d5854f58b624f6ee9c77b8d4d8646ac8a6b89",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5c2f338941debc46cc2243a673e45d871ea6bcc7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x05efa0ed56dddb4e950e3f5a54e349a137d4edc9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xfba2f99e33ecdc7455d5702a8061c171e155a26d",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x106661e99e70475427136b7388070eb052e8350f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x893cda0a58a275a2f73966cfba5712b4a835a586",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x285f550460ff409da52b30aec393e3c5ead9fad4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7efb92c4087c1e22bbee9f8453ced1e1e893dde7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1fc05157e66300377b637e93262b355d405f71c6",
        "swaps": 88,
        "distinct_swaps": 88
    },
    {
        "contract_address": "0x48356c2ebca8c541ebb999bbdea96e3119e92401",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3dd6a0d31818fdacd2724f2b0b3b220f14a54215",
        "swaps": 15,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xf5f6a9c37b9eda266cfb74434e7a6eeb7787a7a6",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd20ee5b1ca8d505764f74037d6cfb8bdde67cfa0",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x93468e3bae277038fd6e93740ebbad8862d00e63",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd7e959b994e692c0f5fed41279b9851a302b8075",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6e4d9f10db1ca27786e40e8b5fd0893036c44c08",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xe10050bbb06a1fc2f8e3e239fbf30885c813de6d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x927feb1091fa58c994025e6735481e71272b3a6b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbbbed112998c23cbff674beb3fbfe9c8595c2c74",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe7d85cf800119bd280a2e555d3de7f954452a831",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdab27a384ba6c680c3d468ea32c36db939e7ec87",
        "swaps": 115,
        "distinct_swaps": 114
    },
    {
        "contract_address": "0x0d407bc857d80d79163ccf60a9ad446eac9017e6",
        "swaps": 93,
        "distinct_swaps": 93
    },
    {
        "contract_address": "0xd8ddc96c117aef8d600f660b435883ecb1675b1d",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x51ea8de41f14cae6983ed500c5c9324e78690755",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe49fea624d480a5233b5dfc4969a27319873e6f0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfd87730e299411f50d6a837914ce6a250349b4a7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5fb641de2663e8a94c9dea0a539817850d996e99",
        "swaps": 335,
        "distinct_swaps": 326
    },
    {
        "contract_address": "0x64a3b8ca5a7e406a78e660ae10c7563d9153a739",
        "swaps": 191,
        "distinct_swaps": 191
    },
    {
        "contract_address": "0x5d17a3089d7ff50cc2fae3d76f1be37c19e3869e",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x9646f7cfbece44b94825f3aaec88d591941b8dc4",
        "swaps": 69,
        "distinct_swaps": 69
    },
    {
        "contract_address": "0xb5a0c302000221d660e31e792e5d8a6a0b12fc97",
        "swaps": 60,
        "distinct_swaps": 60
    },
    {
        "contract_address": "0xe169a660d720917b4fb7e95f045b6f60a64eb10a",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe3283789f521499a5c2e50189bcad96c6104075b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfd917d788b8e1858115eee573391187d2fe80a04",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x516f3d5c323ab9ac8f92b14040d3b2ddb4dbac35",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x662ae8ebecba6ce8aea045da2802b9739b728b87",
        "swaps": 59,
        "distinct_swaps": 58
    },
    {
        "contract_address": "0xebc6ea60182133a2ff9c314e6a705bc166a38364",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xf177bbcf0b9814385a318df5f3facc76e7500fba",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x74e45a7ae5608f578a230973a0308a09d900a44b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xd905745983e1ac5b61366319141834acc26ba101",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x595519dab18166f23d3a0592d83dcad4ab88cf25",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc1507c3e06f0ff67b95ef1c9032bbd1b4028b811",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x37ab33d6fda4ec0ea3dd2f6fa35af94c80c88b7f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdec79f00d7b9cac3a931671487d5afda12315549",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc63405b278e2fb019d5e901c227ea5fa05b45620",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x42b103f022fc764e32ab48cc8525af469f81e33d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x354608a89e4155518aafd4fe6241d2d940620f47",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x61a8cac7cc9e138df5cbb48cc0ca7578193364b6",
        "swaps": 176,
        "distinct_swaps": 171
    },
    {
        "contract_address": "0xd2557ae8758766205c18fee9ff763434cd9aa471",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0x4e7fc71c42368600fbd71d3fd74756b8ac42fd8e",
        "swaps": 78,
        "distinct_swaps": 78
    },
    {
        "contract_address": "0x45af0e9115ee5484f6f156df0a1f3bd316040c11",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3df72a5bd7c108713fdf77482cc39da964f416f9",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8711a1a52c34ede8e61ef40496ab2618a8f6ea4b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x24619c126cc93c6dfb2cf4ecc5d4d7cfce73c97d",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x58017a59fd95b93ce63c74ca4d50529349194c7a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6e70d7c75b0cf92dd616cbd0b803eb77f97b2204",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x390ed51837229301fec869d23be6d8a38c81d8cb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9894f869987ea694dd75e19830ddb232af5e0c34",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf150e8818c525374c14f4a440c61410f1ee0521d",
        "swaps": 102,
        "distinct_swaps": 102
    },
    {
        "contract_address": "0x7c3659bcc59401c8dff45591f2050ebd7fbb789f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x999fc000f3f5176306c0753bad01d6a37644feef",
        "swaps": 79,
        "distinct_swaps": 79
    },
    {
        "contract_address": "0xdad6f89af66334ca7c4576e716ebcb0b61aeeb92",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfdf6f1a2d3a0a24807de2cdb3afd2a813920436e",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x029717539b450a711b49dc6d6bd0b405e383e3d9",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x99dadf889520b9cebd9959d3ca1866dc2517ea1d",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x14caf80f9aef3f3252903da5bce5189cce83c6c2",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xfdac4854fd60484262cc430360a1e140fae47436",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x116829711e57d77116a19e5cdc26b00dbdc05e14",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xdf5c6635e4acf40e98a2b6bdbaa5175933f15a06",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x2a229461f3b6e8485831b02cf72408ae51a40ca9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x878365b7faeb16dbefc7adab6d7dd768cd8e7007",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xcfc38d15cc4642ae6ad2df238649406d21420a53",
        "swaps": 101,
        "distinct_swaps": 101
    },
    {
        "contract_address": "0x1a4c0851b8ef68feaaea5d2896bb9b324100c10d",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x2a6935f5b1b0704ec8946ab979fc3a07d55b6f07",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xae7c304b3d11b6cf2c1bc6ab7e36ac11f6d758c2",
        "swaps": 132,
        "distinct_swaps": 132
    },
    {
        "contract_address": "0x3830d1c25932162c0f44e1f26cd09554e9916ac6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb93f2d491a00dc55eef3a825155888ff9dce93ec",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x4f19ad546c66016042623b7ade88923c161e3a3a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xbc58e7a5947ecbbbda60d76e4d027b05ebbd6e9b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x45d25f63a4a2f97b5fce60ba0f0344e3411314d9",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x68c134488e94ffc17945f79ccec955019bd92f40",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcb1e67ccf171e284e1cec0f344b6593319c77ebc",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0x6c5c3285c1519d23777472d302d00731ce514af9",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0x5dfc872083f962c6f219db8858382e3ace705c73",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xc7994258f50e7c746b0c4ecf7cbffa89caa04c0e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x57587c42fa48dc1e03d3c101aca00ae019866a5a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x47ebdaaa1da5a2907097a15f8c68617752c68523",
        "swaps": 107,
        "distinct_swaps": 107
    },
    {
        "contract_address": "0x8767f5e2c8590ddba4c4f5d3aa34ae37acb0e46d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xdcf7cf242c5e3acf47924e583607533ab6b378f6",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x766e3e7d61eb52e774c22b451eabd4b975debc56",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x58ffb271c6f3d92f03c49e08e2887810f65b8cd6",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x2224ad0402873dd223e34266b81296b7e9e65bb0",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0xf27c14aedad4c1cfa7207f826c64ade3d5c741c3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbe2042911106f27f06e7c72538ce16bdb1b5a135",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x489950f82d39d5f23b7692e1c1cde72383025d49",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4553290003e052cd5b66769ed5f94b6a097cf973",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x1d7c760a79ec798cbc5f6e017baaa445965daba8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x531b486c7be2879ee294dabb2d9e51ee2e16ab3c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xe2195ee40a05529a1e1b894de43be6d6fedcd694",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbf72e9b935ee7fdcbe8c8f11b297c74518aa779e",
        "swaps": 56,
        "distinct_swaps": 56
    },
    {
        "contract_address": "0xecd8ae42e16cf3ddba3f59659bb3f08bfd438a17",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xcc55b4843a2cd3fe0d29284a3d755ec3d2c9ae75",
        "swaps": 93,
        "distinct_swaps": 93
    },
    {
        "contract_address": "0x7fec4bfcadabf3a811792d568743842fb571b673",
        "swaps": 61,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0x0f4b04eebc9ec8bad6b0ebd7254f496f0de15cd2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf90331cb67f9ae85739f5aedfa93dec68b7ce32e",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x34a9a3c65b2df76e5ca663e50fc7b432ae6f7c1f",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x14c1ca2b043d0b7124d7d8da4fe0e7327b7ffea1",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x5e714d7ab60a5aa883323ca69ff6919a18353495",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x35b8aa7cb1cd0a42314bba2dbe0e8b9f8c78c681",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc93781ca5a8f6913b92bbb6b9f1a398c44e7927e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x83628d58c8f704f7a56c7fc51b9a1f27f5533ce9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x89cfd63997f91e3dcc6140db32ac5d6774311514",
        "swaps": 229,
        "distinct_swaps": 229
    },
    {
        "contract_address": "0x6b0ce31ead9b14c2281d80a5dde903ab0855313a",
        "swaps": 195,
        "distinct_swaps": 192
    },
    {
        "contract_address": "0xb5d51cad73ee111170d454cb2977b78681526ce4",
        "swaps": 84,
        "distinct_swaps": 84
    },
    {
        "contract_address": "0x6928f1577b3507de99490ca8c5acea6fc1d24a84",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0xba60a991dfeb25f66711b498240056fbbb862660",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x1b29d2af57e90111aebc69b2f757a7263cb54932",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x8f35cbd13ca59049e31a53f54bc473be16c1c91f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0089950441b7c8afa8a79129cafffe55420d7cbf",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6cf8654e85ab489ca7e70189046d507eba233613",
        "swaps": 799,
        "distinct_swaps": 792
    },
    {
        "contract_address": "0x9a8b2601760814019b7e6ee0052e25f1c623d1e6",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0xa3f2ce9f86f2e7e18df141b6544fc906ad43f434",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd5d330af3527354beee53f5d35d61aa7c6d99191",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4414c652697a3930fc16a9da2d45cccbf09f39b5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x63f3fe7f2b89eefa358cc37fbeae480492e7cf3b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9065f651108d9d6572ac24ec661b7d69b1164d11",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x14483d7b4634fd5f6866cead7396d1a82787759e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6c51df2275af37c407148e913b5396896e7e8e9e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x16580ec9574d4bdb202503e7dd8320786e2e04ce",
        "swaps": 41,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x648c71cdd49ad4c6d2e3df3b926c6ed1500ca58e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x672d867b6f598a24fa0588c7bc181019d7db84ca",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x45ea5ce4e764ae027b64c8df8f457e168964e026",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x64158c8662f4437c48de2128176d5ca2d68f7e22",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2e026b382bccc90df4e73985d1bfadb8ca4ab13b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xac09fffe313b64a103a744034b73d5f1b521861e",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x566376ec2667abef6a2fedd440242942cef99c56",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7a6f5e5d8660fb2a3fe07267d26662605cef3d70",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2897aa1ebbdcdfbb78ad50d97edbfb8479623ee7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x592d8faea9e740facbd6115abd92d2e6acb2f8f1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfe9f1e417afe603f6de14cba06ec878fd132cde2",
        "swaps": 75,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0x6fe68f91b51f419e19b2ded9a70dda2f3f1b0970",
        "swaps": 49,
        "distinct_swaps": 49
    },
    {
        "contract_address": "0x7e00fdce3ef6d3de0650f98dff5d267cd51ca577",
        "swaps": 531,
        "distinct_swaps": 432
    },
    {
        "contract_address": "0x461053a473248054807241ade4f988a35899a312",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc5364ac9b05692411c97f973e6321f3f5aebcf47",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0x09d895ce817f9159f773178c5e3775f8ac492678",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x539564caeff8c504a4e12bf5cd23bb822fd980ed",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x22c23baa73d0804b2c05fb2789a212df65257e4d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xd3485dcbcb74d6f971a798228a65f9a3487ebc13",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x67120361f23a91f7396c2e5138ef83cb08e4a635",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4a32b3b75691c090876e32d9937636dad77ec5e3",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xd20b3496cc074931e62839f6f07b7593733c67c1",
        "swaps": 183,
        "distinct_swaps": 183
    },
    {
        "contract_address": "0xcea5689406e342725bd3f25378f525622611669d",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xfd29f28738f10345dd53681357ce101ff1fd4d17",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x10530b537935a7e89d1c64f707af057679d89b2c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x05f9dac24168bdeecc1a75163adc9a452e70c785",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7cfad4bcbd7439535f054eb0fbae9f1349d3c5d3",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5be1e6f8ca5b727c02b417a8fdd572f3603a606b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x75a2ed847e0f80627b15cb11f63f520850028693",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9aec502d468b3fb26194eaebf97eb87c07d4c78e",
        "swaps": 213,
        "distinct_swaps": 213
    },
    {
        "contract_address": "0xce825fd2ddc0fa50fdcb3248ef82c38e6ffb1925",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0xba4349397ed27d01d69d3085c26943721a36a624",
        "swaps": 178,
        "distinct_swaps": 176
    },
    {
        "contract_address": "0xa67377b0b0a261b2b4fa3e16e2a37b666b2cf561",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x28b964e093f99159d37ad4ac6ff7b82b9ccac45b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe2f4e5f9fcfb0a07df77a565fc3fafc434429b13",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xbcda315446ca4fe9b21edbe1f1f0dba683c59a9a",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x0544572b44bec0755b75ce34b00a7afd8812a07c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xfaf9bed4c3a3ef1ea16b53492387358e8b4d12c9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x329a7ed1e7290b9b07c825b67cd9e63564319958",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0cfd654f8963e827bcce1deaea2bbad47b678048",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x974451fbbe641e2c87da57411269f9e513d945b6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbcd628917fc439b0f45513eb072e4bf22f4d2e75",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2ecbf107080e00dd2d931ab6cf841fd481085414",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x654e651b658f784406125400cf648588cb9773e8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd32f3139a214034a0f9777c87ee0a064c1ff6ae2",
        "swaps": 2088,
        "distinct_swaps": 2050
    },
    {
        "contract_address": "0xdb9eb483db7d77141f7c14392bd93f086acf9b3f",
        "swaps": 80,
        "distinct_swaps": 80
    },
    {
        "contract_address": "0x27ab6c4a63e2ff9b296983b6eb9a8b80856c79d4",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xcf107443b87d9f9a6db946d02cb5df5ef5299c95",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x2735d319739edc6c47c3a20aa5402b931c3f1a1e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x06437f3e5dd7a8a0a9e4c6217b26f25c6fa78b71",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3461da025e838c72bad1ee580f6eb3b6376d86e7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x86ddc561689975bc447fd17088454b6d42029881",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x52f31162e07c0158c5dda8c922ca09b52881e471",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x00ca0dd51dcd486cde843c7b2b734fec203dd289",
        "swaps": 96,
        "distinct_swaps": 93
    },
    {
        "contract_address": "0xa7c7d39c5102b65557c7c494d033385215652e11",
        "swaps": 66,
        "distinct_swaps": 65
    },
    {
        "contract_address": "0xe15e9d2a5af5c1d3524bbc594ddc4a7d80ad27cd",
        "swaps": 80,
        "distinct_swaps": 80
    },
    {
        "contract_address": "0xb64fdc28c295973efa58280ece861dfb3ce4a7f0",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0xf110f193f14d47a5b7794e1adc0e487fc9690ded",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x19e64a38bf49ff9537edcdeb813be0c66955f9fa",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x611f61172c3cd2de98c83c6c2b470a5fc2e44bb4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3f825c0d600659143d22c60677187504ae9b85ac",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb265935364e760f304bd5fd9fc8c747d15a56701",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0c100343ad704aa81bb50f2f15a8bf9b2e55e3c9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xef78356dbcd45db132fc42ac976005078841f35e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x54b149c3349aadfd283711aa4f05e102345c773d",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x3b8e0fe3c6332c8834b59f63af390ca2e85885d3",
        "swaps": 121,
        "distinct_swaps": 121
    },
    {
        "contract_address": "0xa4474cda619bde5bf69ede30384608c5ce1d70c2",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x8b6f0bcb3dc812fbbc182ad3b5267e9ac3b820d0",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x075e34bc9c20dee2e44757834752f72d18545f2f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfbdb795258c86fb0670e681f201d18a94c0827a5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb56843b5550e3f78613ca5abf6bd6ae6f84cd11e",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x9221879cb7d80df3b4e73c0741899d34e15ea272",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbeeab1e4e999a700a21c0576114299858e529f82",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xa8b6357dc01ff973b875571e126751967707f54f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8ae534f07f08422d00ed00a2be1335e411fb9da0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5febd8c70f688bd88a2d37025a2fce587f043c56",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfb6ea688c37c7327711a99ff2d62efa049cc18b6",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x555fa908f122dd042016749ad635e2ab9484e36b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa25969c94fbf4278f815f288df7721770f8171de",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x18d852fbd5535bea7f3d4b6910c8250c8ba89014",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb27538867dee2d042ff3b2033f08d5aefce2021e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1ccea1e55efc77e1b75bca562c45838c15757d38",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd532ce4a68c78a7eeb8dc8c71dc07c06712f62bf",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf4570af19c21a320747ecbadb0889fb3b1f74c05",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5a94f81d25c73eddbdd84b84e8f6d36c58270510",
        "swaps": 422,
        "distinct_swaps": 417
    },
    {
        "contract_address": "0x5005a83c6458f750ad65f9ea83ef2182917cec49",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0xb6d4a2bd530dc17d9db43a33a7fa8862e6fbc557",
        "swaps": 82,
        "distinct_swaps": 82
    },
    {
        "contract_address": "0x13a62ac160ee6f4639e0f9c9baa5ce6f9adfd7e1",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x022efdbc8731d75cfb744a6667a7e253ff035c22",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x30167fea9499c11795bfd104667240bdac939d3a",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x1c624a25f31b686ebacafd61c89b4b01f1ba3551",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x93d948264fd46925ce152f967d2d2e2195d68eac",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x20d832a71a8895636b7ad88c0ed364a9fd28ce5a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe221a2903f7f3aa52ce09e0b218e4382a6ac60ff",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf19144bc9b66bd9b999167b41ccb17d473419d1d",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x84935e35f8047dc9915e19c0590d385dec094d76",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x3c30e4e69cb95e11e7c5398c98ba862d3a17f3f7",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0xadd053a09f95e565b25d8b9b84d0fcfaa962465e",
        "swaps": 25,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x29601b8e5f135a8a1fa4de161a9f6ffa9617883b",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xe783ff32de19ed5f8492de8f993a6e39f80025c0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4f5ba2bd06ee60a97b6824275ea7b0846df3e947",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x65d43b64e3b31965cd5ea367d4c2b94c03084797",
        "swaps": 1374,
        "distinct_swaps": 1366
    },
    {
        "contract_address": "0xc961ac0404f95141573dae224525ae936bd3bf64",
        "swaps": 174,
        "distinct_swaps": 171
    },
    {
        "contract_address": "0xcf12bb8af000775f2b9bfdd4b6dc62a42406f3cf",
        "swaps": 18,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x62257134d74516f79de56cedc09b76db8ccd855a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x52cad3c8783538bdc8d47299e9c24b0cea058cff",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x64005aaa879bf0882b93a9360d57be53305d6ee7",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8bf34ff5945d519cf3eb4360e97585605c99daa6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x797d94e71d7f05307719906dfb68ae531b0bdcaa",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xef2d64453ee88cf112586e99f321480295198ccc",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x84ea4adc0283f91040edf936e886310093b2080d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd8e7d368ab9bdf0010a9934b0e801b3f38cecef6",
        "swaps": 153,
        "distinct_swaps": 152
    },
    {
        "contract_address": "0x4fa5e499eea684c2fee4b67e96271ee916c26155",
        "swaps": 85,
        "distinct_swaps": 85
    },
    {
        "contract_address": "0x4414b5a6356e9f1a5daade9eb5f3fe9e37af1635",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd1641d4ad34517ca20a64289025d9b18fab81cf7",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2203846fd483e557e3a6d7f270637c7685472658",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xbcf9803cdc7e91a22e966b2ea70daffa4fcb94bd",
        "swaps": 8,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x579cc276241ccc3fc4f56e761ffc85904fcda336",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x384b41bd57d4eb3cec5ed8063c4b15a6071cee29",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x556d0671657a8d463601347db806db7a3f9e325a",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xbea282f98df962c54be80a2050a211b64ff1aee0",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x220608bc10a5fc5dd8b265bb17cc03007d08dfeb",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x1de31f148297072d0f1808071a9986966475d984",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xdce4617404c98085330319d752c2fcd49e65a473",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3191e3e7cd9741b25a1b3f589820af6b14876ff6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x01af4da5f9234cd6569df9f2d9c374083a991639",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe0db967f7b7c938b71fceaeba51d9b48468c902a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x688bb04c9ad77944be567640fadeb9af053919bd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8d22f9d65d5e068682759c201f866b0912120720",
        "swaps": 161,
        "distinct_swaps": 160
    },
    {
        "contract_address": "0x7bf7324f9fb3f438f16559a3aa3cd06f391cfcfc",
        "swaps": 281,
        "distinct_swaps": 278
    },
    {
        "contract_address": "0x6d804f3152fc223012afaacb8be8d09729ae613e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc93461a1bb07bf08b2171e52538029b0191813fc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2d7579b6126b25b43515f85901d51fc1d661fafb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4259ca886e15a3f00d272d4fdd670cd3106dc998",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x96afb2e6236a8afbe71e908147e23b8b3b6d50b4",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xaadc4e03f5daccabdfdfd4c6173223c8720cd65c",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x89c38e400c7d98afb41ef832fe811baf06940828",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x398a0b2823be1bd42c36d96a750bd73511ae2217",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x04e4c8c941c64a41869e66a8517c2228468f2ee5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x140ea3fae80a2732ebc4de0511ff84ef1a575217",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xdcc88f8073bcfbbce3eca527f31853e4077ab24d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc2d9ff0e0b1edc0218d52e58c25d3285343b1175",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb0609659a45708f2d8a3e741edbadf0032e97631",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc7a8f954044abebc59040963de89cbf04d7d3c75",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3f278dc8174147be3b990f7f9258c088a6b4a842",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcbeea928cf53e1bb6d204091b8305412c123b634",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2aa7a18ceabf2ef893d2f7c0145cc45e6f10b223",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0xcdaadf5a4cc0fd7af280252409f6353d26a1c869",
        "swaps": 59,
        "distinct_swaps": 59
    },
    {
        "contract_address": "0xe404224954039af8d40309c1357c89245444b79e",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x15b86b3f5a781620f3d9f6a49cb97ea39da14271",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xec2b33da8d9004f3c54c62d85d5a5a47e4909f2f",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x92475eba8ea6f242c2cb757d6a39a531f9cf3317",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x360d8d30c8139e1dd4c8d81fcac712800c932a26",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x3645c0ad14061aa4eec5a572f667b4524707c983",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x40baa80364be11a77ae003c16f27cc2f5e7d4b6f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x60ac6d228ffeeeff423879baa02091558e6480dc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x52022b1e244787b66b2e55d5bf75d05557d960be",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0955e58b73465f858668ef7531166f3e7d19ac33",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x92f34359649eb447e49087e24c3a08a5408bf425",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1efaffde9387ef2550f44460f2ae1b62b215f036",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4102cd3737a0e64bc928526742c12cd4788bcb48",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd9ef432ce0e6ee314c4297af7524688c7c89911d",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xf864db3e24968a8eb6b2925553f2e5e0139d3ce1",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0xde6daa8d1580545f07264dda9cfc40c3d6862b1a",
        "swaps": 103,
        "distinct_swaps": 103
    },
    {
        "contract_address": "0x0d54918038dbee259173bdb055dcbc58211626fc",
        "swaps": 63,
        "distinct_swaps": 63
    },
    {
        "contract_address": "0xc2f972b21a6080967330c83b0778e49d4babf003",
        "swaps": 137,
        "distinct_swaps": 136
    },
    {
        "contract_address": "0xef3ebfd94b16dffcd214a977df4f90b776ab69ab",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xd7668414bfd52de6d59e16e5f647c9761992c435",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xaf52328932fd905654076042bed44910cab4fb28",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x18a73e9a5072d350296ebc4cfccfaa5d41fff5f6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf620da0cb4448048ae686d5b0922bf9b230b4b4e",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x9c8e56e594831951de0791577c0b9bf9aadfbb9e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3879caa62c72a2fec124b03a596aa009c6a07ac4",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xbe450f57cd0a15e81e9328bea8adae6459829b59",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x46489f825f11d7473d20279699b108acaa246e73",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x0404f9b850df6fabde06d4c8392aff1a4e79a47b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf67701a30c66bacec3ddc91aecdf4316c9458f09",
        "swaps": 33,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x7c5b028ea6a2a123bb1c8be5d3d2935d4532961b",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xbc68d2a5920c4ffaea20e2be48a0e09055481976",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x1ae24aba4046b45a887a92791f5bf71b83f985c5",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x146fe550f7750b66156ec599ee95983cdc7a3685",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x59bbb6573dc76b2ba8dea0055aacb5b889c03bee",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7c4bc99cedff7de60a4cefd5523bdc1952f03a98",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x61717870740c90464dc484b4f9c3317c153536cc",
        "swaps": 324,
        "distinct_swaps": 314
    },
    {
        "contract_address": "0x9ae7cbe16ba387101048b6da1f2b11604a4ab253",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xc0ab47b79bc66f98e5c9ee5ff386a7150d3f4174",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xaf80bce368d27349016e2f8a6f58a38ca311756d",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x0cfbc42f87948677cfccfcb81bfe42041469cac9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6b12b06274b99c1621a9c31bdfba0414a5c12ec8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3ff9352415999a9270d5aa80a77e675c4b0a2cb4",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x6260ae6bcfd748ff34063fd75dd9b8ac52d761d2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf8f8ec616bfe38044c4da31137d50a3193d03972",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7d341b151dbfbfe97714f3edec98e26f2dd0e532",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0x0df9e46c0eaedf41b9d4bbe2cea2af6e8181b033",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0x47d47ba1defed568f60ac3cb121b05dedf058576",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x0d6006868072735456614ee468c5f77f05bd6b46",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x88b48ef8cdab9f48db44bd2e7af7b725a41bd6a9",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x6046eb198abc5ea4f17027bc00a2aee0420e84ee",
        "swaps": 3,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x719d3c46f9e6e44a089ee148365e139060b4debc",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x310888b35766cf59ea81d1848be705d9a9156d9a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6fc2a79b1f0c31ec4dc4343157cbd8becb0f6aaf",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x68d5829d39d3fbb5470b21954551c114f6042272",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8b86c98c479ceb1ce884a5ca6e0ad57c114d5bf1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x380615f37993b5a96adf3d443b6e0ac50a211998",
        "swaps": 364,
        "distinct_swaps": 362
    },
    {
        "contract_address": "0xf7bc741b2086ca344e78225d06224ffdcd86d110",
        "swaps": 280,
        "distinct_swaps": 280
    },
    {
        "contract_address": "0x2fb3b855fb2e3f668de6fc82f026a7ab56f6b067",
        "swaps": 420,
        "distinct_swaps": 420
    },
    {
        "contract_address": "0x7b23afe559433aace4d61ed65e225a74094defcb",
        "swaps": 145,
        "distinct_swaps": 144
    },
    {
        "contract_address": "0xe0ce1d5380681d0d944b91c5a56d2b56e3cc93dc",
        "swaps": 134,
        "distinct_swaps": 134
    },
    {
        "contract_address": "0x44fbf20608468eb2c141ab4c18f2c711f403d98d",
        "swaps": 54,
        "distinct_swaps": 54
    },
    {
        "contract_address": "0x72602ca67ada6a8526ec248e95406ec6b13d4b41",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0x67991aa7095573f96b4f84633d3b469ef5a05184",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbef1666f1a3849bcc6b314f8eb83ba2e16df38d6",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x976b7b7fe4293111cacd946c422a64f24a223564",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x1f7df23299b8502a23ddae43b79a8c8719ec05f4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x84b31263d96e3f4c80f576e8b0783cca75f81d94",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x177e42f6b3da3ffdda3dcbb6010f00a380c3cb05",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x03686f576391c9f97b0513fd62a8cdcbc83e7c7d",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x1df661fc4319415a2f990bd5f49d5ca70efdee1c",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0x411ab5a494706988e2d417921c48523f68cf7387",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x1212c24e8eebf4add90fafe3852091603bb627ab",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x179a50706d79a5cfd8cd9d90eee7bc21bbec52f2",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xa3ead956187f645028b0e38342a747d337ab4668",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x57ada541cb34ecf12d1d457ee1d96eae71b39333",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf115bdba888d0f54aa48b4593123c3f8800cc92e",
        "swaps": 1709,
        "distinct_swaps": 1699
    },
    {
        "contract_address": "0x63a0caaeedf00bb671ae51785351d9e3324a6bf0",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xfa71ecac520c2074b4dd047d3696c0aed1b7c3e2",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7b16a984a183a723949e1c5e03db5490f586b498",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd8c0ee573c8fd7f557a2827b39834675e33eccfd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1bdf1badeb47088e0aa724522e4e6eeb610d826a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb1994a749d631e9afdd925e7aeadc5e8b4c69fb5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe4b0005cff0c7124f8479f3f1f69f23eef6c8eab",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xadf652617666756bf8fc2365668d2d06671ea762",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcf8e567dfbcc20f59d1c5a9cbe90f3276615a6ea",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9262ad80e6a363a66bce48417e4fe85cdd6bc43c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9003e1a7cd4b58e5a49870a9122e038d676a553a",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xa48cf151061308980c30adb0b2b1cb203cf93422",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x8bafdf3a3faef45a08d2bc065e736d3d8c6fdfe7",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x552f06f5222a677b5dc1915c66540b6fb7d54686",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd0d45cdd8229875853cee0143ab57eee4464902f",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x26fc5db732767e31e3396c448318590f240cdf1d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6d777149bb58cae7735505e59cf745c4cbefa7e9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x93162215fc187068b98ecd73d21cf285ea8b2838",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4efdb0df197f63a53b63d961bf727f2aa4eb242e",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xf8e657fb564b2d087f17d27c933a62393b1e4301",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe600c9c1a0faa03b055924eead9498adb3e63fef",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xfe9f1deabee2a50a3558dc510ee60a23aa63eca7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x16590b707b27cee5b1140a07b0679c85e6538395",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xcb865acb015f80cadabe5017383295978a0ba9f1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6827ee31d365e040a1891eb24e7cabb23db3b8ca",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x3bb367f673d52d1a5f0812c4d8c9030e5876ad44",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x18bbc2252f737a81d20d20c6db651b43971e2686",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8c53a84b16c3e477dff14a12f416c52d0f1adc63",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6777dbf38f67b448174412baaf21f38e058b1f4b",
        "swaps": 1523,
        "distinct_swaps": 1501
    },
    {
        "contract_address": "0x7afc060acca7ec6985d982dd85cc62b111cac7a7",
        "swaps": 158,
        "distinct_swaps": 157
    },
    {
        "contract_address": "0xfe4ba2ab8562b6204a17f19651c760818a361571",
        "swaps": 1148,
        "distinct_swaps": 1146
    },
    {
        "contract_address": "0x73a7b621090b8d7584cc40d1b1f016fb831949a3",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0xbdb7b4eba07c23cd2c7513b1d33726aa79739a22",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x91f670270b86c80ec92bb6b5914e6532ca967bfb",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x899f84fd8c3860c319b0d8f262ed8748c3a93ac6",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x3685eabc43d18ecf04b0f8ed75e4894b4dbb85b2",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x878ec11e7b410429d36da82ec5047e28b1a499d1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x30c64ea031f654c755bc3f6a6aa85f7e72c89c31",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x12e7ea0d20b5488f66e3a775b5f5bf2fed3c5edc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcdbb9670e5b0db23026dd68773b4d3f2ea8604bc",
        "swaps": 95,
        "distinct_swaps": 95
    },
    {
        "contract_address": "0x7b2dd4bab4487a303f716070b192543ea171d3b2",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x43f1ce250bb9365de893d2b6c28a0df1f9eacb2d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x55a51de746064c1dccf29ed205f4510889fd95ff",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x867b5af257cc976a49758da1550e7a1a94d9aa42",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x12eb539209f3a7c224643f6a3c69b294ca2bef8e",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf2ab58fdc48f85cb7daf22592f33bca0ed7bb662",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x568250ab82d9688a6494df97f078c621605c8cbd",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x2fb375f6516eaa6d9ef5645ef1482662d5a1e162",
        "swaps": 159,
        "distinct_swaps": 159
    },
    {
        "contract_address": "0xbe5fa4a5b77f8bad71148334cbfe5a045f713af3",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xbedee6a7c572aa855a0c84d2f504311d482862f4",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0xc0c76e154038f6e0c11fa47f22668a9798824b23",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x408b25f81d3720ca647dec19b31550b6a03ae1a1",
        "swaps": 137,
        "distinct_swaps": 137
    },
    {
        "contract_address": "0xa769c6786c3717945438d4c4feb8494a1a6ca443",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x7afcf11f3e2f01e71b7cc6b8b5e707e42e6ea397",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xab4f7a3199b2cd7a8bfb425941ead08facb6d617",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xf7c77c0048f52a6a249f8b57044e7de374c581cd",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x55e7adc472d945032b00911816a49dbef140f713",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x348f91c4d759763c53375d135ed69eb55b59d445",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5499effb0e811ddcbc87374ff37653295f949880",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xebca21ab28ee8a091cef2744e35b13a9515d2167",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0b4d65da21e71c873401a25d2a0b2acdfdedadc7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb73f2513eb15a91f337898dd4f3df57c8d894c91",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcd578f016888b57f1b1e3f887f392f0159e26747",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x1807cac8576468d96a09a2c04fbdf6fdf0ed2a1d",
        "swaps": 182,
        "distinct_swaps": 182
    },
    {
        "contract_address": "0xa97cc9ffaa625e18d12e2f739378e94120e73782",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x78fd833ec4464d3d6d470e5853dbfc2de0ca6f5b",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xfb5e6eb1c844b04924121fb0bf6b9623fc0b9f4d",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0x33cb90a27cfc91a6d0fa42d4602a9770ee0481d0",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x9b6550471fbf39d4708c407eee3fe3d82c6ac6c3",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x268f75394df9651fd4d3150986f277277b092b1f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x35fbcc2042e9f71cf3ecd4eb9d53feec98cadd66",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x87fc14649fa98fd2be4ee55467d88302a23b07cc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x155f7746e738522a0e8587832ba6b594b078143a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1726e66f66609fcf95cc1e3212df29f2eec54960",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xe49852ca8acc5250712374c2034fc8e3b5d46521",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcd353f79d9fade311fc3119b841e1f456b54e858",
        "swaps": 5629,
        "distinct_swaps": 5617
    },
    {
        "contract_address": "0xa660f17d6ac66d3300d365f1656d3e688fa38355",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xac09ae500817fad378afeeeff43432726db5b365",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xd11078f96a6e66dc241c31deb30961f5d15919ae",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x09e604a75583eba6c678d5cff354b41efe28d511",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2a24de64c5cef84fa0c0ca0405bb9a9815eedf3e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcce835c52495b4b2f7bbdbb199e1e3646dd92941",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa18c30d773a863e0de0636adcde1bd510e015b38",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4fe402a19dd325191e8954c674b24fefed97033a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x19498d2afa52e0eb96303295fe01b6ad1435cecd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x41d9de53ebf26f766229e42aa02904eb2495e397",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0xff2bbcb399ad50bbd06debadd47d290933ae1038",
        "swaps": 1294,
        "distinct_swaps": 1281
    },
    {
        "contract_address": "0xbfad162775ebfb9988db3f24ef28ca6bc2fb92f0",
        "swaps": 97,
        "distinct_swaps": 97
    },
    {
        "contract_address": "0x78413ed015b19766c8881f6f1bb9011ce95ec786",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x55bc7d9e44b730c4a42b52c818c805476156d9c9",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xe44cfd418d8b8207eb0a059207c807922d165c05",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x3f927e1675f204433bbae91423ccbcfc8d59f8b9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7ed97e6070fd14181ce1312ac7bd3343a9280536",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x6a1d57e2d63fd281c696d723cd10d98470dafd55",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x89176dc7b5aebd0d5efffc2592e2068266f4b783",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf0c2011a66da1d5ed0e666e25605ab50b333feb0",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xfef0866a606670758717327df84a1e0c4d2cc012",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xe11fd8b2f3f9cc5e59f711caf8671f2999dfde2c",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0x734a8c4c4c69804accc5474094ca9d78a12221dc",
        "swaps": 114,
        "distinct_swaps": 114
    },
    {
        "contract_address": "0xba268188a63dc2bdfde0bbccb8cbfec7c7e751f8",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x3f245c6f18442bd6198d964c567a01bd4202e290",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc94f2289708da36d034168c4089c4959417c6740",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd138452c44220a0998fb70e086c8449f67c5fc25",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa33bce1409639657428da534e33f54937ed2e604",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x16770ec3c88fb522a0104d601ba783ce3414d10a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x18be74169db4089155f2841fda8984b0779dc9cc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x81a3f6a138f0b12ecbdce4583972a6ca57514dbd",
        "swaps": 264,
        "distinct_swaps": 264
    },
    {
        "contract_address": "0x3db7148e24be957a6229404c3f7a5fdc948ae543",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xfc2fc983a411c4b1e238f7eb949308cf0218c750",
        "swaps": 645,
        "distinct_swaps": 638
    },
    {
        "contract_address": "0x6e957a7f712cac8f73d655569c6f4ff00599b933",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xdfbfea51c400e46ccff7b30aa93c9d30bed01073",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x11dadd62bdc87171d7960ec28f1e6e0c8e454ee8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5a5b8bf4a13129e4577389a95e74e61780b2070f",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x789e3d9aa77c1ebb882b953c7481f89f416230da",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8eece066dbf80d5d6cd998b9e90643ab3cb2c100",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd16552065a2f724fe485aae03bdf56bcbc09f3c5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf745a6358790f7a2ef5da0538b714cbbcc635c40",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2450293a5a6d373c83ba7a4a3ca0b8ec5a27cbc3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x296cd164ed967d95b876b483dcf149f5acf499bf",
        "swaps": 248,
        "distinct_swaps": 248
    },
    {
        "contract_address": "0x04f9ee08c2c9c0e6dad5e07f4ae0201d8dbeebde",
        "swaps": 82,
        "distinct_swaps": 82
    },
    {
        "contract_address": "0xff8a4bf12340b99af260bb0ba57b84ea57be390d",
        "swaps": 146,
        "distinct_swaps": 146
    },
    {
        "contract_address": "0x4b1a8bb68ede818f3f066a105f499799e9c36aae",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xeb9321b1a21f74c1c439e64771b4232743f2fa1b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x14322edc08a703ba74b4db1342b6b4c970c83bd8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7593d4f762397ad0702afada622501edf7d91493",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x2bc3ce6d7cfc0b476e60adaa1b27de76db95ee4e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf2c3cab161b19fbb7c209e5464016595606a19b1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbf196b4463b8cd0444c3b6faf34a913d9f2cbcc0",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb530573f64e82f00a8bf7b3b272122e3a13003ff",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x908b01538f2dc37c014400e99b92e02ce2b09e06",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0c5da1682cd781d507a216f12b892acf4e988d15",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x461681fc39b81ded6cbb18127e5aeccbd67fbd6d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5c68fde9845f2e70713df8c3e1c12921e982e33e",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x5ffc6183d25f9d7070ad0873056b2ac6730a8164",
        "swaps": 91,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0xbe9533fc37fb9d0496c54a524c8a674988ddc32f",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xde4fea426e045374a2f629a28561978dc86677c5",
        "swaps": 94,
        "distinct_swaps": 91
    },
    {
        "contract_address": "0x4dd9e157e26b6f932acdd9fcc60b883e12e87a86",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x224686ef51c037eb38aaf344b76c1098f3115280",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6ebe785459f0d426af690eca8fd12a6f88460f25",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x08d89894af5584387be40ade0c9c57e9224c2239",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa3c8cd771d6b8c27893fe5ccf9ff5608b36ecb77",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x85a4c266b87c3fdca0d389124dd584ca7868a78a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd5cf037212f54259681d05547dbf26a5ef6baef3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa9716a702fef5af84d053b5d3341181e5a25aec0",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x7622804ba94940a9efddd1546d12d8d0d6a16e53",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0xa7a6b6df754ebdfe469d5230f4267cf91ede1564",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xe71168ba4ab27bbd0008c446a7228af758cd6a9d",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x91351c266945cccf847d1ec5e2e354cd8270e63d",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xce2cb67b11ec0399e39af20433927424f9033233",
        "swaps": 10,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x707272afecb0e7a35c1a0175d274b8b40c4ef3c3",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4026895a93d720083e4469ee675156a8ff8d3853",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xbba8090e57af2915e57c0fdaeefb8bfae31fb539",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaa4610601010adb7314acee4a214dfcc283aab8b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc1baf0f523833594ee402043a2bd4fb0b58f606e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x80364f4d4574f8abd0556bb365fa651e6d705bba",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x395ab6556774e613ec38a15e004c6d0367c00ca2",
        "swaps": 71,
        "distinct_swaps": 71
    },
    {
        "contract_address": "0x4668a3f6d06240f6ea5271bebe8adcfc96ff3943",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc9b1bae5ed53f1751db47d730efaac67c2231a7d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x13f4152e9b719e07128ec2f0a8c65ab587471681",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x51beffd36eb8c81a9b440b7ee51f98ba9efda707",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3c3e1be14b3de2d0f7b095e9dd168b20ed75bb47",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd6057dcdb7039fa40056833cfdc681c2595c9c76",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x393c3a9a62d5d42e4d3199c7355bd26a479b4cc2",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x4684e054819d0f8f481188733a3fcbe7275cde2b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8226d768ff007a6bcefdc8b2cc811a93c05dbdeb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x14bd4f084358d688d055450549fa4fd915a2aff3",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe7df6eaf1660f1c4160801fe061f67fe6df08992",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe0a1fd98e9d151babce27fa169ae5d0ff180f1a4",
        "swaps": 220,
        "distinct_swaps": 217
    },
    {
        "contract_address": "0xd01c074c78e9647a5ddae2648f1a089b98d5380a",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xe6724250ab8d801ea5fad7f9bb595a73f3247c9f",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0x0e4f49281294b8ff2ee6cfa9ad811f9ed4f07109",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x80b5d411a36973747795d72311de14217d9b12b5",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x3fd0cc5f7ec9a09f232365bded285e744e0446e2",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x0b0548e99b99739be18de9d78819bbf6bb3b8d3c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x53e7d0e5177a43306ea9f46b225cad5042e1fe4d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x77f5fdafbb87acd90a8effdaac8ba7dab9ea4748",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4a41d104fb55030b6f288ecdcf2ea9440214f708",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x513b5c6c94f2db60cbf23ce5ef36f6e4c332bf52",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8163e4d98db30659a17d28a1dd117ddfe1dfd1a0",
        "swaps": 642,
        "distinct_swaps": 632
    },
    {
        "contract_address": "0x3f47fbae14b6b39e4dac557d0b87fc639110001f",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xc260b891375ee13512c42512995af97c083619c0",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x47187193994550f53beeaf0538005b38122fb54a",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x636f1543c0aeb5f3669fe2a92457e5e5faae673f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x886ba8107b3ff9fc71834c33b220c9410ec1abff",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x74fe2ea44ace1aeee9937a2fdc7554cfc9288964",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2fede863ffce33cc0d22d6680c8c822a68775627",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x26b1bfa14c35a9d3ab46debd86be9c50190bf005",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x19a4613685296f269ee36d8b44ec829ffabf297c",
        "swaps": 85,
        "distinct_swaps": 85
    },
    {
        "contract_address": "0x39a93d226568b841562566d06379d6e15acb19fc",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0x3cbd50ac0a2d1ca676c66965f92158305fa8472d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x123643a15bc993c11e91b6ac356aae35c21e9c06",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd37cea006cf8dba3b55a28991137ee09056440c9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xab0454b98daf4a02ea29292e6a8882fb2c787dd4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xf78b68d88c2fb96274c0e37e1ab98b05a7cc26f8",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x8bcaae7a15c0697b13f525d53e24812645556e80",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb46a13fd188976f8c3cd439ebfbf155ba443efd9",
        "swaps": 905,
        "distinct_swaps": 901
    },
    {
        "contract_address": "0x604ae4a5fb5164a2919807b41aa43e95ab79230f",
        "swaps": 78,
        "distinct_swaps": 78
    },
    {
        "contract_address": "0xf84eab6562f413b60fb202faff842037d59c2831",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xc23d96e17eabfef46545bc751750c8e5ae9b889e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x6685ea31e41c29ab1ca8950e2b6883744d1c3b91",
        "swaps": 38,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x35d59ac5629ba7acddf294010efc9434cb9aecff",
        "swaps": 8,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xf0d036b7f5e1b6c9acf3d9292eb1b7d70bf1ac72",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5aa943b44215f96e1c93d5a6f307c66c457cad2d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb4c584f856c596affe02263b3d7d3f26c9d8563e",
        "swaps": 61,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0xa6ec2a30067d72ad1e7b017642092fe89584d050",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x93030ecd895c7a06c38ffe7b69b69e6c909950f3",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xf8a85f679fb256859a1310c59a05de0848c66f18",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd6bbef7d7f6e81b0c25e0b9f36aace8988b0a36b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0a037fcc4e1a4e9deccac5c7dbfa69cf1fe2afa8",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x885eb7d605143f454b4345aea37ee8bc457ec730",
        "swaps": 97,
        "distinct_swaps": 97
    },
    {
        "contract_address": "0x7e0a82271e854cce590b1dd52f4d592eb6e51da9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x509645caa3d644ad1d5b8a6093f968013d16b823",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x3f54c58092e9735ad23cf296ee3af81f5a44a5bc",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe47325268af44b28753050aa94f838f4a6487f71",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4b6feb646c6cf1994ccf4eeaaff215f13a9e78e5",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xdbf5d66d77a83b96763c965d193d0fdd1f8a184b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x70bac420150c6481cfedadc0ef0ee509acad2f4e",
        "swaps": 355,
        "distinct_swaps": 353
    },
    {
        "contract_address": "0xe44ffbe2e511f760cbb2b1aa1e88910b4ca52505",
        "swaps": 150,
        "distinct_swaps": 150
    },
    {
        "contract_address": "0xb7aed3ee120026a7fa287dfd71baa81a35119727",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x740217d6500589adfe6fbfccd30dd1941b837779",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0xb187ad7bb9933bc4152f3da30e18600352d65792",
        "swaps": 50,
        "distinct_swaps": 50
    },
    {
        "contract_address": "0xdf641eaf424a9972e92afd91ac57d28ea5ba05b7",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xca3e450d0107db69cd7769641f62f419c42d5332",
        "swaps": 113,
        "distinct_swaps": 113
    },
    {
        "contract_address": "0x832acd5cced33ca5c2f10ffad4758adb8463e3a8",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x3b02a89628a375faf4fc5ec83566801e9d9dce02",
        "swaps": 269,
        "distinct_swaps": 267
    },
    {
        "contract_address": "0xc6f1cdda59a3dc06563376b7953f79d30ea36e7f",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x70797fc5b1c04541113b5ac20ea05cb390392e30",
        "swaps": 61,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0xf6a72bd46f53cd5103812ea1f4b5cf38099ab797",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xce906350d6ee6f8acf0c9e183efc50248c4619a4",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x5fcdcad0819ed1e448f494406cb98bbf88dc2c0f",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xd7137b77429038ebf0972f88d86f188272a81262",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x40ee0fab7a86e9162f28db07873cc585d147037c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x263ecfb224d1b74be0a6636965cb4d714ef826a5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x157d5eab254164de28f41cd50aa484a0734d7604",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb63b3aafab738e19ad5fb0d89386ffb4be018851",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x67db9aaca8d8225a2d1b5603182da8228270b48c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd6b7c59b452dd9cac04ccf3af806c7e0e600949f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcfefcc429b4b0197a3cd5b4d3887fd191b05da66",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf9739d81c5060cc48b74964819ea428efce098a5",
        "swaps": 153,
        "distinct_swaps": 151
    },
    {
        "contract_address": "0x1a9a2fa0d74331a4f20624f9647e2a4c8a032c6e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2ebda57edd4d4a5edb3fa46e960e7cb11c3379ea",
        "swaps": 89,
        "distinct_swaps": 87
    },
    {
        "contract_address": "0x53ed6d365629c8b4aabacaa1a8469cefb81dbdcd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x849a088f8e5e8423cee0b0420dfb150dffce4c5a",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x143cd893fb8c5f2639df444f29d228d527227f8d",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x5fa5d4de5d2354763e11d697da9d7cfe76d30ca4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xafc9987de0e7c38ba6b063f87617100545fbcf0c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdbd45b1f645e0191fadebfe35f0ae83b7fd36459",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf082747f85e17dbd6917d8cf157e3ff01d36f8d9",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x78f394e600c4585a4a23dd11c1cd651c3521f4d1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xffd8995e1016780af85cfe5c29cb8be77a64bd15",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x224dcacf75a4cebf1959dac1ae9761ba6753d87f",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x579f00114d618caee47cdcb9d43ebddae2a032ea",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x1947fb41e5be68e6e43fdd96d8ac8553d9061d23",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x8ed2dac7145865def7838623f715c835dea154cf",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4d89b4afc3d47ece80158ca94e6354131ddbe731",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x81e5d604045731f6856aa9d5665f693e12f26aa7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x10a6f9d4cafc6ef8da384429e9a1c4f662ace79e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0a9d9eeeee45b82d96416c5c4f6b4ad9104544e4",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x5c981300a2fd35aed8427b2d6d004e0ab11602b0",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x75d4c0318aa29ad5dae306069131571540299421",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xc45495b7a43cef1d229dafd044217c30915a4ffb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb176697bd3c75164b973b85aba23492fa3b9fbb5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc30d6bc42911aa21a63e51c7121b33b3e65cc3c4",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x9eedc252ba8628273494a12a820ec84028de1bc8",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x6c4a2591f7daaa2583e62f9c64a956daa0cf1c5f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x136aced242378860f6de72ffb6843cf9e080aed1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd9adfb86df3d38d32c384dc76ccd7febaaec47a7",
        "swaps": 63,
        "distinct_swaps": 63
    },
    {
        "contract_address": "0x7a2a529bc56eb719a97cfe7f554cf541e2da7958",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x80fa1963b11b0a32cc2fcd3320986027a1e5eaac",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xe3108cdcfb18e7b3e558b37bfd4473cbde1fd05c",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x4cb6fd3f9b29ea403cbc4e11b5703e66e1c7b35b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3b001d81c74b26ae366dbe232066d905c53e1dae",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfbabcbbfddedac937ea9ceec9ffdb2fe160f7717",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xbd7af70927022d77fe86b82c67dd2f88b98a9447",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x42837cd90725e516b1d52b1854234349b78c0027",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1dbba57b3d9719c007900d21e8541e90bc6933ec",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0a654507a9e7ca1afac2e7e387acfabe407aceee",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xffcbe548f71a6323f557df738e75e9984868395b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4a35582a710e1f4b2030a3f826da20bfb6703c09",
        "swaps": 327,
        "distinct_swaps": 320
    },
    {
        "contract_address": "0x35c141fc2d1ba19c844959e18519130f930762ba",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdf298db9aa32641123c395b7c44d1d5b94ffdb64",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x51b8cf91a5427ca7f4c9764f439173ae4c024b07",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x830ad899ecd58e08fe612a9bdaee31433c4e86c3",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x538a485de855e9239570aea1def9adbcbb6af1f8",
        "swaps": 107,
        "distinct_swaps": 107
    },
    {
        "contract_address": "0x90a09fe272540ecd34661b91252f2ab4b7f7a4ce",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xc37899901ffdef1b6baf95fd4081d82942a0a85a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x422e99b99f35edd9763bd8f2bce4573926dea21f",
        "swaps": 57,
        "distinct_swaps": 56
    },
    {
        "contract_address": "0xa543ba3fd79a03788e5521a0ce48b3f2bf93b2c1",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xdf3254ccd9f3f461b9a08ae97622b80e792bc205",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0x8c39c7fe380bdf86b6c3b20057fe7a0bc1e82393",
        "swaps": 101,
        "distinct_swaps": 97
    },
    {
        "contract_address": "0x6c06244ca659d39ea28154d9da7d2185ae33a56e",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xcc68081aab6200110da134217f917880d8832519",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa09e6a33b1ff289f7046b13d25e1659ec892ed58",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x48831ea41c2f2e9b213b756acbbfb70254a6bc61",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xc0e53bd0539b7f2dac98fafd5bc5f65a491c16c8",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x6b0ed1d7f747c16ffd24880b2b46379d62bc9498",
        "swaps": 62,
        "distinct_swaps": 62
    },
    {
        "contract_address": "0x774d01981df0d69625fa7ed1c475a16a97c00b9f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe2fec5e707666ea1e2abc3c8662e14007e859e47",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xae577ce0c78a6c20f208c5c393eb5fbc61df6e8d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x1c2ed161ca50a610e64f93f9f441f45facb0b46c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x19fac61bbffb8357b6cf1d2768e07431dae2022a",
        "swaps": 3,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x22de0abba3daa89ebb2aafa7ff60596404fb83a4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf203a8edbfddeebcfded0cc9698379becebe0ffd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x29315b444a0730cfda55bc4f297b81cba7b13950",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6ff62bfb8c12109e8000935a6de54dad83a4f39f",
        "swaps": 597,
        "distinct_swaps": 585
    },
    {
        "contract_address": "0xc6990738c7e77952aef100bb56db64e8ad74de6f",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xb7f111a117fba75aee58a94a1ec0da59e5e6ac6d",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x57b6a39c06dff5678266e36dca2cfa86da675894",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xd0fa2eaa5d854f184394e93f7b75624084600685",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x493fde625f66513cc01fd24c3fc3eb2578206af7",
        "swaps": 14,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x7c6616c63decc680be7e27860749c29ea8f542dc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x293b12f0d450c4f72eaf66d3cf85bca26fc64db1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1697d88dda5e913d9a29111e858292855ca0d9cf",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x2be05ad303631627a5fe105e250d52a0ebee32b9",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x42286296c3ede3f6a0ec4e687939b017408cf321",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x369582d2010b6ed950b571f4101e3bb9b554876f",
        "swaps": 967,
        "distinct_swaps": 952
    },
    {
        "contract_address": "0x459d872dfc58ae01e1a70355f71d91951671587b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xfcd48df3e18ad8558ff6f642bfe9101c744b1481",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xb22ca72035160840e86e3e3fba5e96fbbc74e222",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x1cc94f17992a41485aed368afdc22c91483f08eb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc97a757a1b26f47f57a4f9009f7a4645e673c56a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x287e9a601a257b24f8d718d08612e9d8ead7f5a8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe16498af4b6132a82772962f9b97d0b8fe40f4ff",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xec9ff9db4061e4de8cbff5bcb6860e7fb52ea3f5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1d021149d98199087c99caf7722919db7de4e29f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa9c1794d4b58784ee47163cf1b9cd57b14a6649f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x643cc040bbf5eee0ded70d4f63173f2cdc4e89bf",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x9846eef116cdb9ca4db2e203bcbbc4345d3e5258",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xac4ff32b81a9c4f13865fb87531cf46dbe7fc5ad",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xca7c166c4d62c8f66a3b3881c2bbe0d75f6d4d09",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x25d56e2416f20de1efb1f18fd06dd12efec3d3d0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe43ab6540c0929ef29d216a34ab1f0eacc5c3825",
        "swaps": 1226,
        "distinct_swaps": 1222
    },
    {
        "contract_address": "0xe69fe44b087eab9d0f1cbdcf63c1b266dcc556fe",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0x545257f7266302df3f30daf9ccdc85c27c832629",
        "swaps": 67,
        "distinct_swaps": 62
    },
    {
        "contract_address": "0x7ddf8a3987b881ac37f1dc287721155414f8d20f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd7ed7fff46f6eb5575f7c8d4a8ac3419518d985d",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x9b9b6192f4adcbf039c1b07aa5b237d55871301d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2bfe004b140e79ec500c1d9df02b0c1c6acb2075",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x97e2c655c847cbba56aa3dbadc8782dd7bc21afc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1b68a1b767bbe63467a419104be731421fd720ab",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfe3a75416a889449f89f74ad7181892867a062fb",
        "swaps": 496,
        "distinct_swaps": 486
    },
    {
        "contract_address": "0xb2e178aa4fa1f0b263a636e8b61e10886fc1938b",
        "swaps": 65,
        "distinct_swaps": 65
    },
    {
        "contract_address": "0xe4eb4261a4852c09055a6a94e2f7e8289425f0ef",
        "swaps": 186,
        "distinct_swaps": 186
    },
    {
        "contract_address": "0x495c64aeebd1c8e7c5eae1894ba901ff734f2d82",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x4949107fbb9297ad1a0c3203b5373deaa910e745",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd9939b190001989b8ee7c146429b1d8404dc6bbd",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x2394f0ed9d41df14062ded28cce312988c4e503b",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xc6c6325cb9e63b5551b86a082a4ba30fde910113",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa022ae9cfadefd62d70b510c27dc3d5db67ca43b",
        "swaps": 364,
        "distinct_swaps": 362
    },
    {
        "contract_address": "0xcbf71c04148e5c463223f07a64a50f2df46b6cdc",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x606a082820aeaefd267d0e41955b79fae18c9de2",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x74214f5d8aa71b8dc921d8a963a1ba3605050781",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0x9a91a7286ab25c56c3e2af7a22f321a902c0ecdc",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x102711eec46f409147997259fec76c5f9f647a22",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0xeec73ed385a432d475e4bf08b0c6f83f36c174fb",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x82ca0a9a595a4388e8bc012a9b818c30cc084882",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xb5d8a7c5678632f1937b592c0398f4e04d72012d",
        "swaps": 8,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x7bbf101cfc85eee61eed9b7d756b345ebc14fff4",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x5bc9739288d8ca260603f16a6e153d61844d7215",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8bfd0b97fafe8ba546e54cee23ed83e3743e613b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x635cc89989282f8cdc2be76ce0052d4d0885310e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x39e1500c4c4101d764804d809c91c6d2cc0a5317",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x140a56f263e20ff7e0cfdef9485d849a77944b16",
        "swaps": 153,
        "distinct_swaps": 153
    },
    {
        "contract_address": "0xb9e710def6dc69637e9b91dacef590fece97941f",
        "swaps": 211,
        "distinct_swaps": 210
    },
    {
        "contract_address": "0x57430800827cb8259fa6afcc27bd55d9b45b53dd",
        "swaps": 40,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0xfb09801b10298db9663d2790f5d5bc6afa354497",
        "swaps": 145,
        "distinct_swaps": 145
    },
    {
        "contract_address": "0x7192bd52bc2f9b90809ede99e3b92c0783bf4387",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x2b01d17fb05f2780f0f5941e219e368aec3cf03c",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x4c44ba45e4b1536f5fac0ff06182ea3799c3cd40",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x0908e17fd3ab85f107457cfb71d58d95efca9aa8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x57a3b94ed358c2ed240e2eb2e6e01a96f339fd45",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x43a8fb5459df951bda1c252bab423dacb23149c6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2460cfec56dfbdb957e879cbb5945caa1202f642",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb3c2b436b5097b5fa23bbe0937ea1904a8913bed",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x042a267a5f701666fbbcf69c73923f564a09c439",
        "swaps": 141,
        "distinct_swaps": 141
    },
    {
        "contract_address": "0x30ed56055d27b3f1a1211946dbffc7a4b3ec5de9",
        "swaps": 254,
        "distinct_swaps": 254
    },
    {
        "contract_address": "0x9a1106266e154c58c99fac91d00ed4dcc2aba676",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x32be8c720aad385e908e661f1cb6db682deafbda",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8ef58a4068652c900816d25e32bcb6eb36bcab71",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xa9137d4267e99f8445346a4eac0bcdafe3008892",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x96e04764e9a1c7afd7bc1fa09fecf472ac1f4051",
        "swaps": 64,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x1587663e8f475e69ea2dbb38482c8c4ee9f388fb",
        "swaps": 82,
        "distinct_swaps": 82
    },
    {
        "contract_address": "0x622753917443b4c7e62ec7bd9933b2d16a7795e9",
        "swaps": 188,
        "distinct_swaps": 188
    },
    {
        "contract_address": "0x580da9c2b04e30d79ffd130698909ef2517cdd0f",
        "swaps": 86,
        "distinct_swaps": 83
    },
    {
        "contract_address": "0x22e2bdabeba9b5ff8924275dbe47ade5cf7b822b",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x30eef213d4b9c809f5776ae56cc39f02f19f742f",
        "swaps": 15,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x90139ccdfe463a85cfd34823465227f78c280cea",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x50a7e903627acbcaf018b198b2ec738bfab848bf",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xf67de5cf1fb01dc4df842a846df2a7ec07c41b93",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc98c5e06a3b96af7a545df867aeeeecac429d4cf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd9400389f7f6c2e7523def36fd96dc450656f330",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x3c986748414a812e455dcd5418246b8fded5c369",
        "swaps": 686,
        "distinct_swaps": 686
    },
    {
        "contract_address": "0x23baf6d86c80eb18b1799763ea47eae6fe727767",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0xf25c87f3c4f76693289bcd4c324e75f5a8383d58",
        "swaps": 136,
        "distinct_swaps": 128
    },
    {
        "contract_address": "0x44825bf3b74695bd72ed247d62dd755e67b7ed87",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x5a87b1b4c193b060c607efc8242384f755d048fb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2eebe239dee543e7f9e00f6581bf053c172f50b6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x424fb8c7ae0489bafe70403b76a75892bb5b1be1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbdf8b03bc5fd648fe87a2b592c41155d3bdcdbc3",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x07b796adc80f1330474e5bc280556354dbce324e",
        "swaps": 153,
        "distinct_swaps": 152
    },
    {
        "contract_address": "0xe0647a901fa4fd36e3e32d56739fd6767f74c4dc",
        "swaps": 93,
        "distinct_swaps": 93
    },
    {
        "contract_address": "0x1549e0e8127d380080aab448b82d280433ce4030",
        "swaps": 78,
        "distinct_swaps": 77
    },
    {
        "contract_address": "0xf7f372d30244f418a2f669973a3f4e20e89138d4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x1bd82304c456401137beb805ff0bc5d887cea37f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x40a5df3e37152d4daf279e0450289af76472b02e",
        "swaps": 62,
        "distinct_swaps": 62
    },
    {
        "contract_address": "0xf98a915d088cdc3f1ac593c8dec9d7584c14822a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2980840598e47e5f45fbdf5f8924b8e11ca5afa8",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x844ccb4cf2643f25fb0dc197ab43df922d609828",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001",
        "swaps": 302,
        "distinct_swaps": 302
    },
    {
        "contract_address": "0x62fc1e1fdabc0c9f2b096019e2d98204da049457",
        "swaps": 286,
        "distinct_swaps": 286
    },
    {
        "contract_address": "0x019011032a7ac3a87ee885b6c08467ac46ad11cd",
        "swaps": 970,
        "distinct_swaps": 969
    },
    {
        "contract_address": "0xc74e7a5cdbf0c916d5bffa7b6bddd43ab46e72ea",
        "swaps": 152,
        "distinct_swaps": 151
    },
    {
        "contract_address": "0xee321334ea2eacb78f04904ac4733cd301f53c6a",
        "swaps": 303,
        "distinct_swaps": 303
    },
    {
        "contract_address": "0xfde7ea4efebe84b9957aaa2309e2fc4ccd73caf0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3d96af8dfe8b32e3ff0732c1e5784fd971e9e41b",
        "swaps": 10,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x94d36ff31a2ef6845eb40e49436271b90103d8bf",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x17baf0a217ba25182bb8ad7308b5b968865f197e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd841437e8ba31dacc76103e50fa18a90ee6ab5d0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5c26e61c6153805b073beb185319de61adbdcb98",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x8bebd067b8f17699707b02e37956f846dfb0932a",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x2310d65f9003f9f7ec974b89772634548f4905a7",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x15918043872dabcc3dc9a9b1d1c0f96505e6a5a7",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x65027b18b7e0a4cae17fa22ff0497ed6bf46f914",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x030fd6ad6fe8a61e34936e7552f83149b0b7b9ef",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0c8a72180e3225c5adcd45511d43029ac982392f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfc53b26adb279c1b4e677189c54c06123583c032",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5701026955d90e9d9ea79eba2cc70596a6a7accd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xef2b7c345a34f8173156a420c55ffb8ebc246af2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcdc0bdf31f10e4421986b4d4d3d2332c8b4dca07",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0x517c767c229d2057b163ebac4de2237136c293ee",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0x93054d6e998294097e9676d8af1c26db28c40652",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x0ee963d14ff760b665d3f496912b5c8ab11cdc4c",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x16d2102dbc2ef24d3354684127d92712d78af169",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0705e673013b776ff3ca69720a76f4c2bacb35ef",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x06482d55a7fa6ac765ca5c53cca34d9d2970f9d5",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x545fd0c5a32a8b29d983262cb75bf74917658dd1",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xef71f798c15f8c9732488e109bb511144088bece",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb39f8abe9fe2b93bf193f1e5aa6efabbcf4e41c6",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xeae59c170902112e65d091a7a727dc56edaa4976",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xc717a7d02b974bc8dbb6579b40b60f0c8be87893",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa9dd1f824e97f6489575566c80bac2ec7cefa709",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x400190e0111694c8cf35ce704aeec7433ce175b7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0cdf4195ed44fd661b4df304fb453096671b4099",
        "swaps": 149,
        "distinct_swaps": 149
    },
    {
        "contract_address": "0xf3031eb5c42559dcade2208e58fc3e6a760169f5",
        "swaps": 116,
        "distinct_swaps": 116
    },
    {
        "contract_address": "0x1bf9805b40a5f69c7d0f9e5d1ab718642203c652",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xeadf01bcaf686cfd772cbacdd66488bfdb09ef36",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0x02dcea7257528cbc8941557e7ba729aeba4b39aa",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x515dec2c0a12cee7614e05bbc120a407d6da2078",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xab4844911bbfdc725359bb70a6793f7a2f90804e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbe62da964d84c0c662e015209946b92601846b46",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd7871efba6888fa907d6c6e2b3d93fe24b9410fb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe2fee46bd868c85a99c79f18d6c3ff441d0e3cd6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x486305621f07f5b3c598a48c31aaf3756d7095d5",
        "swaps": 83,
        "distinct_swaps": 83
    },
    {
        "contract_address": "0x2b1b874cb749472b963a80c5214b3cb3fd7021a8",
        "swaps": 64,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x02f258533198af74e43c3563db3535222ec9cf4e",
        "swaps": 31,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x7b3714a446e2204508b21c3d6d2beab9712ed95b",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0x247112bd688d01585d4a67e2e6961f1a1830aa3f",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x6bac7ea93015a6c0932eab28295319d3e7e9fbf6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdfb3d129f32b32852e74322e699580d75ca4521e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x835bffc17a49368ebf75d9ec596a60860c8d43ea",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xff588ffad2bdbf7c9afbfd87739472e7d4a7753d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3e5a5761ecf0220686861c77ab263bc9e8d1de7d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xae1bb08756d334ccdc39b404997ea51b6f836383",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb0fff5c89ecf0a3760f1d39cf1691e33a539f9f6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf0ec25715701455f617e5d1497c26a31171641d7",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x184496766505b40b381322821f6b28ecc4278b3b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa79983daf2a92c2c902cd74217efe3d8af9fba2a",
        "swaps": 66,
        "distinct_swaps": 65
    },
    {
        "contract_address": "0x107e96325bc6cfb86e542c79b215b64df58e6b53",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x36285a57b7355ae81dc07993f2eafaa1461b25de",
        "swaps": 172,
        "distinct_swaps": 164
    },
    {
        "contract_address": "0xdfa267c94ef1f662eddd94c35c08c0ecf0ca0542",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x069a7ad245d7e2f0f4227844ad7976daeaa5cc07",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x75b2f458e33922bea5572ee0ad9a9e24ddff5888",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xfc521765e52492ae09ad4521a5e11f83b083fa02",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xceb807e355f6f3052986757f29f925de06bce10f",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x495c54f895282625746f51a0be1078eee86b51c6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa4395cccf2e7f25d7f85fd382fc069a0b60d274d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1a382823644015f66202c9c0bf03d09bef56e10a",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x6f21996181915d688c787a1ec7c987e2a31b6829",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xa50ad00fe9462ecff9705a6817e51db15954fb07",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa3d8950fdd601e725119911f50e3442bc03434b4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xaedb51016dbee264e456d09008f1e904e26afd2a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xaa29538b002548571a8d125a4a32371c780dcb3c",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x65005a941531e8167fd7a0fa5342440cb2a65483",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x25581bc3886036c427077936dbfa46649c831f5a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4787b7f8da0188b0cfdf541e88326bbadbf047e0",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xa77faa29c81dc815773b2ce4d1ecf5d13f94e759",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa4c3c627959a4d7cb2f09c10aaf6e2ac33ea4fbc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x00e6dee6a87f0324d3b12545a7cfdc0fda003fcf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4520f3fea6edeb174869f4fd13cfe2a3c74baf6a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xaddd6bed667c361087a97b34b1a0da4e0d0131ed",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x17a7829cc1167ecda8b9668414a5405050846f8a",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xb980171e5647a8531d3b28134622d225bc3cdb82",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x30e5e9f09ab58554d827a1123c936f58aa254711",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x0d5dbe6d0ea7584ac0cd04b0875f7a7c7678de25",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd59c266e6f359f06bdc844891df7cc42fb2eb28e",
        "swaps": 21,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xde0e508e160c42cbafd23edfe07cb141f7e3696e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9023c9c277fba9d3d6ddf155027caf4ac3c85160",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd2105fe5f1b631daf2398e918549758cd181ca7c",
        "swaps": 308,
        "distinct_swaps": 308
    },
    {
        "contract_address": "0x8b1fd78ad67c7da09b682c5392b65ca7caa101b9",
        "swaps": 199,
        "distinct_swaps": 199
    },
    {
        "contract_address": "0x69e571029d52b04cd0af8a57a6fcf5841c8a189f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x971e5fa6c9bae8eb66c16d726af48aeb0d08ad7e",
        "swaps": 118,
        "distinct_swaps": 117
    },
    {
        "contract_address": "0x3f79187726f13d894ec63e3a70f10ac8ce596318",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x7847350b4c25f564b5a165389fdceea99e1ed3bd",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x62e26d79bec552412af544a8a2918122c6c53e59",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xaf1666b074e96b83eebb1ff3873c4487e1112090",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x420357d077547acac3ad28238ca6a7ab628079d9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x32ae8e486d41e44b1ef044ef0164cbd3628796bc",
        "swaps": 183,
        "distinct_swaps": 182
    },
    {
        "contract_address": "0xdb995f975f1bfc3b2157495c47e4efb31196b2ca",
        "swaps": 107,
        "distinct_swaps": 107
    },
    {
        "contract_address": "0x023c2538f23250944ad2d1f12510896dd4f51323",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa0ce681ee77c34f60fb3c1869526cdc7fb24b5eb",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x3a8a6831a1e866c64bc07c3df0f7b79ac9ef2fa2",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x57565909a1d43be72b3eff9f39dd713212a0132f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x6a4c2b846d24996144dd961149105eda42726f28",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd2f79c77cf8e3590606d48430931f99ca8021a8f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x09b4e3efc40d49fdc114093263c78db98b8d8fe7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf9ce5121761d183519b031648f20c4e690afb95b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5fcb390b4422f4ff7940c23618a62bf5f69658a8",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0xc4da04f471210063f8c79a09d6152d63085451a5",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x26e425994d6d5cc596a1f550b1ffca5beca8eba3",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xc4e4b99a6c738313a72d63a854fdbeb9cce9ffaf",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x0b9834e941301b6ec3fe01ff464b63a10110fbc1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x59213df839990c599073ba69923bb91ad5a70a7c",
        "swaps": 122,
        "distinct_swaps": 122
    },
    {
        "contract_address": "0x9a0d115a4b9a2ba3c8f84516823f49a3fd59a180",
        "swaps": 67,
        "distinct_swaps": 67
    },
    {
        "contract_address": "0xbe40f7fff5a2235af9a8cb79a17373162efefa9c",
        "swaps": 139,
        "distinct_swaps": 139
    },
    {
        "contract_address": "0xf3b91fd39051c1f4bb425ffc7cb3b29170aa50f3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x230f79c4ce29cb015c2e1b040e8d42eb88141411",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xebc33810c0f4261abb8d9e0fd39cd7d4f83ebc62",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x21421eff2e9d688b1ea295e80849b42242160984",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xb0c4464f5351bb9f712ac3e5b21cf97173e85574",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x396e655c309676caf0acf4607a868e0cded876db",
        "swaps": 312,
        "distinct_swaps": 300
    },
    {
        "contract_address": "0x159a26a44c50e5d6a8dd87d050c832d9179dfd1b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x1274de0de2e9d9b1d0e06313c0e5edd01cc335ef",
        "swaps": 310,
        "distinct_swaps": 299
    },
    {
        "contract_address": "0x2c2d525ec776a72610d38d504e47303864c4b1e7",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xd904119e354d272510e3ec71b71e71b5d64afca9",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xddb04cf999e851f29dc014e9b0823cbebee32c94",
        "swaps": 120,
        "distinct_swaps": 120
    },
    {
        "contract_address": "0xe9ac3649075cf4f2241e759db527e2c5fa98ed97",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xaeeea3ce755ff014032e92a7c97ad186da9533f4",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xcd2e35e7c555c563f18b46355468ef028e5e3da4",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x63d22c55bd1107eaabab6a26e2c36ff2b8699a87",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x6436f5e99be830d10387299ffda076e87a06986b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xca4cf8e84adca919a1c6eb5458e165a2a9aceb15",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe463eb2056e9952e4c0b661f0ae5cb28772bc794",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x096c5ccb33cfc5732bcd1f3195c13dbefc4c82f4",
        "swaps": 1368,
        "distinct_swaps": 1354
    },
    {
        "contract_address": "0x7ea654e73208ae654f46dab99416ec6b32ac9cd4",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xeadc377ed7b4f7eb26beb0a3f3cc2a574462188e",
        "swaps": 67,
        "distinct_swaps": 67
    },
    {
        "contract_address": "0x6512cef10d5314737df3af12fa77d6fd671e5146",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x4ce996fc257b5a3f7a93c1d4f1d33d4bdcd581f2",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x13de0b6021af9b8c682796589054c683030f9008",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2c359f25b6f9a68eede31cf7da68a7bffd7b1c13",
        "swaps": 450,
        "distinct_swaps": 396
    },
    {
        "contract_address": "0x76effe76880b1a61740c8a2608b8ff40e8ad7571",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x32d958132d8ba568d7e1911e502fd52b95757b9a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xf2055643108305d6a56278f5f0191cd0286c7edc",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x24f455d8a384f57667d7273232cf4bca4a7f9329",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x7d8667001de41872c5ccde94a0957b0061702bad",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4564f5cc77a6e8268149a94f8e0327e671708cff",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8cc823f7fa1d552d43ffe186a872185789a216f5",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x291a6d0c526e858cf074fc4a8b1490a63aaf87db",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9f9ac947679c9e7ffdb033946a33f828ce0fb7ee",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdd6131fff68d6a5831da7c72b9c20b46292300ca",
        "swaps": 1551,
        "distinct_swaps": 1549
    },
    {
        "contract_address": "0x74bf9bef07ff54f5c70786fa4bdad45a3cca5625",
        "swaps": 481,
        "distinct_swaps": 481
    },
    {
        "contract_address": "0x386d5b630abe3d0b57f1610ffb171042ca7c2593",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xe1655a3abb82474f8be74c324eece1603bb4f9f0",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0x7e02a82a9f2b96ee2836c5c64c44e0ab13020f4b",
        "swaps": 23,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xf4959591141f08ceda592fe6b51f6b1cddceca17",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x5aaef1e2bb85c1edcf21265b7b0152af8820c8f4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x143b882e58fd8c543da98c7d84063a5ae34925da",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x081b8b431faf6e94bc947d50ad022a05567000f4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6f9e92dd4734c168a734b873dc3db77e39552eb6",
        "swaps": 1716,
        "distinct_swaps": 1713
    },
    {
        "contract_address": "0x7baf833f82bb1971f99a5a5d84bed1d5d0dedd70",
        "swaps": 1646,
        "distinct_swaps": 1644
    },
    {
        "contract_address": "0xcc26ea8e5a96c01f25b5e59e1719afa4c589afa6",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xebb29b991ab4ef1e8cc72a4208bff46de6f4d689",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x2929b2aad167ffcd5c107255fa015414b9ee5e5a",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xe7519be0e2a4450815858343ca480d1939be7281",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x8390afe8ccb90f2c7a239768cee11c7986004a1c",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xb060f87b0434c27075992dce6dba006b28adaad7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe27855cce2ddc3a2e44f1ad3cdc3ec6ce4903bba",
        "swaps": 345,
        "distinct_swaps": 340
    },
    {
        "contract_address": "0x04031f5dcaff9d566a8a9650345d98c1dadfcd9f",
        "swaps": 61,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0xa28864af52aedcef717c34bffca2ccf9d6aa23cc",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0x9eb1102d8f3c00be588bf8f528b9adca7f5aff23",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4f17963c1726d019d3eca4a9b5f81becfeb1bcdc",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x0ac18328a7bd416b02b5658c05add6e30cac4820",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x454589a2e8c3fa8d0154519a340a20681505937e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xce1ae3e13614be4d70e62788b640413859de0b1f",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5068c302d5dcf4d2ed0ec69fa7635abad0bfda16",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd0ae843156385a411f7de6e7b95a35c9c5e870ea",
        "swaps": 355,
        "distinct_swaps": 354
    },
    {
        "contract_address": "0x91047a73fa5c16c7d5f98cd120b2d980043dc21a",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x87dbeb21f704f9bfb05de0dc35f579db9f70f4d5",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xe718cd0bcadc9537328a35569172f3aae2dcc18a",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xe1bebbaef1e1fc21ec3cb0e4bb6b154907e4687a",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xf66d967a0be96c6ffdbc6033589b61877b2f7dc5",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x4b17d8972c92a1e6bf8fa6afe1833cffb4347908",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd08244e604ca67e2f3fa9b8d3b580e751c42fbc3",
        "swaps": 222,
        "distinct_swaps": 221
    },
    {
        "contract_address": "0xa408a751b6d05d1649c5bbd7c38842fb17ea1846",
        "swaps": 243,
        "distinct_swaps": 239
    },
    {
        "contract_address": "0x2b633fdad355c8e2aaabc606d17d0f63ca0070d7",
        "swaps": 154,
        "distinct_swaps": 154
    },
    {
        "contract_address": "0xa95282785a75257c068220c85f6b23a63c773b5a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3bbaddf5e883c3abbec2b8b75902508b81ffaab8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x94579c8ad5c1ac77a04451223b20ed55e379c6c8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0712323f8451cf7acc1141083baa60cc70dc32a8",
        "swaps": 392,
        "distinct_swaps": 389
    },
    {
        "contract_address": "0x94fed348507e52c6628c4a8ab94c89cce9a628e8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x690a87ed8972e451e755b8f2dc1fc2b28e3c6566",
        "swaps": 1025,
        "distinct_swaps": 1024
    },
    {
        "contract_address": "0x7c0cad531fe33fb28d48e016339aeee4f3b0f606",
        "swaps": 55,
        "distinct_swaps": 54
    },
    {
        "contract_address": "0xeff9df0b108bd35bfa7ecb48d893e86f79c9563f",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xb475a5d5c5e294b255815c8dda3700d419dd8d46",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xfd5c2eda66f7cfcfcbf87b6b1d6c395853e323a9",
        "swaps": 60,
        "distinct_swaps": 60
    },
    {
        "contract_address": "0x80f93221e875d14aeddfdfc778ca755ab3562ce3",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xa8dc72da287d3069806de6105ca85525b03de00e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x83695ac83b14376669dc05456fd3d0cbdedb4bdd",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x76f53a8710bb7d188d2424d81e2c22e32cbc5f8a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1bd06b96dd42ada85fdd0795f3b4a79db914add5",
        "swaps": 788,
        "distinct_swaps": 769
    },
    {
        "contract_address": "0xc765eca0ad3fd27779d36d18e32552bd7e26fd7b",
        "swaps": 96,
        "distinct_swaps": 96
    },
    {
        "contract_address": "0xf1464fabaffff79eea51be4e9c883c1bc5737ab2",
        "swaps": 160,
        "distinct_swaps": 160
    },
    {
        "contract_address": "0x92bb3233f59561fc1fec53efc3339e4af8e917f4",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x7242e19a0937ac33472febd69462668a4cf5bbc5",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe11bd5a3927a2a4e55266959b348c39ba9eaecd4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8d25fec513309f2d329d99d6f677d46c831fdee8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5f22ebf54fc1772585656e374ac4b1d9bdfcbc21",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x17dda8e37aed00b33adaa8b32313ab0b76e0c11f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3b480d50b9ed88b4891e066681467a73f78d8c22",
        "swaps": 45,
        "distinct_swaps": 45
    },
    {
        "contract_address": "0xb5846453b67d0b4b4ce655930cf6e4129f4416d7",
        "swaps": 89,
        "distinct_swaps": 89
    },
    {
        "contract_address": "0xc9a1f4ce0c3cae4a44a7be89c96ee783ba5d159d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x7a1d5e67c3a273274766e241363e3e98e721e456",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x7849e5f46131ab8377d132a9361c90d940345630",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x236640ec36e66e5e4d3eb63d0e40893b3110995a",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x0524f6b668f987713896edd804b6b61f4434ce71",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x6276969983510b3dfae28fe6b7b8e2a858f0c2bd",
        "swaps": 21,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x6d3842ab227a0436a6e8c459e93c74bd8c16fb34",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x6a4acca620389ace409c73de56fd153fe94aa5fb",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xf47553eb96b8665d9f258e3f4fc9a9e7811c3c2b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9c4f74a776b32b635b722869bf15080c4cf2671e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x21ca4f923edfc335beb00c2bacbaa97113278686",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9b47c65289a26c09f55899e9f2fa58c5d913c843",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaa0ea59eedffba9fb8d35756c58215ae3aaefa9f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x316f76ac99020fee6b2c99e7125f24bb987bca54",
        "swaps": 364,
        "distinct_swaps": 363
    },
    {
        "contract_address": "0xd477b6ffcc082039df7209fa62ea7fe1dcf49b99",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xe28a8b9322f7672317ca9e7f2ba268f08c7f35a1",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xd11bbde14c6ad396b28c2fcafa249499953fd29c",
        "swaps": 62,
        "distinct_swaps": 62
    },
    {
        "contract_address": "0x821c705abbb1001f931b5c182460d799373dc5c8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0da3b65b61a55399be3cc6f11a58462cf079e543",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x33f741db4f40b2f50bcc39e4a39b7e60ef6a36ed",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xcb2624e22310a795618f96197f43da0dc12aff6a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe8fa74e5192c4071a7a34d31ed34527aaf6c01d4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5e8f882dd0d062e2d81bcbe4ec61d7aeabf80c74",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x535d349f5a3226202f050ae9391c634b7db73771",
        "swaps": 35,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x86f31eabac8ebf7f68ac25c42bda92cdbf8ea50d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x44435e015ef47a853b16586f7c32b79b5ebfa236",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x68e736190094072d600edf415ff01d65119c6303",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf35fabdf28e7dee4e30085760717d366860d43e5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x53b02ad5f6615262ec5b483937260135429d5af9",
        "swaps": 101,
        "distinct_swaps": 100
    },
    {
        "contract_address": "0x32de8db551c9c600e05987cbc8a178d412696787",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x435711ef539e90fa1381566edcf2721c3ebe9dcd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb5e28231a363e01c01e4569f100f9238375936ea",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x23c1753621ecf211d940c73b3eb86f0e0e3edf3a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x83ff4c64a173eb5021376ba2addaf706e10739f6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x98cd7413a2adff81cb5919eb28889be971102127",
        "swaps": 132,
        "distinct_swaps": 132
    },
    {
        "contract_address": "0x948d4ae4e9ebf2ac6e787d29b94d0ff440ef2e4d",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x4e90bd28541670f41e07a6f566359ec7d03c32f4",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xc7326e755741a92ee720da35cee814e31bb6d71e",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x1482a37dc62a17d1008f6e7e82ad2962c1f11e76",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x50409de292f5f821888702e9538bf15fa273dfe6",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0x8089944d11608f84072b2f835289d93274445b28",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xd8151cfa5dd80f4b463e88ae8ca4abd8778cbb93",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x94522c73a1b28fac4c01826a34b4961d0e1d84d4",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xb428245c6f1524fcdf1c39a695c8e13a66c57779",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf06e03b4fd658e26a78175da9ecd5b5b78422f45",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4b1be7bc6d8d08c8a49c0768126ba146ca6fe1a7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5ce7c6533c6a74842386ba744b1278640460d6f8",
        "swaps": 1335,
        "distinct_swaps": 1335
    },
    {
        "contract_address": "0x8a6e92d52d0556d3f10f562a984e39f626c44fcc",
        "swaps": 65,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x7cb0703aa37601a02798bdff63a18af2dd082572",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0x36bca5f970589a0c2c910ed0e708a6bae3ce0d9c",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x2ec6c57888bffd7a9ef97d277ba2cdd81aafd9cb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x09779ee14f1fb50837807978e992d89ea1fe4ded",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9e00066313c8911b43c2f16f12091173600554d3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe4139dbf19e9c8d880f915711c8674022979d432",
        "swaps": 259,
        "distinct_swaps": 258
    },
    {
        "contract_address": "0x9c0899160116e46b17886d13bd029faf00500b66",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x547907a18a7aec18e2af26cfab26e4078d22f29b",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x039efe2f1d41f91365d3bd009aa1c16b6c615e49",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9bf6c4a6cbdca8bf40bda508edd20eb1462e50b2",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x36ba2bd08964f1a3a2fcc4a9fea017716b6ad632",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0xf50ece8bb4c10602d6645ec88d510a6d20265a06",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xed5efdd423444b6259ddf9c1acc1bf5c2511f8fd",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x139cedb8f7b926aa8f1a76c8fb4ff96f889cb5fd",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x150255a6ba2d32ac058e8b435a445f5137a21857",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x279388eb41da7a3570c3149919bf784eca9902d4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xff50a77412997fc86e78178a4b47000b9225ffd9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1fc85e3d2fea755fd76759fe8412652a18da00fc",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x60e25d73adbe8baa0d1919bda3a95226129c4a5f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x516bf991907e34da492754f5ca540d61803d5dc9",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6cffdab447e37414f537b081150c15f970ffb823",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x180237bd326d5245d0898336f54b3c8012c5c62f",
        "swaps": 720,
        "distinct_swaps": 699
    },
    {
        "contract_address": "0x695d4279c8fe77c1d4cf8d13b5616b054ad9ab40",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xbb0dbc0e2b6fbef902bc046ecfc2d664658baafc",
        "swaps": 219,
        "distinct_swaps": 218
    },
    {
        "contract_address": "0x7c303894a165830751f524ebdb6b198affbb7211",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x3d4219987fbb25c3dcf73fbd9aa85fbe3c7411d9",
        "swaps": 240,
        "distinct_swaps": 240
    },
    {
        "contract_address": "0x821ef2590b40225638a0366dc125782e9fbfa9f7",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x76bba00e6d8b037821538f61963e6922e17c98a8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbd0c576a049893599f9dfa383ce372513725248b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x51094f53a829fc503c6f5c424092cdac8a19ee22",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0x2c97767bfa132e3785943cf14f31ed3f025405ea",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x40f011c74f7aec28ee2845e39172474f229a4b42",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x86cc48edcedff70adacba59dea9b61670f90eac3",
        "swaps": 280,
        "distinct_swaps": 280
    },
    {
        "contract_address": "0xcd90217f76f3d8d5490fd0434f597516767dade1",
        "swaps": 93,
        "distinct_swaps": 93
    },
    {
        "contract_address": "0xd2d6211be1ac5e476c69799bca13c70ac1c7a7ce",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x100e0cfcadb56c05f614502b4fe8e4f7a501ef34",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x0b0adf8ff1a9abbd250040c7fe8bed0d68b7528c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd47989556a09a7dabe79cc5e2f4234536745d260",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xb3a06b982c5661dd60b9eb29255143e7a0d0668c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x823d7a6bb9e8d7078c324c1ecebc6a2660f04afe",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x3f69055f203861abfd5d986dc81a2efa7c915b0c",
        "swaps": 501,
        "distinct_swaps": 501
    },
    {
        "contract_address": "0xc53f4d6484c8ca92dc4629c0f375e0bcb4f00804",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xd15eb8710e28c23993968e671807d572189cc86e",
        "swaps": 379,
        "distinct_swaps": 376
    },
    {
        "contract_address": "0x0463302f0f9f847d2c6164525e0d966a9bdce71c",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x578ec633d8166974735078f068a05fa7e57a89fb",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xd2874ce16fd29df546a1b02a148c3981b2d7b7f9",
        "swaps": 2,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7d6964a1195151e0d12ad47f678d198a933f4f70",
        "swaps": 495,
        "distinct_swaps": 495
    },
    {
        "contract_address": "0x38850966a48a953325dc9b57a0591c167bc2b2f0",
        "swaps": 110,
        "distinct_swaps": 109
    },
    {
        "contract_address": "0x27312423b7ed0b55519315c99201d71963333427",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xa821eb34155c1e20f73c58fa73f1c79f00fdccf9",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x662c095c0da03ee6bb0555d7fac85d7946c7b5c8",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3292ec56895783aaf4a40f143a053efe6a674dda",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x16752387f97dcbe245564ba37e97076d60a7ac03",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdd0d80490cac64c19466367728acc47793f57895",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfff138b7487527af67a7691ee202075c3b3d344d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x546bd08682c909625cca0ad7303408da315449d7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe79bb5f5d48d40ea48ab6ef7ecef7ec90a34cfe6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd9f57d9ed738ae20c5a60241a32fd076e69af005",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcbf6f78981e63ef813cb71852d72a060b583eecf",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x827cf263f2ca0bf517744b7d5e08a159ff42b791",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x95d64177247eccf985258fa6ded87242797344d7",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8ee0b144f8ac7b13add4d59126b7df882d9fc65f",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x32f7392d7cf0be17229006d371f02508d3b33866",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1b262ce28b3bfe88bf98081aa1da724ef8e5f6ce",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5a25c9e27097ebac600ed1df3f31441272af9d38",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc358faaecb2a3ec2310344ea07cb3697702b370a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8fb717b1b405b0cd522270ecd647e8f959f87c4e",
        "swaps": 4,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4274fb6197060c3419d73d000deff00d218a4725",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5cb99f83adfd74981699f88cd6a1692cb41369f9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4bd5df4300b7c5309cb1a0143e4a6d0184b878e1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1542ac4a9cb9b969f6c3ee25e9da64254aa273dd",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x35140e275bbabcfd1ca4177c0f2e82ca00e22974",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0x30adbcab9fbb4436109fcf3058d1af27e6e33f3f",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xf31d763e8b61c9f99e37b419a874051e36935c95",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x59dd96dc075d89760c627155e82fb9cd77531144",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x649207961c3eb117dbdf1e35e55101ccdba6a312",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7c64e0e133a93a725be0e04637b9b82fa1ba5bce",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4cd29d586a15b2cd31377b0aab3a233452b91b1c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd220bb28c0c8ee076d7c485f4188084938e2b357",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x101640e107c4a72dec79826768c239f1eb48cc85",
        "swaps": 1680,
        "distinct_swaps": 1660
    },
    {
        "contract_address": "0xbff2b56188e606abf4b81a8dd782b515a8d097bd",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x20a2556965596b513a4392e0479fc42a122c3de8",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0xbb8814ba0efe03c944cb10ca5c293da97bbebd56",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xc4c486596db557274045db3f0a5dd178d1216891",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x7a183c5cc2b1885791345a5055fc65f7dae1f81a",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd35f89f41c35e286624f5ed038767f4f616f32aa",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x580850020637a4478a40b757006bd1dc70a50e9e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa2df4607db485ce3e79c01c12d100f202584786f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x88ccc3c766fdf1db0bdc5ce7433384e8a520e21b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3a89f0b87e6249cc44a9420efbe96ed6173ad0dc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x603f66dde7f0edec2ac6d39e4ba379d3426ae3af",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xc1ee8920a59a897563689a4161acd71f3b917904",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x69716552512abfba100c80882b361c82df58380b",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x75a59202d1b5b8468ce2383a8afa6a1181016e50",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf9abd2085e226891eff5646d92ef8c68b36d2ac2",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x85ba262be13329a2db5acf9aa46ac2345b5df4ff",
        "swaps": 588,
        "distinct_swaps": 586
    },
    {
        "contract_address": "0xbf0ee6427f7d702bd5301d13b3d673fc2ca8fa1f",
        "swaps": 106,
        "distinct_swaps": 106
    },
    {
        "contract_address": "0xcef7659ba70f9df3a862033c20f821c728ba1278",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7e501a8f9549ee0e232bce01d9561bf41c846bdc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3d65e2daee8df8e36abb3d25f3842265bd1c48c3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4cadf559ceac3ae18210cdd281e4e3e24753b8a8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xded2695a5cc2de7ff649ed1fc53c5a21e3b1f828",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbec483260d4c2c42449f78bcde7e7b110ddae682",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0xc2fec6e52a2e4622eb91e5ae4f23f0ea73c47aa2",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x34da30d1f8ef9799f5ae3b9989e1def926052e78",
        "swaps": 67,
        "distinct_swaps": 67
    },
    {
        "contract_address": "0x2972a4ca91d1f864b22ce0ce910403ac8c9233d7",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xec554b30ca0656ea2404e85528c1d5f885e9e296",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xdf2f5760a16a3b609cb8f655580dea5e19496fd1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf288c7c8e10dcde268edb58e31cd1370f740f898",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbc46b1b946b33cd2932abb6145b5cce5ddeba13c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x51aaa8aee36469c6ded77aa061619e9bacbbdde3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9ec257c1862f1bdf0603a6c20ed6f3d6bae6deb0",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0x53227c83a98ba1035fed912da6ce26a0c11c7c66",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x3469a9de3e8148568776d4776ae719562e961b85",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x87c11ead180282f94805fb5dcd9b70e99cf7fb08",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x230e57b69e3d45557e20a6238462564ebf4fe2a9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf9c3203fa644d1a3479136b8bd0dd15374b4a832",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x75ee48f37d0b8e3899b53695622932dc3c052e41",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5a1655964ae4b855b2562190c5714a81a2eb740c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x684a275e8af8c2e1a6571dfd3b63b97a2ba1e11d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xced8a477fb1a15482809203f8b8b7d09efafe404",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa1bc83879489f5ac8a78539d051de2c013e75a98",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x58503919c6fec346c0379f8370467a2c29c09eb1",
        "swaps": 283,
        "distinct_swaps": 281
    },
    {
        "contract_address": "0x0097692463fd591aef388851fe2d756505f498ac",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xaa4a1681788ce91f829b1f1c21361e61e37eaa5f",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0xfcf19f1baa7d36b4b293bc096a2948a1268f020d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd56dd14facf6de931132032b205dba1f735d99b9",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc03ac43fb0428c89409d8631956535084177efc2",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xdcac8c41619df4d2e3f64702458b94c19de65419",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x19b5f1b89cee2e14f7499684147f2350bf99288d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8b4e00810c927bb1c02dee73d714a31121689ab3",
        "swaps": 11673,
        "distinct_swaps": 11600
    },
    {
        "contract_address": "0xd939ff24cfc76bed9d79b79948dd788cb3ace9d3",
        "swaps": 74,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0x623e52a4adc9aac19051a69cbc1c95ebe6625f45",
        "swaps": 49,
        "distinct_swaps": 49
    },
    {
        "contract_address": "0x93bd1ef8bc14c21bbbba7a1d2f49b59f75df9b79",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4935270aa19ba0b88fe99ea9feb10519feafa758",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb88e91632486ab248646a09eca6ab682bbddbf70",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x611f2ca9b186e358a1d34ad3d9836855af7cdafe",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x014ac2a53aa6fba4dcd93fde6d3c787b79a1a6e6",
        "swaps": 915,
        "distinct_swaps": 914
    },
    {
        "contract_address": "0x93847908bda4eef8c1f2b16bd486fa1349f7ce88",
        "swaps": 1701,
        "distinct_swaps": 1699
    },
    {
        "contract_address": "0x8635b26fbb176b48f7cdae34780c69c805645015",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xad431d0bde99e21d9848691615a0756a09ed3dce",
        "swaps": 480,
        "distinct_swaps": 480
    },
    {
        "contract_address": "0x5cb14ced4a3893b748d6ca9af886feae240a7b89",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x43ffd0929581e1f0159856488d446fd2d362e7e0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7d1df13afd231db8b18351fc888e3e572167021c",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x5f9fecbeccaa14767ce5e067641002673ce3e946",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xebe82d11f2bac0a52b5913bfab0a24defd2180b4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa0a6e9a5185d5737cf6f7920cb417ea2f07f03b3",
        "swaps": 50,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xba3f743dab7fa2e00310fbf5fe281dc61fa1f5be",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xf2301f6f955c01b7e86dd801da333e5c8d161895",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xfb7910710f8288143445912c575b9f4b37564351",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xc7ad59619ccc2c2a9fa1f51b277037a73347331a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x135c7d287ec28b4af27e63723a9e834983127ce3",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4cd2b8b7e00ac8eb544c51c4b1f0bd39868a89df",
        "swaps": 78,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0x2857ec555c1e4fa20982acbf985b8b8807157a5b",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xc419c78039dc2e35e639cb0ab1ac7351a4a9aa44",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xb16bde7620585a13613d51b4403264ab45d7d4bf",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x32694912156ca6bde8d93c23fa7bdddfcf7087e4",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0x62052b489cb5bc72a9dc8eeae4b24fd50639921a",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x82f1676ef298db09da935f4cb7bd3c44fb73d83a",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xe0a129586e5aa3c2615dd2ef45f57db47a621438",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x5fc3cc1a766f4f7662cf5def8f7ebef8bcf5adcb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x326e00705b2e742426623dab0ace2ceecbbd6067",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9c6270ea8e17aaf7ba14dc8e36f6517b9ad9472a",
        "swaps": 202,
        "distinct_swaps": 202
    },
    {
        "contract_address": "0xc43f4d970cc759b78bd21f9414f1984ca80e5ea6",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0xfab0cef71a91f31b73508c0d0c94254eb618eed5",
        "swaps": 85,
        "distinct_swaps": 85
    },
    {
        "contract_address": "0x50bd9b8b68aeb5207a7a38f3cf1a3d9e439823ac",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0xf0b18ea2ead1f954d4ea2d1f4eec1ec8888e04d5",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x0d117bbc0e51b4a64b1410bcd5b58ddf5bcf3c13",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x5c58ba9096de36a92da282c3d193d21a142b9935",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xef94d79ace4451caa4a064f3f846eea0506458d5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8ddebb2f38350647eb80e2427056b664384dfb6c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe67579cf38a1435ac2a08ac6d17da7947d13874e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x309f3dce45d91b390c53f4b450e65d66ab8ef849",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x0dd5ce1b92f098b47f6b120e11a28776406a0b36",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x71ebea49d6c34efa9aaa961a570e93e4c88eabbd",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x384a154b8def8b7a8867458a38a894eaf9969ce2",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x4152ea409f10f7d6efdca92149fde430a8712b02",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x401b2a000ea220041df5a83cd6885d7e920eaafb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcd6a6db8ec1aa2baafe7581352bbfeec7e4be319",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf40414bcefbff7e98d6d1fe6989f46f89617c7f0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe4b60c0dec60dcd8f8444fb4c292ed100c5d0116",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8c8b69d46488a961befc52d72d0b024712edd966",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa964b92c690f0b8efad5b46a278a84bd0ef8ac01",
        "swaps": 631,
        "distinct_swaps": 629
    },
    {
        "contract_address": "0xe02857145bfa7e8abbc3e1ba29106c2000e38aaf",
        "swaps": 310,
        "distinct_swaps": 310
    },
    {
        "contract_address": "0xbd6b851ffba6819853df53eea0b69737f1a3b104",
        "swaps": 77,
        "distinct_swaps": 77
    },
    {
        "contract_address": "0xfdf0c858028c4edc0c809d11f06ba167e91776b2",
        "swaps": 96,
        "distinct_swaps": 96
    },
    {
        "contract_address": "0xff2d04a67da5044cdafff1b13601fce27624a6f4",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0x37043bb55280b4c334e3a588987066ee422cfd7f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xb82f8457fcf644803f4d74f677905f1d410cd395",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xad2139ac576ad110cbbd5b612a2b7ff07790c3d6",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x123d872406a9e3a75e981c59d889c60f3043fcda",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb8a0d1c97cf2bc28fb2c362726591ab7b66be473",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe859eeda809a6352b151c41c5332922a586aaf84",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x1b955f66f7ea354d29e9469c50a54c1577b52503",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe81fc17d825b18b043bf210575cb4bf6bffcd7c1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdf45b5b68d9dc84173dd963c763aea8cad3e24a6",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x072cd16def7a72fb1e309cd3fe23866190fcbc0f",
        "swaps": 208,
        "distinct_swaps": 203
    },
    {
        "contract_address": "0x853ee4b2a13f8a742d64c8f088be7ba2131f670d",
        "swaps": 1258,
        "distinct_swaps": 1246
    },
    {
        "contract_address": "0xc3266f3ce2433e0fb83d3ae8be49a155f6230a6f",
        "swaps": 182,
        "distinct_swaps": 181
    },
    {
        "contract_address": "0xc01d8ee3a405f758a3bd9f8ca253f00b9edec2be",
        "swaps": 54,
        "distinct_swaps": 54
    },
    {
        "contract_address": "0x688f917b6eb97537da53defc846f00914af8113f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x32cba8f9b6db99f60ab15a3173c1ac9c7833c09e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb3c371921085f1e2ee5b06cf209d4cbc2da8789b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb9ae91d2bf26525dead47dd7fab041f8836ebeee",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x9db2d4c23dc43f032c4a0f689a49cc006b06fc82",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x171074801d60335dba5bfa1dc6ddd59b764333ca",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xedec89a51d986c649788a05c5e804a7dbd4969bf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x03eb019340d357500741f25035b547cab97fa417",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa4686f89502f9b2a9f595f6c29b2a0ab34d2dd66",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x679b8ab80f298bf802fb294137765c6386d43dca",
        "swaps": 289,
        "distinct_swaps": 288
    },
    {
        "contract_address": "0xc48ae82ca34c63887b975f20aba91a38f2a900b8",
        "swaps": 257,
        "distinct_swaps": 253
    },
    {
        "contract_address": "0x114ccb970bf9eaca8bb0ee6ac5f6ed88b3dbb350",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0xda66d9a48325db42f02604a5790ec72b147be0b6",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x3a1793e7094890dcb5a467e4191ca7ca123cfabe",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6c429c09ce26dd32f24da273a9b2d491721cc46d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfec2385b26a4446a7813d16263348fde7e99fee4",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x6b2187b2e431bf0a7485a4f0963f42c1ee2b975f",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x6e8ea602e348a41c3ac673d31e2021f9f143908a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf4eac0b904602de022e934bbb5c37131cb6cf6fb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x827d090ddeedc802d2e637ee43efadb052a964cd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x55012cf78e9c684cd0819dd2cbf63d876f9abd39",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf62e909cdd1445d2d2a4e47d4f142d70fc6f3ca3",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xe2a89f22df2ff8c68f50c4825823ebae6bf3def3",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xfce9b08d0de050756e4a4d10edc65cd85b5e28f4",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3bffd4ca16197ad48dc610c41a022664905b7ffc",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x8f2172568ad3b2024b8cb29b03279e4b3d4849c8",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2b7335887a73ce7211d4fbd24b03ac0808edf26e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8aa8fe42275b73cfc9741279d90eda042eeba47c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x882ded13fc1e5076715397418ee31fe3370d496c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfa46766a42dfbfb93f89c9d1d2463459e9f80598",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3239c47b3c91bc2aae56085091955a07557fc7c5",
        "swaps": 132,
        "distinct_swaps": 132
    },
    {
        "contract_address": "0x27307257ea70280da5692a2cd3c863d021127ac1",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x01e05b18fae44ce5c62b85293f16127dde0e82e9",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x0e21f75586974d50a5c617c4e6d6ce66450cedcb",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xa76301a3d3933c3eb8f622bafc9b8e3ab5373661",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xfaf56324d7ebb7595240153a320ffcb6d0858815",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x652a7b75c229850714d4a11e856052aac3e9b065",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc9eed9f2b38e339cf3c97e0a28833a8dfe5bf8c9",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xeaa5e4620373d9ded4dcb9267f46fcfc6698c867",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x0224ab72c03bc45cb439685432338f50aa7bf5dc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1f21f4e5b96142b2c4c70dd565d647af790aafa9",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x21a329d33c7c7dfdcd2fa30a5de4bcd1177fc614",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfd48b2851a0496b13316983e5b2caa2b588a565d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4ded9b993d2bcf960f6774b32dcb53e58b6453ae",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0x4cebed5bab3bb4ec501e60485c1475c40d849276",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x49cfe23d94681147ca9c93cc89062ad91abeb233",
        "swaps": 99,
        "distinct_swaps": 99
    },
    {
        "contract_address": "0x082b58350a04d8d38b4bcae003bb1191b9aae565",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x19d5c33477b551ae84a9066097e72724c4a8cc60",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x24ecfb015ef8f3492fef2001deb30f9b0ac51269",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x79891cacc0399d81f1455fdc375b51645bb81713",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x10439d80173cde790d7109fe8f6aacc0c4054859",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7c840013b82ea968c9a18ab96bc6593ec5dfc778",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xbb5317fc8939450b750ed5c926fb3a67bbe6a0ea",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9ffd53ab0ae54ea4af4d0ced44b3be320961a5d9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x22f5fd2d5e9ebed447bc29e3bfa1246f0334ffeb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe55c1389076c8f0536eac67569b87802444cc023",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0f0810ee18ee7e2e0f6e8196b11452ff55ce9082",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x6e74a66230de0d51573887808a42f7c9f27ad30b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd4c903c28ad132a993d7d7cc01719e35cd4b6083",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x12837210d2bd0f471b81fc278c56ed0429cda3ed",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xbb93f7e7295565553eb77aadd9c0f0c632069414",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xeae49896a50c21f7d19e761846ca2e34c3dc2d20",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe1a15fefb4ff760e33a71160e34af354c653a72c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf99c496c4bc62d4ce47f79bc7d367af4ffab105b",
        "swaps": 154,
        "distinct_swaps": 154
    },
    {
        "contract_address": "0xd04934d47cbc46c535cbbee9238a7cfd8c215115",
        "swaps": 59,
        "distinct_swaps": 59
    },
    {
        "contract_address": "0x55f9ac3c134eef11d302e42e82c75a8c33081d15",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xb514ae76f0d78ed8c190a8c3d526e24117c3c476",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x4ddcc4d73728feed92f119b43fe221dbbfad9a71",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xef179e39c0d94efbf7b0a3c882a1d9b4c97a32d8",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x7e527ad03a5d5e890a9a88b06fe302708788e3ca",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xb0df9f817aabd8f25b7c9140461d5a6d7c2dc70d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x97ca2f37e819bf20017449509c8168662e3804a8",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x9fb51819ccf45dcc6610a876f27c692272bc65fa",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1375ff83e87a1353510aa62d652b81b7044c316c",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x61da8bc4204299757b0318e48ce02e95409de80c",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0xd7f5c696513f81bd671c6e6c3f5518fabbc5062b",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0x6688f4189c0edaec232ccf49d769e8b96c453083",
        "swaps": 72,
        "distinct_swaps": 72
    },
    {
        "contract_address": "0xed1d8d6cdc88b6794555099ca4ed1aabecce56c2",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x4e74922aed548e0cbc115c0a0789ede0bbde766e",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x88d22d607fb0dcea4db43f766970f1c172afa3a1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xff418f34841d707a3101bc19a93ee9dafbe3817e",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xf60618c6ab18e347428a3ee72bf95a720bb45ee6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x70640c8e29561f3704b1014e036baaa46640d0e2",
        "swaps": 120,
        "distinct_swaps": 120
    },
    {
        "contract_address": "0xbe53ae058a8e834716785143337ab14132104fa4",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x41b3de329f181132d019aff3ce1d3b2105248ec4",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xd5476ec927443791c63f1566a9e99e9cdd6c8f4b",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x9e5855d02938d4ab2c233ff84a672e3ca79d9331",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x758b27c7087e5e27479659e7f40d0983b1418f24",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x24e44e7771ad299afb0471ab4e8477c213007c7a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcf863d14b6c3551cad42e4b7f0a2b4b6a72ce122",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbaf960257caaaf62af9c44e201cd454879723253",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdf13200f7c4c2715de5004adfe25768ebe05655a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x93669955fd9f9c2407b1477dea636bff471334af",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x79088b108ebea61eafd86b29c7a1894ab1a4c551",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x78f0efc91e5295bb926ae60f319acd6ab5106a68",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x28763bdd88c43f902b026c7be5494f32cbdaad91",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfeff91c350bb564ca5dc7d6f7dcd12ac092f94ff",
        "swaps": 278,
        "distinct_swaps": 278
    },
    {
        "contract_address": "0x5b6cde498d752d05c14c42d4e93258c86a57a62c",
        "swaps": 73,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0x42af7380668cd3d14c45a4197f76bf9b818a3690",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xfef87340394bc37b8d54cde7c2b37e616d741b31",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x0f888232050649c81d492af3cfe5ed026d957dd8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xde619d56813a3597f7b5ef8cad0da1bd41e7d9a3",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbe919aee42b9cfd94b3d237aac6ecde1826a04d3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4103f7722da026137ea14d31cf717ad53c0ac58f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x346e2f5f4570bc07fbac153062ffeb3d46d41c40",
        "swaps": 346,
        "distinct_swaps": 346
    },
    {
        "contract_address": "0xaa1c939a3f266e5ebb31339eba396e73b51ce758",
        "swaps": 142,
        "distinct_swaps": 142
    },
    {
        "contract_address": "0xdc2d6f129a5fb13aac61a63ef25e8f7691fd2020",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x5518a3af961eee8771657050c5cb23d2b3e2f6ee",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x223aee9df0482cd71b0ef441ff6310ffd5adc0b7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xff4f0897f3bf329a1fcbe71cf9679d5b17993b9d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x1c5424f7beb529d35ab52453a48c5de9376385cf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x74e9a1b527be0865119140cbcdcf71245aea10e3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x38f06bf22bf5665d465542fcc6e2e1ff8222c3d2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbb19343a40d70010abe78014669223cf3c39df9b",
        "swaps": 1625,
        "distinct_swaps": 1550
    },
    {
        "contract_address": "0xb4d852b92148eaa16467295975167e640e1fe57a",
        "swaps": 413,
        "distinct_swaps": 413
    },
    {
        "contract_address": "0xadbd183ff04ff3dc9cd980f07b308c25df77e860",
        "swaps": 66,
        "distinct_swaps": 66
    },
    {
        "contract_address": "0xc80edd4b10859f6edd06feeaf76bb3791b0360f2",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x2d945dd6150f879e2fa30b44f746848ffff59928",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xe7a75ee634dfcebef8cd6dbe8bf8cbdb74478561",
        "swaps": 105,
        "distinct_swaps": 105
    },
    {
        "contract_address": "0x4bb510322e2fba14c1f2d1312a3c3c92ef4a2d59",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x7cf4bf4753d892f4a0846f0a5742a090cf16701f",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x5a272ad79cbd3c874879e3fec5753c2127f77583",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4a56edb9f7ecf3fc710917265de58d9018309c1c",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x6dd161c9e598e5cece56a88d71698a78dfc51a2a",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x5462cbddbd628827492d846ea773d72671254c0d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xfc9727e9b0666159e1cb2bc5e9d50116d62eb5b0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9ddf0a492c14c8fcec50c1b34e5173a2ac6afd85",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x089cbbe9ebe2594f5cd77710c3fc10f11faf58ff",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbb89619117b6927e54627c57458bc68f8dc83b60",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x45bac6629aee6f95ffe0ed4f4409017f65bb6ae0",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9346bea9a8ecc94aa1df3612abc868456506c523",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9f77ef7175032867d26e75d2fa267a6299e3fb57",
        "swaps": 103,
        "distinct_swaps": 97
    },
    {
        "contract_address": "0xfc48b66b9119f1d5fd7c8e72e7e489a5d6c0ef55",
        "swaps": 174,
        "distinct_swaps": 174
    },
    {
        "contract_address": "0x8832ec6120d4b9b21746e4e2e01ec03a083cd0a3",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x9fe59c8072db692c81514394d0247ba05b7f2445",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xd093a031df30f186976a1e2936b16d95ca7919d6",
        "swaps": 115,
        "distinct_swaps": 115
    },
    {
        "contract_address": "0xdbecafa5f808e4f4de09ef005877075ee3ce0edd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc89a51803e4265a7a8bd10a114f58f09e09c50f0",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xf8f53d3805650a31f421cdf5e1004a52c3e56bed",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x03fdcbf73a445379b5c60f637e6b7c79fb113721",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x9ab6e8197cfd366f920b54cb069ce6273898cb0b",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x54f2d522031d32bc71bf554725aec818ded353be",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x804cdd498224a4f1aaf081d9600e15296b981a1f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6d7ffc75cab216364efb0388d822dba08caf1ff6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x09c6127fc65cc785acded9c563ec176b01dc4126",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0a8a3cb9a21c893a207826e76125ef6faaad99ec",
        "swaps": 77,
        "distinct_swaps": 77
    },
    {
        "contract_address": "0x5832ec0eb681c84784fbbd516a4e02412b1b7790",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xc5b619f14e9d2347c2d18cb2296e25b2950ff635",
        "swaps": 277,
        "distinct_swaps": 277
    },
    {
        "contract_address": "0x68531fb6c87085125bbbb6c0332ad30e7466b0ee",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xc1dbec44411ef4024e2487317e15544c17e1350b",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0xbff538ad7c1fd067f5529bbc7aa3b403f66d70cf",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa5d18f3c4da1dc4b3fe31f1ba4197a47e20909a3",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3c93fbb420ef2e66308cb345d22d63c828549a4d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6f447ba529007943e05fc678fb04a777816c81c0",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xa22be9e082f7f5fef53263a0109020b6e870f76d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xae5c443fa4e36525bb2ecccaaf72158b710b067d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xdfea739ac76e7502d6d8f0de24379efe4dc12bb6",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc255866457219caac635c527c300302b709f3103",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x8a060bc21e6d8152d36905057dd69f90da193985",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6194d5c087a76d389e2008cc028386badf9b40ba",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x22d607865aa42f70fda430c4c1828e1dba6c42f5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x555c3fc6d535ae5d0d70d0b9747422e9d3396d6c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x822ec444dcae8d39beab54ae4b82f461431939ae",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x2246b186b9844fb016a682b89ae0c2ae59f50614",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1ac901fc1533b65bb518fd0604692f7f9d306e01",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7ade652cdc74b5195f96a93e70f4824313b32fa0",
        "swaps": 132,
        "distinct_swaps": 132
    },
    {
        "contract_address": "0xb21f03dbef0f5299591c8400ec9dcb235930cd2c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x02e0e14d65175420fb12acd325a7be456bc22005",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0x208f02f73529e7a8f4a6d5179bb61af088ca5817",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x75fda6897540c7288a21ef383fdf871595bac61e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xea84509ca903df91be9cc1b3c4cd4e026d0e71d6",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xac11fd901ce8fb9ba204cbb7919a12df18772d9e",
        "swaps": 122,
        "distinct_swaps": 122
    },
    {
        "contract_address": "0xb3df7c04da826c7302f5ccaa849e0b016af07ffe",
        "swaps": 72,
        "distinct_swaps": 72
    },
    {
        "contract_address": "0x09b647132a26fb0813257656c165b03f8ee84e54",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x9a7b9d28a72e0a755c473606d4d0ec39c3f401ab",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5a8974ba28ad256fd23561af0249a2e89c375c9f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcf8172441b953e9609c425fce91b32be780fdfbd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xee26d8b6548ac0368100fb3c74231b88e67a282f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xead59b1838650b7634f0ef59b843222823d61188",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x58987275fbaf0bdb07aa8afa0ad1698859c997bd",
        "swaps": 41,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0xb8a7a28bec1cf5fd04efa5681795f984b61da534",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x23e5d894177840dd25de6b37752593a9c5dcc762",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x05490df685d3aa17b62e42a69dc338cb31b1b71c",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x32c8756821cf90928262d2d0ef7d5bc6608a8a47",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xebe46535d4c77d8b87ae73d47affa91940451dd5",
        "swaps": 4,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x06b8b778ca93c6c6f643a1dbba55944dcca45ea4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc61f9d2649a0d9567b00717da7f62195d6bdd577",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6b63eca05a5435c21d532f46a820f1686e1996d6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x557f0f93628f2215cb3ae1018a899bffa31d9c3a",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xab291e39cd0f8235ba42a20a86f996a3f8b934e1",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0x5e861c6aea8f41bb19089738bc488802dd307554",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xef1e0b971c8c43576c06db28ec0ba1813ebe81ea",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xc8978a3de5ce54e1a2fe88d2036e2cc972238126",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xeeb92e3cb8e38375e2c20201e9b9fb8740d0133f",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x5f904045ef5cc38a2480e5a11a9f9546cfc9b2fd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3e3665974c4296c901c154d236cdb6d935c89c67",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x110bc65553bb8013b9db639fe269cc4ba5d3a9a9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x67ce5744dd603288e7edbb108f7941e9d46f2984",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x96a523d3576b9b1dfee49aa73723f64a5b553720",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x01a760133529005dba1bc55eb531a6d57459898d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7952e98b6d1d048e145f4fd0b94bc26e826a7d18",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x068cbeadb9d4fa837176546f8a74009252d84380",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x814b6c10bf752bbbea7bd68e5e65dc28b4f45982",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x1a881d021d346c5433b2cf8fb46ee00dec89070d",
        "swaps": 104,
        "distinct_swaps": 100
    },
    {
        "contract_address": "0xe370902cf4ab8d1aca0ca4b89367dd7ff76122e2",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xea7c3b5299f6807f69952e2a2a33480bfc708a7f",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x5ae1f972cbe3f52e1ded29b03be82ab0cbfa7c12",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xd58b4586dce5c39909d3284836e09faec2955eb6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x69406ac2acb26fdef40c3d7abb2e8c56cd3eac16",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x81fd1d6d336c3a8a0596badc664ee01269551130",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x60e4dd8a07522610e8721caca4f34f39b1a309e6",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xf3fbc5684567b936587f8d7359849577f21a9954",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xefa02121886b0cb6f98e142c913d5fba39e60d99",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x64d372dfed8c0be989d51c955b4bb2f8f848b461",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x76fd089cc874e1abe1f3f9db6f2d23a819cd13e1",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x1e5cfdce96758b3c2cb192f7de2798a3531b27a9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x95bdb9423c5093c5c71b878e3102e2b0258ad3a6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1a6f6af2864b1f059a2e070140e373d6e3aaa2a1",
        "swaps": 1157,
        "distinct_swaps": 1157
    },
    {
        "contract_address": "0x98f675b60769abc732ee59685bffa19ea3c8e81c",
        "swaps": 50,
        "distinct_swaps": 50
    },
    {
        "contract_address": "0x4aa9c2ce122f30d3f6ac50c01ae28e2387bc937c",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x5eca9b52d6c81637d50baa8cea8a789dccd979fd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x796888f8ff4ed857ba314522307d338d08807e5f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x788873a5ee5936c02a222d0d34c3dbb0e3a4f454",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x155a38a419b342e4e912141da9292f080a286fe3",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4cdc309447f07d0a158e4dbe86d553e6bbaf90a2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x27689d3bf9a42de6f385a02335bb912a6b7ce983",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf592c107022091abfa48cbffea633da8c16bc1c2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5e1112bb19d2e39c27467f7211670b7c09f6fd6f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x74c64d1976157e7aaeeed46ef04705f4424b27ec",
        "swaps": 101,
        "distinct_swaps": 101
    },
    {
        "contract_address": "0x898386dd8756779a4ba4f1462891b92dd76b78ef",
        "swaps": 586,
        "distinct_swaps": 582
    },
    {
        "contract_address": "0xfbc43e76d0114e41adafda747a19453ce623e220",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xfea0b7e4227520362b4c57fa356cea08bbc8dd47",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0x3e5ed29ef92c87163aae569e0edaf1b683eeeaf5",
        "swaps": 82,
        "distinct_swaps": 79
    },
    {
        "contract_address": "0x82868099cade6872a6417e514c23a6e63c5dca46",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe83f1c7990440445ee52f1395686a3e4bf5b4e47",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xc0405f06cff18b38161ffe86f686635c104138e2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3c1e88d02fd4d17447d8ee192607db55837ffd07",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x111ee7abab53231add2cd13fef52e0558b39e1fd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdbcdbd5e1cb36f2c7497b0eb55a847354debc51b",
        "swaps": 1540,
        "distinct_swaps": 1419
    },
    {
        "contract_address": "0x4e89778acd2975e998147d8e06053d714750ac2d",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x77ee3cac2b375a7baaf8845fabf275d232d5e0cc",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x5356d0f2e8b22ff6133e11762600984d819b15d1",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xcffbfa978ac3fb10e829ca6b763c307daafe8a77",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x8f2b13e6476cd7bdf2fe3b9f0b0388f93b8fea69",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x70906c8e90bb2fda4b561cd36c32a5c54730be23",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1528ff18d5abdf2e8fd83f52a43e7f9a80f2cd58",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4e90479ed48620a1f18017b5ea6f96bc42bbb5ce",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0xb8e54c9ea1616beebe11505a419dd8df1000e02a",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc957a20b3d9580ead5a08df1dc25802122027ef1",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x45708bac86e211cfddcc005859a538b74494259c",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xcb05bfa2293ce9b246aa034d4791ca094717ac8a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x79769f7c85ba923c28846bba814736da9cea521b",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xaced7241ce8141683b43918c2ce389a56e1535e5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd3c7b240cb75ff04e70e188d6f6648eef342b37a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0cc8f7c422c8d11392414c14d41559ff13ce2135",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd9fa4f8764de231891759c986812364fd656520b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x44a53bc7d387f154cb694dace76dcd4c19554825",
        "swaps": 195,
        "distinct_swaps": 195
    },
    {
        "contract_address": "0xcc35eb8b6aa0bf8bc36f7abd54c6d39a9d65e988",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xffbbe3e43fc51cfef5250797013e1a1e5d786cc0",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xd766422a8b987c81adeb6108548fb8dc9de8ed82",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8d5d9cede4ca6beb9964ff6e5ec5b912bd5c739b",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x0832de12e8435b97c18cd18ecc8bc882322fc9bb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xfd8e323d8d05f79e3ca660c951344d5744c8ab79",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x07ef52ae3e5a293b502cba15dfbdf21960cc90f2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xae7b23043b919bbcfb667cfe19a97ee9e5fd84d3",
        "swaps": 268,
        "distinct_swaps": 266
    },
    {
        "contract_address": "0xd8770553b6daebeb77b29959d9589638e812b5cc",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x356382f459930b424670456f4d3c8d0aa3b8f3ab",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2314e3b36e8da5b4e0b591adb18b3e806f0c6af5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd01897a6363ec0407ee08ab145142ff9c4c3d691",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x4c9d13baf01797c0aba3b89a0d17417c37eabfae",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x0dd76845e9e2272181fd8dd88f6abbd4560a76a7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x16a801e521a9366c1fee3048e9198bd6e7aed40a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x79d195346b13deed664625116b1a3e5cdc558514",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd502c29fbfb24249e8f3fea819b5fef64c9097db",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8c78a1c338e593fc88fc96327dced3138eadf5d1",
        "swaps": 698,
        "distinct_swaps": 698
    },
    {
        "contract_address": "0x668269d6e5d2c2de31d132ac218044211643622b",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x7c07cecd8cdd65c0dad449808cc5f9ad74c22bd1",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf9845837bec7c7310560cb0f1b84860c1ab6a7ca",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x02ec7aeef96ac32e30d73ef44ee4de4f36d83daa",
        "swaps": 36,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xe313a552e5dcc3aab5d16a74668b403e76ade4bd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcecc7e26d0987281b7da1e3c757161ed6b20af6f",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xdf8d8a417ba6aff5b934d5b172e248fb093bf560",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x6ced5d031d0bcb2f831c6ef2e216cb1e4005451a",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xb7bd6d48c9b1af7e126d0389c6970f157d974f33",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x45ce6bd7a2ef64bf980559c64e602b79f2a0d8f0",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x82ee4008e2de03f3a3e25434506f0d4d423afaad",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4b0d755029501c4608595ca2ad3cea5195b7262c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4714e92a0c4170113e708e288ed46be32a6810e1",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x10d39a3fb1ef2647f6e93635cbd179918e2b9fb5",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x609360d5f6dcc26597165ac76e432a16fc27b6fd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xace1e8b717202bc122a7d98c308824c33f4cc20d",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x939e9fef580aa433deb7c86e79aea0cc7c3555b3",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x44b0e3fe61950e7503b82dc60c2301039136cb29",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb394009787c2d0cb5b45d06e401a39648e21d681",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x613a9652756935806374b1fabce403a7e098d2bc",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xbf9e15da15b2d0b2c1acd7398d2c79c590721f80",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x777eccbad6952e185f743e20d5d85ca795270ac8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa0972e755a2d01a8f0cdef2ab08342bb8c3ecc7c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3f0c7720f8588ec451446bce4fb50a553b90348e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x69caa2b44739fea0b7dd7c89667903ce8f4a4a42",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5d573eee586b8117481ac4bb4dc3c9cfbd8cb8bf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6cfff6f3890a65436a29a09cbfd7f749443a6dc0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbe217569bbb810eae73841ee92e19633d2ff8a2b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf3c62dbbfec92a2e73d676d62ebec06a6bc224e2",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0xad308b210356d69026c08c5f51089197d4bb59a6",
        "swaps": 118,
        "distinct_swaps": 118
    },
    {
        "contract_address": "0xde9e64d17814dc63fd74dbff3de18ea9c65fa4e4",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x5b27bfe67b1afb4742bb56dfad88759badc03b17",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x381e1b08aad5390fa08eb5c18b87849812149e96",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x88dfdea7867d68dbd76b5d523a762066d6f41cdf",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x56c7aba43f11591a0547c49990c1c507770ff9ce",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1f203b86d075f5b771c78afe1e854541e1069c69",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x1a477272f6030eab135cb3ba40646f3eb26b382a",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc892cb9b975ff4467fd2c295036d5fd2a9ca1145",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4db8a47444f36a1e0642d6213dedb6f23eb0a88f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1bd1aece6c6997d9188b7ced4a755dc69ebfc1ac",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcaf7834cab11e00123d3510abbbcb912b39ab456",
        "swaps": 244,
        "distinct_swaps": 244
    },
    {
        "contract_address": "0xb8e91631f348dd1f47cb46f162df458a556c6f1e",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x96f16829967c8ad5da2a2b0932a72e79f7acf2dd",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x0d78bd69a0535be801d904ce1d29973e77141716",
        "swaps": 135,
        "distinct_swaps": 124
    },
    {
        "contract_address": "0x4600de2e89d6fe0d1650133c99de43f834c8d2d7",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xc8f255954af417ea8a52362a6fdee74ed262545a",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x46e64e86bc1a98b09e3a9922543f12ca63c7260c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x35d62dbc4b85cb8627f5eed70eed211d35adcd04",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xea8728917b73b890dd0fb0ae83ceea40f269b8d3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7887a048a2e5995ccfc3b1f2e9c23ab2eca40bcf",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xc37b4b0f0d0afa52b8217388acacf8a834dff48d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x15b3e9cc3bfa86b2682d858cdcddfa368651f40e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfaee6424a9437fd9e23fb2ad7987d5530739a669",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe403130e92d333aaac8b264d2de53006a5bd83b9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0692ed82f370da6425c1e898023fcb14df05a107",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x128132e8f498fa653c28ed44afcf60c57c75700a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x54c3bb4cb56ff00c980aa4f742e400c08b0d46eb",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xe2cd04a99049d7086614e988206fc7d67ac7adb1",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x16d70f7c3d17598ae0f5e56e27273e2a9b845e6e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x363b971dbc300c2673d72eaedd2c8052751991f7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x10838ef3def20f6f5dd963c3e9e510971ee4ca4f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xa34e2b5f9da6ef6aa50ae62998fd11a08e8c6c5b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x111bc78ae824d5668ecf7224f34dedc3c6bd45e1",
        "swaps": 48,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0xfd168748dd07a32a401e800240aec8ec6efc706f",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xabd03b82fd84221b8aa6d2c5605446b40c5b0b8a",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x3e477dc71b58aac6c428094128e13226fb488c0c",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xfd1269cf0666eee403141edd33ae9ce87e052d10",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xec3ac6f749fe878ebb33bdb545e302d8062b7856",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa2f2b308fb5ab36ab9207b902dd912c1c5e97e87",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd59898d9c951e36f7ee8782f137db919a8043429",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xf8cce2748d3e578bde601096d985c3758932a817",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4c27eee5f50eeee292ef438a87a42292bd629e70",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfc31dda3d94078559b7ff877d9e38d20e4355512",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x783944bb88a3b14b550d312d561e6df4db0bccbb",
        "swaps": 45,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xb2148240250bfa5ab9325553f3b733f19097e57b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaa0827896a83fb184350022b746e150155100a54",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x24c8cdea5097fe32f0dccd176bc5b651f2f1138d",
        "swaps": 90,
        "distinct_swaps": 89
    },
    {
        "contract_address": "0x384c1b95027b73a98fe31ea5b4b7b031b9ddd724",
        "swaps": 47,
        "distinct_swaps": 47
    },
    {
        "contract_address": "0xfad4eae9ee1c521ed1581601d11fc982f9bcfb72",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x2fd8fb3b0367d18aa76b335339d04b578eaf2b3a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x274b6d2e4945fc8b143a19074f25d98cbec797d0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x27b50bd642b6a8389660cc79c5cbf4b5bb3957a1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfa8286ce9a9ca82d4a689a52d0771654be102ed6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x267ce815b0d55deae99b226fff609f202980654f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3410e1e86c287b7b39e92b120f055a06fcc4f407",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xaf5d71995a6f5cccb337ea89f77811546c4b113d",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x1316e0655428840dba61bd75980cbe43488c35fd",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7e2cc09d3d36b3af6edff55b214fd62885234e95",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xf67f0ff93b7fc9d6447546174d948f7b3ed16e08",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x350cac55be4db9f043e5c20e8ef0e0dbd604fea5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9f8a5b4ef3701f329c1bbe1ed8e4dde7003954ec",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xcd2cbcb6318b117a9a1a89d2de82d28465d6fe1a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x34965ba0ac2451a34a0471f04cca3f990b8dea27",
        "swaps": 1013,
        "distinct_swaps": 1000
    },
    {
        "contract_address": "0xa54e44c7bfbcd2cf756af6fe9a112d782968fdd4",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0x1aec8ff1c39c34338327a32bbb35011432614172",
        "swaps": 168,
        "distinct_swaps": 168
    },
    {
        "contract_address": "0x5cb85aa163b1b443f88a1f9124153e70f6586400",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xab45e606be58c8547d67aae0f9b76d70ee3175db",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xe41fe96c92c05fc4ba414f5ee68dd7a173c92e1d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3338e9ae0a2d7f461ab2ccfe06f9fcb3c81fd1ca",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xdf89835844328771d98b902552b478d784d8bd5b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4721db1904342507c204aaf558db933ef9512665",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x356107bdd524288b611d9ce910beacb8a62ff0ec",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2871c59dcd1800fb659cc82d3edc48ef5751df86",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3370c17c0411d2ce90a59162e3b3ec348c84768d",
        "swaps": 69,
        "distinct_swaps": 69
    },
    {
        "contract_address": "0xcdd1ad14b4c156aff8d833de1793f67d75237909",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xd776c65b2a7a5832b4172742bf8c40cc062c678e",
        "swaps": 159,
        "distinct_swaps": 159
    },
    {
        "contract_address": "0x1b238bdb3ae538fc8201aa1475bffc216e3b374f",
        "swaps": 40,
        "distinct_swaps": 40
    },
    {
        "contract_address": "0xf0cac53c275d3b770045a72d6816dcd5f7cc0977",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x19f5d0d63c84a850c62d8e288456892ae60573d2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x12434d77981aed86ecc607573005a6ab75141475",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xe3a5e709c8434275372fec571380f8838744802c",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x241ed15a37c85e531e83255ae719b8d2ea079ddb",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x5efc46f24c3bf9e0185a3ed3f3c8df721a9296ba",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x72c0eec6742e486317eedfbdd0272936f88e7679",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0822d4b4fe320ea2f7a7ee9622f5b059b1f824e5",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2ce45b4be3314b9e25f82fce1ffee3f0d052ba72",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1de401078ccbeff49e1f70d6d40ee91cef5deaaf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9e2429b0cd620db724b68083a43434a3d3902fff",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2aabda501253b3aeeb4bee0bf7b0d5fd87b038eb",
        "swaps": 152,
        "distinct_swaps": 133
    },
    {
        "contract_address": "0xccddf08278d1a31ff6023b5f0075a1ac4d786cfa",
        "swaps": 43,
        "distinct_swaps": 41
    },
    {
        "contract_address": "0x5ab85d3bb0daff2f42fd6fd07d3b2c0df94adac6",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9fb83639ad39e31d85d2a4f8164ce17a697f870d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2f87088888d3dd5a20cb19866bd62619cdbe8e4a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc150693bfb31129d6b9aeeeb415b958cdb73201e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7926ff860c1593e2473f6e28062e5a46230a813c",
        "swaps": 352,
        "distinct_swaps": 351
    },
    {
        "contract_address": "0x7d196c0c447fde421c72f88a1900bf3322f20e0a",
        "swaps": 83,
        "distinct_swaps": 83
    },
    {
        "contract_address": "0x7d760ba1df7ec334a2942b5e057b82fa0a5cab5d",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x57602582eb5e82a197bae4e8b6b80e39abfc94eb",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x29429e4099ed88884729b8fa800b9c65dbe57b63",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe231bb06eb18b920bc42a52bf33f519e1dcf8df3",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xdedef8a9ebd5fb001a596348eb825f0b9edaf126",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x695912673e6fe4d721111e3089f05b99cf0cc156",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd495c3e919c481289b929ace198f04032cf05a38",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xd614584f7636fbc22fd3a1bc3568ebbe21ed543c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5216dbfcb6b251e37424517ef4fdb650c95c91f1",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x3583b8c152fa1bccf54261768b8b681da4cbf84c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1680b6fbeceae147fa927ef4191caa7ff1d5196c",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0xfee69198b8ebd43dc4f557dd8340c7ceca390dc8",
        "swaps": 55,
        "distinct_swaps": 55
    },
    {
        "contract_address": "0xbddb96d54e1434654f8e46dba41120cd652039bb",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3a66c29b2544c888bbdaa7770d846b3537bea09d",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x402f60df5a6413c008cd406810fb045625f10047",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x825640365f289837dc0aa174bbb851e1463a2a3b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe2cf2c035273add485a7957d6fffdc7da378c5f0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe6452b610bfb8f89e88b1745fe8cf5ef67299532",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x6a00c96a55a02025dd9c776bfdd04ca2b76403e8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xac051cc5ad7036d0c7895e6d5e9e9662435b4cca",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9444acc23807c1b2c469ed0d2f14c471a65b65b9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa38069788b90a6165527fd1e2cd808c6c9a08350",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x0e0e628c4ae477b83ee28c19719aedf9e84b1388",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xca1cd0ba18dc68d87ca334b9bd527df5b1167a19",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6461af4f235b30780e10eb0d8fa94d3b9a37cb36",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9",
        "swaps": 595,
        "distinct_swaps": 590
    },
    {
        "contract_address": "0xc7f0a8ecc38a3ccc9c7e41985624d4403e11dac8",
        "swaps": 375,
        "distinct_swaps": 375
    },
    {
        "contract_address": "0x85df0faf7d9d317243b1f70987a95fb2ba88813b",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x176bb9ed529f51d4e69d95446d93b4a76cb73929",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x41ce4f95bb40df49686c623f80a3ae81913703c4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6dbac975a4f91e65800569ec2e813bdb35e4d99f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfacd7b70951fff43094c33d3a83a8c892ec78ad8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc6abc25554f73c433cc1b205b9c5c34e0ba03bfc",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xce5b8977f5021f1ef1232b1d4a0cfd03e8bcba9b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4638b3e2e960ffa98b18f1b28cf06110fef7acf1",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x4be3700c93b879b115bf0e35d69fbea86bf464ca",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x8fe4aea8b56a502b074ee8df84cfaa0c6526c0c6",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0xb37e760a2a63583a2a39d818bb2c79fc002d9d3d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa305a860bc0b2255dc10340e98190a6e8992b967",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x8508c3c65d8e3e9ba7fcf170eacf2f14930781a9",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa28fcba8a4937c04213b9177e327edb8c4554f69",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd71ab42513344dbe52dc3c072cd2d89d32bf575d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6b2d7c0cc9f75db8dd5228f329730bbc732fea05",
        "swaps": 118,
        "distinct_swaps": 117
    },
    {
        "contract_address": "0xdda1e1a0f0a5a6de8d31d1de0d64bc37c21296b9",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x11dd96470f77fa0a2c43df6cc49ee605e2146bd9",
        "swaps": 125,
        "distinct_swaps": 125
    },
    {
        "contract_address": "0x44b82c02f404ed004201fb23602cc0667b1d011e",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x74276857987726c3e4b523e1339e5a2093e9ad28",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x93ef615f1ddd27d0e141ad7192623a5c45e8f200",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0x491c17b1b9aa867f3a7a480baffc0721d59a7393",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xbb1d2c8bc081f397d17d3670c519eeae25eeaf8c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe5d4bf97f7486b72a89ecfa12611c8e53e9f09d1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9c432a3639203ea2602cf9b4a8d42a1e71b89b40",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1d608df1bcad4681f1b929110710eb936d7354e5",
        "swaps": 59,
        "distinct_swaps": 59
    },
    {
        "contract_address": "0x3b31bb4b6ba4f67f4ef54e78bcb0aaa4f53dc7ff",
        "swaps": 50,
        "distinct_swaps": 50
    },
    {
        "contract_address": "0x13305f843e66f7cc7f9cb1bbc40dabee7086d1f8",
        "swaps": 76,
        "distinct_swaps": 76
    },
    {
        "contract_address": "0x2f8fd97b6a26e0ffa87635c6527af1abf23457a2",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x5a37bfbba52235f61af2f4b74839c9288285cfc3",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x271590223f2bab44fdd6e6f6923cb13459a7c9e4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x68160c550c20780d44c4aa015dc8192911487051",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0fa212f78498cafdfb96b100747455743ca22099",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc9f164920d8efe8765c8a3d7899f4a6c6540d68b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x314957710daacd1fe9ffc250c5799a71df55059f",
        "swaps": 263,
        "distinct_swaps": 261
    },
    {
        "contract_address": "0xe11eb426206960e9533828031cdfed0b4b61749c",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x3a731f43ea089e28b4b02af46024ef02f43b0b0c",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xd6a88114dcc01f72d1b311ad6adf860724ff35d3",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x34f10571558345a17dae1bebacddd8d17b43c901",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0xbd773a2dead04ffd9dc75493f83d59c29d8a097d",
        "swaps": 64,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x68cabe105f6f0837db1539991145334731204439",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xd305cb82a2f090eabc4f8b2772362dfc0729d33b",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x59b564e74499f1fc18350dff238d86e8509fdfe0",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1a3713de5fe72ede1f5aa08d563da6c5d4bc2b9e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xac0ed4cceb1ae6c507b9925ac05dcfe8692ff8c0",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xe285e58034cc8669c757431ea83e98155021170f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc0182724b42ba597e4adee2740876a9c837cd0b2",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x88d5f0711358699dce627eb895da2e3d3be28ca4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x677dc2eaa492072436ab1735d5010568ea513c59",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x68a231d130fe6109cdc02ee931211eab13496991",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2deab2808d96d05044bf3494d7e5689f2ef7aef7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbd02973b441aa83c8eecea158b98b5984bb1036e",
        "swaps": 412,
        "distinct_swaps": 412
    },
    {
        "contract_address": "0xddd5fef8f9009d51f70282ddc823edb074062c45",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xeabf86e10a7d0475000147cfd5ac20b98b0347f9",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcd4ad3cd4bf15a15d04b75390e32ab2efff4beb2",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x0edc235693c20943780b76d79dd763236e94c751",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x64b6ac2458ab528d05bf3ac27775cbeac61969b1",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x273284b3c5fc85afe679122994d47ee278b8248b",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x8b25ffa951e93f442c78fd4f121a2eb5fa777ee4",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x15328dec67b2d9c90845fb2b789c8498a9d8ec46",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2fb6387394c89aa5a2e25eaa89aa3ac9bdfa70b7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9b662cc70fe12df0d86b9782cd67d7268c2a0985",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9f8a0cc4017be26e58e270b9009d236a1628aa3e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4811dae0ca5a1592d9adc5c18fab8b27af6f6f00",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4ba9d3b11e2a5997e3039531a24badd0792aae0c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf0dcde1a4e404e050276517a5b1b82f3c4a04f01",
        "swaps": 12,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xb152a8c94e0e22d23fea613bc2132c1cbeb5a51d",
        "swaps": 215,
        "distinct_swaps": 212
    },
    {
        "contract_address": "0xe202e3141602daa1c123f1e90bed6ad41bc8fd73",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x12da381b42302999f82c506b84d41dada46c2a31",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x6c006ad8d376a8da7b2f33fc478923e27a1d70f3",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xfd0d8283c7808c9cd21220ff409a016ace5797be",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xb4d4ea5a9014c3df89b77ef93e40c0c839634cbd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xacd50fedc46fefee64790eab404eb52dec9e3ad9",
        "swaps": 66,
        "distinct_swaps": 66
    },
    {
        "contract_address": "0xf09739307a5e49b1ef73f4a9efdd1795e876acb9",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x26dd907d1e80537003de514574d1e5181063d989",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x6ccd623a2002f5198f7acd94011af1be0a193307",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0xab37d9048698dff0f6bd01c6b36620a1105be823",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0x50e14133eb50e8d9549a9acd609c9654c4989967",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4bdb794bc63ca0418b7e89a83d83ccaa2699eabc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x854d3639f38f65c091664062230091858955ddc2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3206f7cce5e3400c98bee8fe9b51527c5da479f9",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x944a8b12d898e878f92cfc18eee5e6f3f7e2e70d",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xa1d88ce0d030b51342a05f9dcc10ac4214592dac",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x229f8ab5d51cb78d84319f4012363b2437e2c3c4",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x611a9fb1d35954687e9b189e45a1ba7d3ca26f82",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0c787944946d22922c9f41c477cc539700d35bb2",
        "swaps": 206,
        "distinct_swaps": 199
    },
    {
        "contract_address": "0xa67d2d784e07dfd150d6443fe24dcd2923122302",
        "swaps": 100,
        "distinct_swaps": 96
    },
    {
        "contract_address": "0x3d3a6bcbc144915a21c289e9f0041813074f75c2",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x438c93f9db0714cd6c029e1e435b0a3f2ad23ffa",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x1f40255eb6515a9aee98799dcf64f3a87bad1f26",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2b8d947eaf4bff3e68b684a7227a139bcff48d7a",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x600606c73d802a165883b57bb8dea17cc4dc5ac9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3fe0fba711dbfd14ead97fcb0cc6cac82c961e9a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6900a12eb9eb638b1e62334fb056b6afcde4ddec",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdfa81e266ff54a7d9d26c5083f9631e685d833d7",
        "swaps": 119,
        "distinct_swaps": 119
    },
    {
        "contract_address": "0x47dec9ae841095abfc003e5c06db67df10a9ec9f",
        "swaps": 71,
        "distinct_swaps": 71
    },
    {
        "contract_address": "0xcc651870eceb6e2ee7cdb065c9a46b433c3bd9f0",
        "swaps": 416,
        "distinct_swaps": 415
    },
    {
        "contract_address": "0x58401db5ed194cba60f2b7d59b9619d54e0b493c",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x0de92cf4e6cbae4be36a28836b1f04daece2567d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd64ecd6a455564c0f7dc6caac79db7de93310da9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x33e05dacdd6254fdccadab11ccf69a2e877dbc7d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x8a98d83a15558cd067b8c350d9feb05e8ebf850b",
        "swaps": 24,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x7406148f2008bfd5bd8805ed0fce1f680ee6dad3",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x62f089467e22de4bc1fb5ee605ede7e782b76b29",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xa9085ef7343617a50a6af6c18f25e6f38063b4ae",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe88e24f49338f974b528ace10350ac4576c5c8a1",
        "swaps": 213,
        "distinct_swaps": 212
    },
    {
        "contract_address": "0x51b9dc2aa6ec6d04af02c117a299318499171c5b",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0xeca5fcef4a1e348ba35f10175bf3b74c9d3e591b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x398cf9d85c8ddf0ab536f3e2c7d7f1e1236fb93d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xd18d83eff262723be3609baaa6c05044bf956459",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x64ab06e0ca88f1984e750cf4c2d167f57c79584d",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xaa6724557b2172024cf03c36ee94ef7c1e521976",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x00510ea3f8b883282d0cb497ff90f82a310fa962",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x63a36609d608456eba4301d3cd77926bacabe0ae",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9423671fcdd9d8665acb6f98462a879258e4dd48",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9a4918efd8e086d0b127fc23b6a0b75c672b09d3",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x4cea782566645d42ca8cfe495ceba2a7a66b19c4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x80676b414a905de269d0ac593322af821b683b92",
        "swaps": 144,
        "distinct_swaps": 144
    },
    {
        "contract_address": "0xb930bb9e4d4f513fe28fb0e7f1141f5223a2b644",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xe75183e98fd42e6b88d3a05590c260030e1407b3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x52297173da552e833d548ebbd7616f9d827ff3ab",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xca28017d00fa52c06e42d668b831d6a794d89eaf",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x7c76b6b3fe14831a39c0fec908da5f17180df677",
        "swaps": 66,
        "distinct_swaps": 66
    },
    {
        "contract_address": "0xc6d245565d5c3934e23b120902903dbf6bc27fce",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xd150780bcf7960db143c21381fd343631808d62d",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x84a5cebca32c122dde3db46fc0d655ee63af7b23",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x5a9f3695e706cdb6f73706bfa4d5293766a95be2",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x7a5933e48df7a69e82e3746915125328c6517711",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0x4503d1e81362e436c3b68f49e2500468f204d871",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x01f8cc4c7284adb10bbec5d14fa7c35ec8911bfc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x074e410929f0a23468733b03be22712c5d3e64f3",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x8d0922fa2a4be69cf0e14c3eb8c55218a7b3ef3d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x37058311576779fa22c310409828b1cc16b39046",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf161e358b8aa763d378176d8b098b27678d4279f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x003251b5e911f3330479c0b5c5bb1969fcf3d7a1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe1d9f24558aca13b59bf49b1e31336f812945b58",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x1b187ac5ffc3335b5f6dab6193f020cd2fefe3e7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdef834ae4a1198bfec84544fb374ec7f1314a7c5",
        "swaps": 1724,
        "distinct_swaps": 1724
    },
    {
        "contract_address": "0x5ee169f4e5e2ff0f47d8f966c7dcd418eea792bc",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x6a2b638e51fb3b4be0f05e958bfdd22b1957f237",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x5278a593fa07f7ec723b992d293f4edc3ae65927",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xfcb4e8ea1cb8e9b4e1b3cec9d5e110fbea260100",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x2441cda6087b34724a2a8d57da4ba50326800bf5",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x48b01cece13f9a038768a349fcb5c2a55c03abdb",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x40242e201ba75563ee052117024735a342377e34",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xef3cfaa0ca3c4d62893ed263d14198df0b81ae29",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6bf6a2c92e7ae82ab58191a1cd924ab2013352f9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa6f5cf768a0a9d0ee712491ee981778602b0728b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7f06ee760a7f604b84836b1bf700b984acd5d4c6",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x8b6734217e1c5914cb729780fa9557629ff5b427",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x47d94a8ec278d06916bf6ff22c0784d20c046dec",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x7ce38f49d696255aca849d2bfc5c361b4e5c405d",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xd2fed3faf7cd700cf4b8115846ad5796d0ac9508",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x09ee9ee23e70a7b015fe57a3cb5cea0100c2881a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x93eefb75af38e557aca86479002e158fc2efeaaa",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x15a523d6410a7eba2b2f430a9b59b66d0c6d6e0e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x501082e1926a721cdcb1254edebaa0717d2a0d91",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2dab440dcf557e306ee47e288cf57ccd154e2f64",
        "swaps": 131,
        "distinct_swaps": 131
    },
    {
        "contract_address": "0x7805b64e2d99412d3b8f10dfe8fc55217c5cc954",
        "swaps": 172,
        "distinct_swaps": 172
    },
    {
        "contract_address": "0xb18ec753acd9ecbfdff996a5eaec3bbab823868f",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0xe1c99c7481421e299bf3945e5e91817e6d60c91b",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0xccb65f861266ef7def8bf35d4247e3ffa03563c7",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xe045c97e0106105dbd4a1866310e506d3121388a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x0e7fd04303e8bcf23b00b8ce1ae92c351492a939",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdb1de0dd5ec79680551ca5500beb206dccc9d779",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xad31838c06f7ada5a478d726c93fb84f674f6a7e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1e6229477dc68a390c33c2e1f2d2d7eae8f91952",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdbed7a7bbcabcc5c3745ea420f52a86d69e51949",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x10693509b4bc2871aa171cebc8f41e8e19c604d2",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9a0f4f4aae3fe4168c85704fa7878af6be14a8a7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x955276aabda1b1acddc9c811e9ff1e22b8cf81bf",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x204a7adc76db7fe8c5e5f499cb3c4cff6d7282c2",
        "swaps": 53,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0x7007535de9f864f0c15fe6fa288ce3feb842f72c",
        "swaps": 105,
        "distinct_swaps": 105
    },
    {
        "contract_address": "0x45156772186b1f93a8cb73da002e4f33194302cd",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xa28ade2f27b9554b01964fdce97ed643301411d9",
        "swaps": 76,
        "distinct_swaps": 72
    },
    {
        "contract_address": "0x71bd159cf9136d038a60f10118741dfcb10c3111",
        "swaps": 76,
        "distinct_swaps": 76
    },
    {
        "contract_address": "0x289cf2b63c5edeeeab89663639674d9233e8668e",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0xd9def9b9f7a82237dafea3755cb59269bba5bb69",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x1427a0d896b32b95cc14f1cd804541ab95361fe5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0fff8501d25ba2c4c126de50ccd35317b7ae8fc0",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xc9231c18ad2e672001bc274f01ddc9ba2caa2bc9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6ea70d160dc965cecb08b988ee31b27109527c0d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x28ccc6a15a2e6fa8c09cdde9795417e8a9cd6edc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8a8edbdc9e56ba2e8f91a5b875e8aec6c71dff2e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb6c3740728ecd2498ba9754c5e107ed291b93761",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x2813d43463c374a680f235c428fb1d7f08de0b69",
        "swaps": 531,
        "distinct_swaps": 524
    },
    {
        "contract_address": "0xfbc22d81dafa8c841eb6e6396073d64cbf5be2f2",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x71083873027583cf3b6a94c5baddc20482c587ee",
        "swaps": 81,
        "distinct_swaps": 81
    },
    {
        "contract_address": "0xc1d7d5f3b028ba60bd41705dee70237f2268f19d",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xf74c3e7336f16b05dee628d155f0256e0e0f409b",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x947847eb54079295383808c80a42ffeb6591779d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x1bf4cc9f133e0b4a26f9ec1e6dd08309ea7f2a40",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xda26da5a8323f62521eafc764ba2c040bb15ff54",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7f1ae1e75567ef08a8d73f37ada9a65a3d5f8e4f",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x04d2d843e31017ca1d9a2801900cf6454103fc17",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x5d9d66ac0db91ec463fb3e9e5b1513dbff02fd0f",
        "swaps": 67,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x44269e6a34f7d483425b1b15e7b2e106a07016b0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd9dab7892d82f4693eb899d9f8d9e0eb407dbb04",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x0d3ead249fd2b20057e25b8ea3fa0407b100b423",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x7fdf6932d8e761c75922af0d4acd04bed36a8c8b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x44c077bf461668b865a45ad07b14d60387184ed2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x20e907aeae4b12037fc4ce4fcad7d31132db7731",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x490b670a7474d501a1e321e7ff5b98d78a254782",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xee28c64091f9e06437a0ca99961900ab401cafbd",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x7ce6c8a7e1d4e7e2d240f7568eca3dcc6fda62cc",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcd7769dabe31e774b86b2fcc517e3c7049ee309a",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0xa6561863994788ce722e7682a9c765cd1a093ab8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe953c42565c2ec7504d78899b31f3371d16ed231",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x11d1f8353ef333138a6c01054ddd984d0212a51f",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xbe5f408cb6d818c9ab5fa97c89aeb934e1b75eae",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaba0e8869bdd0912116015f5ad68ecd30a356d32",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x277d9b07671eb9ac0d5d63e15beedc0adbe3e9fd",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8c5223a5a33878d7c43ae2f16d511c2759d44289",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x30890d1a43e74edbfb2340fdaeb5b49dfd7f3360",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x1660bd8e2565018ba865412b8de2824176deb46e",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x305eb24f848e3f02f13602ae93ddbb73ac7e1958",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x91670a2a69554c61d814cd7f406d7793387e68ef",
        "swaps": 441,
        "distinct_swaps": 439
    },
    {
        "contract_address": "0x96ef9cc9c8e12909313f1fe65ce46b0699ffd259",
        "swaps": 151,
        "distinct_swaps": 151
    },
    {
        "contract_address": "0x0a4d7ad30e9f18dddb6a3a6e4fa3cbb3aebbda36",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x74b93d74217ff7b7d10d2a3117f9585bf11d6003",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x301fbc9ed63b32a4a98165adbf06294f64dff3d7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x85374e07d6d43747ffee07e8ccd0f603b80d3589",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xd020af040d247019520cc5031c5e2baa0bbaf9a6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x7c02e95a2b326c6d2bd2d5f69d60c205ceaa59c0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8992c5decd1ae8b0af9555fc2d6905fc05f75a69",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x4aba0ee33acefd918ca9751a3c67f8941b0c6623",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5e15f128ff44cdb91de36eebce7d29f49d7ee85f",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x7a1ccfaa8d636063c95cb122523bd46924c19ee6",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x77af79cb5328859bb62d1b4b53b5e6e3de78602d",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xebec1473f3f4c4914bde0903e2ae40e21606c1a5",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x90498b6a4b9adf226b5041f36cdab1104a501750",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xff809f74f1b4da103019f2338e1f8a9c0461ee3c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf2046f95621f349823cc1a12d914b2b5193abd93",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x792a5a04b6c1357f7dc3da620621b437739e193f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x69c4ceee04a3552304a17359859ebafae1f738b5",
        "swaps": 6,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x71494cad7e2f0b1f9a028a45d79c8b0149244fce",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf9036befb2f6d58c590d78394aba0f8ed3c6b0ec",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xbf0ea60f6dbb35f9bfe9ea5b532b7795772af541",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfb86c2410050b0034386c1d97291e63b72749eb7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd87fb298448e10aab1124d55cf3b78df51b6ad18",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xb094ca073bcbb031345f44ff566ef37a9bca7994",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x41ff54b8bc443b333ae0476458681ac95725c771",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x43b978c1755a397fb20d1690e9ee57a851fd9ea8",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xdf870030bbadc9e5d77f1015661b6d21c756e608",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x6c6ac1c806379877b6a4ea236b47890b9d195ae4",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x0213695eb4cf4f795397fcc6d3cd370143838e36",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x70ea737a313451bb71e2880db2cb442dee9a7f1e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd33a2038ba64c8dda32402db480f4902342ce99d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe6b7a119297566be65c410d8d0347984c29608eb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5ca6ca6c3709e1e6cfe74a50cf6b2b6ba2dadd67",
        "swaps": 1500,
        "distinct_swaps": 1495
    },
    {
        "contract_address": "0xa789324e64268c5385ea7678435fa83532705b0f",
        "swaps": 496,
        "distinct_swaps": 496
    },
    {
        "contract_address": "0x451e5cfd20f5cf1318b09e712a5719182b2c8963",
        "swaps": 64,
        "distinct_swaps": 64
    },
    {
        "contract_address": "0x9a081fee95993094dee151809760fa5007be943b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5adb38019452c5deebee4267dd2c84b5bb8682c4",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x1df7adaed1f7f36c822a3079198815b284ad8475",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xdc6ff9a2d0518194cf88b437e7268242f126e553",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x935516695246428cbfd2a3d24246a03c598f6ede",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xba4bcfa1e02c6e9fa5ffe8a220fb6403e2ecc36f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8da8e328114c490809330f767281e113eaae0217",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1002e8723f74f18b717bd9e9b524612ffd92b5a6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x849964de7c29326c13254a39b39d4c0067ffe914",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8531c4e29491fe6e5e87af6054fc20fccf0b4290",
        "swaps": 584,
        "distinct_swaps": 584
    },
    {
        "contract_address": "0x69695690b7c8394460713744b0821b46fc07ce23",
        "swaps": 128,
        "distinct_swaps": 128
    },
    {
        "contract_address": "0x54a4c403bd6aa68ce54e942a49dea6e6d25b051d",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xa641c96da7060481ae54684f716651c4041867c4",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xa2746d6e147293d4f7ef338a3cc78cc607396cd0",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x0b3a76d33d93b2651dbf03b102eefa9500e89243",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x56e0b18d8fa6a5217ef2a4ec42a31bf62b04bbad",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x8eaf6a2a08bae715ead35d019ba2bba363862b8b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x672d327b87b01f24eecad4a5a245e3cd43928c6f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8bba786346b8975738ae0365a04257891c6bc64f",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xf3c05c4218571e8ae12554cf23e40f1c472ba524",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb79c1de08e869c24740dda6e9a452b739ff53a50",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x12fedb847fef471d5c6f827aa0be270b7d9c5d91",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x6efd9e71f18a817359e4cc7d86c88e4781878be0",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb068e19374d45325a274e2ef40670c9303955920",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb82b5d256a7809c29dcf09b7c623823a81ec6e5c",
        "swaps": 37,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x90bc3e68ba8393a3bf2d79309365089975341a43",
        "swaps": 244,
        "distinct_swaps": 244
    },
    {
        "contract_address": "0x6309d302d00fe6da92e63092693f670274077b19",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xc6421bbae87bfa1b1a21e7a7cf0ac233f9723cc4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1293571e22a466ecef55a6c877ba96ce5249e0bc",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x63894e0dfaba4024cd839d418cf1bed16b62f34b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0b61ae19dc898d15152046c4acb8857a95dfb180",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x709b0460f2a321757298295d90dc1df256739a15",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x484fb2ce837bc8a24144b7d50091d46556f5e3e5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc58b60c900f855676c2b3fac5772851defe6c714",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xabee7668a96c49d27886d1a8914a54a5f9805041",
        "swaps": 198,
        "distinct_swaps": 198
    },
    {
        "contract_address": "0x344454e98b0803c4eaaa3e00148c7ba10a335613",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x1b59b999f29f04df7a31e687b2e9bb5f45195789",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x7e98014ccabb29136b9139751a76b73a077c6a8b",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x6fd8aae9f85a7db14c45453daab81aa3085e4ba3",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x72dafc6d0cfe16101c5981d71310f42f813d4cd3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xedc270ab3467d764916afd9a83d60a741cbbc1cb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x26540b2c7ac9f4b82f0ba99b3c1a1deb366e5b21",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x1fce8cbfe5ef8ead551ec20531dd160c726f4320",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x4521b55267f7e76c21361e70d1fa49056ecfa877",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x26432f7cf51e644c0adcaf3574216ee1c0a9af6d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa676e53a4da4730421954ae8e282e84a33e8ce92",
        "swaps": 101,
        "distinct_swaps": 101
    },
    {
        "contract_address": "0x2ff463fee34a15dc2fce02209ae65c6bfc9a96dc",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x8000fe11cffa3ced146d98f091d95c9bc2c55c97",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x43efe1479472040a0abadc5931177ac87a25c1d7",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x59cf2afc98a08f8bf44b6224a360887b819c0da6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x770e952c6a2f2f7d1352670daf745b1e25341ea2",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x82d51f582b2cb90d6b7d2543e2320d5a00a1928b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5d7ef765943857649f80907b857358d29aba3beb",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x0732cce5e972778d7815ab7dbf48c71767b80207",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x60aa0df7961c603b499dd3e0c1479286933ecffd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc8596a996003ae3293da72bddbf79d1f34040852",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9ce65ae286e74f1268d19ab9b25f102c25dbdcb4",
        "swaps": 525,
        "distinct_swaps": 518
    },
    {
        "contract_address": "0x18e2577d162a59e290283076892cd93b19e66eb4",
        "swaps": 160,
        "distinct_swaps": 160
    },
    {
        "contract_address": "0x43505c441992e381bdac8a648e4104e9cd07a842",
        "swaps": 276,
        "distinct_swaps": 276
    },
    {
        "contract_address": "0xcc203f45a31ae086218170f6a9e9623fa1655486",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0xd911c52c6724ad980c9a5229082af2322d812f77",
        "swaps": 119,
        "distinct_swaps": 116
    },
    {
        "contract_address": "0x3bbe1db735dbe74cb0af2015321f88ed2d22c799",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0x80918333bf804e8ccba8a27ff7956050a1fb09a8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x36d0e6b5ac25862576b21ec9aa1c5a500a3dbddb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb43997d7ae3f53b94575fcdb2fd60faa2903d265",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9c1294853506c06958f7d037fb7389263eae2656",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x195493e55d5d8186d9d09bca881c84d8550aad85",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x9f463e4d99c4fee88cabb644e72ddfa966e158dd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x523896507609d02b7e8d9b77faeb5d03e3729574",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8ea6957abfd7c4f1c3e5f485c58c80da33c6f04d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xced07874529ad2d3c6c7a0949bb2a64901cb3e37",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x1e08a5b6a1694bc1a65395db6f4c506498daa349",
        "swaps": 46,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x0a6707511aa81374f9411220960a893928f1db87",
        "swaps": 114,
        "distinct_swaps": 114
    },
    {
        "contract_address": "0x759738096589b9c39da78a603565635a3cee6013",
        "swaps": 63,
        "distinct_swaps": 63
    },
    {
        "contract_address": "0x0d6e1cd9aead890d92fedf11d2a08b4d5339122e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa81643567ff913230c9ca868ed2b83e19e05a525",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x20baaf9387216bc3b7d98e78e7e8fb9b4180493d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x45e7257879f82e9bb80848659bd3f83a140187ff",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x951b6442ba9f3a7311dd70a229b4e7092c790ad8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa9669f4a03b3aca76e49cae46702fe1c454c31bd",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x60c088234180b36edcec7aa8aa23912bb6bed114",
        "swaps": 384,
        "distinct_swaps": 379
    },
    {
        "contract_address": "0x0dfbf1a50bdcb570bd0ff7bb307313b553a02598",
        "swaps": 97,
        "distinct_swaps": 97
    },
    {
        "contract_address": "0x12116a3db26b0e7c8507f242638ff3cc0cd73069",
        "swaps": 58,
        "distinct_swaps": 58
    },
    {
        "contract_address": "0xd0a4bbb49ddd36b0d832d485974a2387d81dbdd3",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x244c98cb5e82671c556da02fe4802cfc6f573fad",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x2ff6798b7b5080ef30a0e5dae92b0da50468f85c",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xf908a0e2fecfb491c1a3b597c37d43cf7facb97e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x09bf401e74da065aa6119b515f36006a2b181f5d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xce745542fd02c3463daaaa0e9cade68156b11eed",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xcf3587305b654cdfbb8f7780be2a8e545415b334",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2d10b334646f6e61f2556c0f7eda2ff3d82d001e",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x118b2f755ff8fce521254f637193351519ee3469",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x4b59be62cf23d3abecd50a6a85e86e21bfbbc0c9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x728a94e1908f7d60b7225b17dc37873f59390b84",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x586604208280a513925ff6cee029e69ded71fa56",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x1a8d98914a5b3164f64ac0b0786c7502c8c9512c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xec22a705349f97a645c71b56323cffba18ba49b8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x145e99a991a1594e76e2ac4f329bfd6ab84a95bb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xaeaee7b56513a37a9417bd6b7ab500334abefbee",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x497f87686d51556510a1edaa73a7809bb1bd5356",
        "swaps": 53,
        "distinct_swaps": 53
    },
    {
        "contract_address": "0xb0dc320ea9eea823a150763abb4a7ba8286cd08b",
        "swaps": 571,
        "distinct_swaps": 571
    },
    {
        "contract_address": "0x95abca1339dd008ec70f2f71c7f1b024ae3a9232",
        "swaps": 153,
        "distinct_swaps": 153
    },
    {
        "contract_address": "0x458ea4ffdc7157331322286d3340fde841224c7b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdedeb36b03006d545d244b6e5818549fed805ceb",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xb96fb16fefd59e51d4a76be6050df3e50c916451",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x04c26e947f4280b0a35f8d8a9d995a7219e65210",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe8087459ff0b9abf3528114c1f616ab0624a5479",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x332bc9c7a9bda5e15b39179cb1f11dd0b67e496b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5f1b5ff45104e957752aa3a64da0fc03b5f94829",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x14be05a3d26991f07288f4a0c85a8d54afa36a80",
        "swaps": 187,
        "distinct_swaps": 186
    },
    {
        "contract_address": "0x0d4b195f615982c09eec2c3165b25d98916b71e7",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2e6a20f2ed686fb966a2226a4255844520551794",
        "swaps": 100,
        "distinct_swaps": 100
    },
    {
        "contract_address": "0xd8ab3a47e55961af6ee597d8b3e0a59eba5053b9",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x8cf24da57eb6f5881c13b14aeb48c49df6b034a6",
        "swaps": 56,
        "distinct_swaps": 56
    },
    {
        "contract_address": "0x4d71d415eccfdc4759166e020e90f6f5d55a489c",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x34908ec7f451beaa88c46c60a394cf324f86f67e",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x00d63869444c3238609a0f63b18253d47fab5bb3",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x13eee175641d19736ee051b381cd28dc8b09f9c9",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x67f2e377f7aec56adb20cae2baf625b9c8cc5749",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xf047c5fea5e1322ac257d65497e0301f66fd116c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8eeae5cc6609c834013b357d6330aaf4ca36880f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbbbd54c1cd649288d2e584917778eeccd8d8254d",
        "swaps": 59,
        "distinct_swaps": 59
    },
    {
        "contract_address": "0x0432a3cfc2991cb365af22d2862a6c33fccd3562",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x25df01282434376cde5cfbb8901d1093b04445e7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xce00673a5a3023ebe47e3d46e4d59292e921dc7c",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x77bcd2b9d087f4d4a33ae299fcb8e47c701299d9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x417e16966815679f7d450558d642eff5743c25e3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0e2d9351aeb756a5d4de1677557b28fcc00c0d3e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaf1903678d352d7997f8487909f07b1c49d4af44",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0e145c7637747cf9cffef81b6a0317ca3c9671a6",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x35f8b497e201a2c7ae641d386162b10f772b65db",
        "swaps": 292,
        "distinct_swaps": 287
    },
    {
        "contract_address": "0x6583dd93f9060a919e2b3f1875985d606d0eddfb",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x0de2fe087a1b06b0bf00ffd08cd4348faf89cf0e",
        "swaps": 34,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xaed84342473300e676f49a574a4360465a79bfb8",
        "swaps": 13,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x6ea88502bc127ef1a7f45fac6b7168fc0633ba51",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0e4e7f410c55229794798430718a9b2b14f0b185",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x57b3a99b0adc360117d0c5cae12c027c67b161f1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd5c04fc44de65a230b0b85c27e389c335861a298",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x39b2d30ddcb169df5cd7d9d98e4479ed0feec010",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x30933831b71710d0551b518b74032242b2a71d2c",
        "swaps": 318,
        "distinct_swaps": 316
    },
    {
        "contract_address": "0x610a9007fd86c960ccb717783f88347a2c154d4e",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x116ff0d1caa91a6b94276b3471f33dbeb52073e7",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0x08c170fd3441b4501c2d0a5beb99ab1387bd820b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x1b9c54a3b92b3423e6eabfef4247052686ea7002",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x19a9ee116401f858639cbd8e724df28b25b4ca5b",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0x14be08003f80b5de41519d5b11ab5dc6d3814283",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4aada77b9250dc0cc3b1ad07315bde28ecffb518",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x05268a4da330bb7139a7e4463f9c699dc0ff8509",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe1ffc59791ac0b1614b1c5f434bb946abf03061d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7ca193c5886d4c662bbb2f8f2a5ed9f5be84b1d3",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0x20e28214946b4e0f18b2c1aa7c976df087695a5d",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0x9a4b2ace5ad11bb7e83736e4dd0ecf01b0feba12",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x2a7d27d8e4fcd52f4d285bf15c227a26bcb36e76",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0xea4da1117dbf85a0a2938f1183ce467654f2a20b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x2ae0239fce72fd5d4c93324b50720c9117d4ee17",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8f3f0f54c9f61c709a189c8a0a274c641c70a62f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1ce894cd69b1b1c4ea21f1c6d998c6de757d1509",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8fa6c2dccf3f1ddefd0140e9fe850ef293ff62f8",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xa910c27162d4238061d374d19d2a4b4ede7aec6b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x291f840391ff6f521ba16be03ff1db0a2b15b0f5",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x6e76fcb1e64d441b75721021f6b8e4fc1b41f65b",
        "swaps": 232,
        "distinct_swaps": 232
    },
    {
        "contract_address": "0x68f36cba7157e3724e5d3f21064c01d2d326d427",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xe0071731c4de98f3c8125f0703c1ea378418df0d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0843fc0f08e3fde90de8e72bcff23555be636755",
        "swaps": 55,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0xdbe516c17bddfcfa721b0f09b4b987741690911a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x83b54d7d13e7f9ab89af93ea1d33113f129834cf",
        "swaps": 89,
        "distinct_swaps": 89
    },
    {
        "contract_address": "0x7ceb74d0ff00907fd53024119460eefd8fe2740b",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x9f03309a588e33a239bf49ed8d68b2d45c7a1f11",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x4e217c4d260cfb7b2fad03ddc55cab931ee53236",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x3ab5dcf8e7ab97543dac941fa2343c527837d329",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x545cb3055e62c86f54ba479c7cafc7e1e2eeec54",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9cd021917e266b10d2972045d08c7db36ce479cc",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x8b8deafcb6fa7d60c45d1b4819e85d45e0ea65b6",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x8792b62d9f4287b0c591945074d5f3a2ada55670",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xee1a4a2784de6f25c42848f7c82fb2d314d1d80d",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x80e221f9d545012818450920c8ac24b091aff6f3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xdc12c811fa1f4a7227b2f7c5a8faf6ec7db6b397",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2db8342ab02f224ba4d531650c4b25fa38e67912",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0fd7c3ae468a2d3d360643205bc8b8ab39f2d317",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x4f4b7477850466d96cbcab5b74e58150ed0f2b24",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3a0e378aebb668e1ee0cf74dc7254d81d62514b4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe89fae1b4ada2c869f05a0c96c87022dadc7709a",
        "swaps": 331,
        "distinct_swaps": 328
    },
    {
        "contract_address": "0xbd1769953e56313cd32f2d1f8e58fed7477f8b40",
        "swaps": 127,
        "distinct_swaps": 126
    },
    {
        "contract_address": "0x1607fc872e20692b9e51fa73ebc836c1608d6e9c",
        "swaps": 49,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x8c46464c317ff575a2e004da005e016c54fa47e8",
        "swaps": 73,
        "distinct_swaps": 73
    },
    {
        "contract_address": "0xc80f7d47c62cb1020d009e02458eb9421c9d9aa2",
        "swaps": 18,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x37f382741307eb62f8df06693c104efd67053299",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x131db18fe666370b377a7408bc756d6c6737885b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x77c788dbca1033092b2180b79dd382bdadb11e9f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6ef3a9f7703afb1e53c0510bf52cfd70a055992f",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x556746516352e1dbb9dbd3870494e75fb013a9ce",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x3cb10463648e3f35ed7c5b64394d482a1b7287b5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc6a23bdd628c3b17fc0df270e6bf8e48511950e2",
        "swaps": 120,
        "distinct_swaps": 120
    },
    {
        "contract_address": "0xe8c9bb82443c55d1c0bdd12f7e9cbec5974ecf43",
        "swaps": 27,
        "distinct_swaps": 27
    },
    {
        "contract_address": "0xef77d1e8fcf83a4818f6dffc73ef682794600c10",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0xae2f5519c84b1d6b819e4d30daad35828dd85c2a",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x1edb2d8f791d2a51d56979bf3a25673d6e783232",
        "swaps": 103,
        "distinct_swaps": 103
    },
    {
        "contract_address": "0x6ab18497ce09774e0873145d25059ec659bcafd3",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xe10ac8f11641707153ebf3bcfbb1592959a9fc01",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x814b455cd434f8b8fed322a20359f25bac5bfa17",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x458f1f4ff94e4dbe80d016d67ec05914858f3681",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6d9e8dbb2779853db00418d4dcf96f3987cfc9d2",
        "swaps": 1091,
        "distinct_swaps": 1091
    },
    {
        "contract_address": "0x0509083749716b68f0fdb490a59ca62f2cffebb9",
        "swaps": 121,
        "distinct_swaps": 121
    },
    {
        "contract_address": "0x7b3930151d85e498ee192b4e4b921e33a83e8da4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x14e418722a9794157fd33e51a7826ba854b2dec2",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0x9b7e966fe005d616b5560e4baa7cfa8747d6cbb9",
        "swaps": 114,
        "distinct_swaps": 111
    },
    {
        "contract_address": "0x84964d9f9480a1db644c2b2d1022765179a40f68",
        "swaps": 113,
        "distinct_swaps": 113
    },
    {
        "contract_address": "0x3c2646a14b43c872a09ec9dc6135fc5920a50f56",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x39bed7f1c412ab64443196a6fecb2ac20c707224",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xd10bb4ed281a84492343573885168027cc625bf7",
        "swaps": 94,
        "distinct_swaps": 94
    },
    {
        "contract_address": "0xb514575a02dccbbac17436ae3f39eee7897ccd7a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3f4d391eaa73df4616918c544f495e12c48a0ebd",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x8888e030cade55fce60f1759069dc8a8ea3e6666",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb979b2884b79d9aba2f85a891d7414246ae2d64e",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xf734c0cee5b9165781504d0f05b09c36c08e7a11",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5b5b5712a8e87e5b09781a0cf23937af975c7465",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9e73fe429a53aeb2c5409b133e92cfa4bb5b3bde",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x86ad6271809f350522085f95f5a67d46ff7ed3ab",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xad81a6476009ac1a70315a43fdee1ea62681f42e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3402bd2db9d5a7b1cb82f95bbc309da03726c83e",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xdc3446f7088d5b03933cab2dd00c4b0777b3fb5e",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xa7c4754f4c5e58d5fcfbabdc7c2a8684296a32ae",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x715bcb011bdb9d4b0a4980a36f721f968cdfce0d",
        "swaps": 15372,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x3c129c795385bf1076f6e87158e78d3671d9480f",
        "swaps": 37,
        "distinct_swaps": 37
    },
    {
        "contract_address": "0x9aa76073ec48511c74d8e5cf757896c7d16ba772",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x3e0d88dbec4bd3a23ead23baea4d425415c452d8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0934b46640f7b79910d4f1a937233a0e8d02e260",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb5d19d03a7e4b77adaceb697caa72f8ebf061b90",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x4f5df10b9991482bcd2db19dae1fd0e0184397c2",
        "swaps": 567,
        "distinct_swaps": 565
    },
    {
        "contract_address": "0x8826c072657983939c26e684edcfb0e4133f0b3d",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0x73cb437a96a9552b98a67fb2fec53a082044433a",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xd7b3132b9aedc86e6cd28ba3b29da6c30c049327",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xd86dcf63cc138106f7c3aa45e355ab3219217ade",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xab9733ca1d6d1ec771febc3b231488a3b0184587",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x87ea3f5ad9597c2d250052b1361aa0d941edb352",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x1f2a4b42c97a9411c0b33598a3b1e642aad5182e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x90a006d857ecc78d0b4def4abcf9c13dae51c6fe",
        "swaps": 4,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x2921c2bd5dd93acf96181873dffa8ecd48bd7a91",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x47d8368dcfb5f5c497f836ba1a364cb104d7c8bb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x20ea112c1a20f5a4a34dc1a0aecb5108f3e951cb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x29aaea573bb492ffa63ff2c0f009b6fd440f545b",
        "swaps": 79,
        "distinct_swaps": 79
    },
    {
        "contract_address": "0x69fc300a4819dafdc9d6120b85c5336db67c7972",
        "swaps": 52,
        "distinct_swaps": 52
    },
    {
        "contract_address": "0x55e113a451e600f801cfdba3e64c381f91505762",
        "swaps": 29,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x11429c17bada0d840854420619d170a16fee34b7",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xfe0c00bea26fe4b6d0e33739fabc1117279369cf",
        "swaps": 1243,
        "distinct_swaps": 1243
    },
    {
        "contract_address": "0x5dc1eabda3573ad6098c5517f49b9c463fe2ebcc",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x64ac1107923413b6faf0168e2063c1d4cb01bc9b",
        "swaps": 75,
        "distinct_swaps": 75
    },
    {
        "contract_address": "0x78ab0473f67d549daaf68b6be9446e249d9c3053",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xf64b267956f97c44a7948fe148f9036dfbb6dc7d",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xed4ed2d0d236799d076fe747a2ab1812e64267a1",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x5ae78f512f815ee96751005ca13136c93b3b7727",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8e1c8df0976675118a4109a85aa370870bd61f12",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x8e88112eda5d8ff248b03d955d5e11c08c32a637",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x10062ec62c0be26cc9e2f50a1cf784a89ded075f",
        "swaps": 61,
        "distinct_swaps": 61
    },
    {
        "contract_address": "0xe5c1b80ad67ccdfe387c57a136bc92edb8f73807",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xdea6d004c5a2b50d6e35c7b93014d03feaf03f62",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xc2c88da3bc73d927293e4c516c446f87884b84c6",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x0345b4a46af058609a3ab337eae4c19ed6a72629",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xdee9b666adad1606bde2e4075cf64018f21eaab4",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xf716a43d66c40ee90df429af2459e580c1afc09b",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x36d530adcf8a5d6ca5041040d8f4dc2b89f0a9d8",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x9ece2e412605ab4ec1b11c4757961fc48c879e40",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xaa5843865437ed4448bf95904f114264f0e4b113",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x3a1490e0f958d89de055ea92d937e0f90267319f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x736c6651b98b6019cb7329abc8e56be57388eb98",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6f09e1a2e6fb877609396082f21aaba7819fec71",
        "swaps": 478,
        "distinct_swaps": 478
    },
    {
        "contract_address": "0x318c683e9f3889376efce380a9303de2e6599e9d",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x4efd21b3e10110bd4d88a8b3ad34eeb4d4b1fcfd",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xa671ffdf5d303a8dbda9881f95229597bd50387d",
        "swaps": 103,
        "distinct_swaps": 103
    },
    {
        "contract_address": "0x5c812308ef416579af03b4bd80065d8e41739990",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0xfabe58b7f269ca0bbbff7bc6d2921aded8d22963",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x2829a88c0e7c4d3c42408ed6ce14e2c77f67e593",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcb6cf954f0c73bdd1a437cd255effc70bdcf1f74",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9a08b390af8c71b305d22968626ce196e6cec10b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x06a97ac7be12478e7549803018d54859f17b7109",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x505fbc1330e0b440637024529eae55f6e23651ef",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xec5500fb24398079ceefe34508e0deb0c2ce7e17",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xce4eb53cdf8bbc07c8dcc2f7a39984cc929af15d",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0xf16ad36077422b7579814660b691eac1eb73290b",
        "swaps": 46,
        "distinct_swaps": 46
    },
    {
        "contract_address": "0xd1751c66ab9d72a66cdad35d7e55a25437aabff7",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x895431b72158b81b24dea72eae7297adceaff69d",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x70c096187f8a9ac03e34a0e7ed41bcd516878158",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0xd2b3f59d3a64edbd0a3cb8998cfd02500d643805",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x56d76256b1a1acdb4dd2ecc5effcb13438de3d11",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb3ffc09ab792eff7d6be0ee6e4e2268843e5eee5",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xc1e49d1afacc0da4ff74a9a1ea7b2469dffc5659",
        "swaps": 587,
        "distinct_swaps": 587
    },
    {
        "contract_address": "0x71ced89944bd304008b3f07fab765df2a1a80e32",
        "swaps": 432,
        "distinct_swaps": 430
    },
    {
        "contract_address": "0x03ff8c988e9c9b70b5c44f1c7642a04e62ed0a7e",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xc208605bbceb73a431ebdf19934e5a3aef025425",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x62f31f24c0e7987f4a92f3c20d872a577a5b0d2c",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xa0bbd0521da0cc8679416920bd5f62c1db7bc805",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x89425b782adc2a9a6519db54bb351ca33096916e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf48afb6dd4902731a38f6f7091d4cbdfac4665da",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xab2f260dce2775e63fc404abeb051e001fc69920",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x40f0a05c8c7a86ad1491a3911c293e093fe92436",
        "swaps": 2900,
        "distinct_swaps": 2843
    },
    {
        "contract_address": "0x740d668883b0faef5eef7e84be28c7152d6f609d",
        "swaps": 171,
        "distinct_swaps": 171
    },
    {
        "contract_address": "0xf6025744118db71fc20f5bd5d513bc29dbd90155",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0x1881da2adc8af621f2e3b21a823291e162cfa1a3",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x537231fc1592502c56c01d8fa76dc66b0f67b80c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x6363ccfd7e0bc32b121c945e80835675bd4a678d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x49f56df5489b6b07060d74ff1e274727bf473592",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd47d5539586fc2489f09712304eeab70bc417687",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x07fdc10e5b0018d7886c81788bb9384b641eb365",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xb2ea4c3d7a2189647f634be16ed9b07b01cb7ad8",
        "swaps": 262,
        "distinct_swaps": 262
    },
    {
        "contract_address": "0xa2d08fdff1f03604aa780fbc0739c778dc42281c",
        "swaps": 18,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xe7931cc89fca5d29a3abf40efc3efa282ebe9363",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x3f9ab5200e3e46fd31efbe93a9b7a1cb1a0a2a59",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xfd94fb1d8dd96a3d57801f328d3819ace59d7276",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4613cedc249aa072053558665012285544b27ff8",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x647eca4fddd45f1b3429ac253db57c709d7a51f5",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xcfadf51ce138f0ff71f23a14a99cecd6701a97f6",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x6e1d5c7de829b8b8e3177707363cfccfd10bb15e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x71e94f3b3e1d60569906fcfcd8829e4b5ffcaf60",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xe064138e860d93aac0df5d0ab5fd3eebe5f12c86",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xbff681c59158ea5cf7d29e439cb701a9bb8b79f8",
        "swaps": 183,
        "distinct_swaps": 182
    },
    {
        "contract_address": "0x320a50f32fb9e20fe113573031132c89835e496c",
        "swaps": 417,
        "distinct_swaps": 414
    },
    {
        "contract_address": "0x62df659515308a7b43acc5ef1d818da986314e0e",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xb7d81710549551cd3bcab4f116602700d85abfd1",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x7a7da366c34abb093dfeff0b366ae881e9a254f9",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x02274e937aa27eae700e3abc5107ab5918429ac4",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x0f9be04e1baf68395ddd2e22c5ca9401b19074f7",
        "swaps": 5,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x452861b678a479a832ad51125ae2ebbbcadfe068",
        "swaps": 1568,
        "distinct_swaps": 1568
    },
    {
        "contract_address": "0x9f4360a2390321cb1cbff4cebeb4315d64ed3ac1",
        "swaps": 150,
        "distinct_swaps": 150
    },
    {
        "contract_address": "0x412f6732405aba0cf8124d5b413fd4761fe962a9",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x053c9033127844c2683caeeda4605cf2cf52c462",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xd713447fa8410061649e07a79f43656582adc569",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x590f5e967d73ea06dae9aed2788108dcf52da269",
        "swaps": 43,
        "distinct_swaps": 43
    },
    {
        "contract_address": "0xe8d53a91f90ff138679dfb00be1670888c6e9af3",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xc6094416d714e3478a54a3d6362af7b9a0b05693",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x21802d1c16eaf98e04bbf41b8bd0e4756b5f12f7",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0xa27eb3773135b1af1ae05dbc9530784acb69061d",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x8bc6f4b90129b26efb0e52c2b51e5b1782ca29ad",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0f2f6a30a087dde29c16b7294091283ccbb9265e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x097d29770ed734ff57f8da3550d2fdff7d67809b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9ec6021aec19a555ce3c8e3367212d9812c9aa24",
        "swaps": 1014,
        "distinct_swaps": 990
    },
    {
        "contract_address": "0x8fcb93c0d9fa361c57c1d31bbf1c4d8c61af7d3d",
        "swaps": 201,
        "distinct_swaps": 201
    },
    {
        "contract_address": "0x6f2fed287e47590b7702f9d331344c7dacbacfe5",
        "swaps": 35,
        "distinct_swaps": 35
    },
    {
        "contract_address": "0xb5e1a07c9b6ab3bee8d9bf4066d324c5da89c07f",
        "swaps": 94,
        "distinct_swaps": 94
    },
    {
        "contract_address": "0x252add40b104a664a148c7f2b612c3bfeb2ab227",
        "swaps": 30,
        "distinct_swaps": 30
    },
    {
        "contract_address": "0x527e43ca8f600f120b1eaee2afc80e3cb375e191",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x81c77778c92180561d730ab785e3e6d2aaed3bd5",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x5518037ab78552b4a043d89522aca16206ef9eaf",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x658646f5461ee448794fb3d3bb6de32d4ff644b2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x87d68f797623590e45982ad0f21228557207fdda",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xf1ee78544a1118f2efb87f7eacd9f1e6e80e1ea5",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x553bcbc0979a75fd70918ac6c8600ef2c26cea66",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb2d0d5c86d933b0acefe9b95bec160d514d152e1",
        "swaps": 111,
        "distinct_swaps": 111
    },
    {
        "contract_address": "0xc7aeaebe5b5a98dad2dfc9c18cff75298125cd06",
        "swaps": 42,
        "distinct_swaps": 42
    },
    {
        "contract_address": "0x0c7ad41d3e0dbc1cfdcdd717afb0a72a65cdf069",
        "swaps": 39,
        "distinct_swaps": 39
    },
    {
        "contract_address": "0xb039b5ddd8f56f34f5c9136745890b42c35aea06",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xfac2c6b690e171cdbb595b60ca58ed70fa19e90c",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xec38075965ced6b8217c14d705b45ac7f344413c",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x7aaa183c30e6ff04dc69485ba57aa81b7a662e02",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd74d23d2f23cd06a7d94f740a74c6e906f0c9005",
        "swaps": 106,
        "distinct_swaps": 101
    },
    {
        "contract_address": "0x05b0eb68e5b32a09a92b25b833ab2e6b65fc1291",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x9e3880647c07ba13e65663de29783ecd96ec21de",
        "swaps": 232,
        "distinct_swaps": 232
    },
    {
        "contract_address": "0xfe3dd4f4a3c86615ec9e71a1f7875cba09e7a7a3",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0xe47e504f4a841d80a5597015d7fc71630a824d77",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x99ff9c60f8ed3e0906472591989063c45072e68e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x26739154fc16c63784b64618323fa622018fb465",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3d9f93d3d97cde8594bcc3a970b9c85df3b856ff",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x82a2702898c58cd20c01b76eccd5a9e871e71f8e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x10a80a90303a0e55e4fecfb2be6dff3e889c4fe4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x94fc009e63b1cd14fab429ae773bad5af8da7357",
        "swaps": 77,
        "distinct_swaps": 77
    },
    {
        "contract_address": "0xc68433b48b21d4376aa7eeec205038557d56fa7c",
        "swaps": 99,
        "distinct_swaps": 99
    },
    {
        "contract_address": "0x56364fd216657d87854562e810ef0552ee32f5d0",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9e5555f362393aaab5c66b31797356c077ed93ba",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0xec358eef4bfbfdd848d0e3d15892108bdefc01cf",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0xb746ed49b63f2239a8ef33ee6d0f5bb52eda26bc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd6beab00d778322d00b957dba780d31c50f8027b",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x8f4d21c36f593fe82d797354a24073c866815976",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xe36777e21768e51bec2c676ff76ccd8f28377e52",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x6405ebc22cb0899fc21f414085ac4044b4721a0d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe699a85ea83adad57f3510be8acd9d37f9e9b5d4",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0xc47d51b5502d5d73a1c3de6e98090c91653b7a0c",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x149bcbaf01034b481deb6f0dbf58a1ef79b2df04",
        "swaps": 87,
        "distinct_swaps": 87
    },
    {
        "contract_address": "0x3d19f9f3a936238cb127aa40d7f9643986c86a71",
        "swaps": 73,
        "distinct_swaps": 66
    },
    {
        "contract_address": "0xda213f89d23c55062b4d5972cd4d178194f64e8e",
        "swaps": 94,
        "distinct_swaps": 94
    },
    {
        "contract_address": "0x3324af8417844e70b81555a6d1568d78f4d4bf1f",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0x74946a114ca2b26267983ef51ad8664cabde4034",
        "swaps": 48,
        "distinct_swaps": 48
    },
    {
        "contract_address": "0x4eab9556bd46f552691fe75c16d1c2ed1622df51",
        "swaps": 34,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x2f0b92c5de5acc7003e7e90c9beb99c80d19f8df",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x327be6353f28dd021d1e4eff10c92767e49604d1",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x4e0751fad0184914cd7b2e854ed888b4a4a4f7c6",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8cb29ac3a3b02b9983df6bbb1bd8aa8a31848ff3",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x54d52bb94ff8bdb0b75fe07abfa31050289e4f7f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe5f90cf8e27521dab28133a89b45abc203c4f328",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xb24db6fc569f709728e4aa67fe10ac6d0b38bcd4",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x9ec6ea2b7294f433216109ba80c9b13275397a42",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x17a7df0acc13cb4ba9d8606ebe7472d138af7574",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xea3ad248fb0cda9f0895fdfcaed969eede3f6867",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xfec232cc6f0f3aeb2f81b2787a9bc9f6fc72ea5c",
        "swaps": 88,
        "distinct_swaps": 88
    },
    {
        "contract_address": "0x09d2be9aebda47ca6c236bcde98762f75836f663",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0x0554059d42e26f35cc958581c71fdfd92405d02f",
        "swaps": 236,
        "distinct_swaps": 235
    },
    {
        "contract_address": "0xe99d5f930048ae3006205c87d2ddafa397014012",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x1e1d542a8d8cb83c89ed9a05cc9870e31edad0e9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe8508b0babd71beed0de644b2d1841e00b708de6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe471815a323f8efd35a288a00fa9768a139e7cbe",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xfa284e6eb7ef307d71592966cbaaf37dc1b6dd39",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x04dddca337d732d558d719872e5cd38867b385d2",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8e959e9edbb7a09e4f95147cfb0c7b674e4737b7",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x951e38875a93df95bbd24fe31f409b7933b35bed",
        "swaps": 1124,
        "distinct_swaps": 1113
    },
    {
        "contract_address": "0x60e70705b52a4a5bdc1d8614426ba5016a68ab38",
        "swaps": 185,
        "distinct_swaps": 182
    },
    {
        "contract_address": "0xd21a069ca53133c446d42dff097106c4e6133426",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x09c9ed2dc1d6f49aa00d2548fb4c40198c8eaaa7",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x32c6a5c78d7c7ed610b996387d93820c3ec10e1c",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0xc8a96d8daff42271b2cbd04b645fd07c6b70b154",
        "swaps": 50,
        "distinct_swaps": 50
    },
    {
        "contract_address": "0x61dab286dc1b8edbf381b5b03f1120f91da9296e",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xaeb62edde81b5d1927d748711dd78bdd02cd7e4a",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x8c1c63c20bcf4a27c985340b36df86d1a6fa840e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9646a93d64b19ad3e1a9ea6e4c2c112a41a59d3a",
        "swaps": 70,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0xe9bb87c33d1607b06fb3988b31e9601bd21ff3bd",
        "swaps": 38,
        "distinct_swaps": 38
    },
    {
        "contract_address": "0xcaeef825c28e6e084fb1ec92af3d03faa5a523fa",
        "swaps": 75,
        "distinct_swaps": 59
    },
    {
        "contract_address": "0xcd8928f62d22c34722ddce6ae89d710671432b3f",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x10dedcb76ad1309fe9b2c47eb5714824d6926551",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x3195d70b99fef8c5e8bee3e00e6d1bd5d7c836d2",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x95de8efd01dc92ab2372596b3682da76a79f24c3",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6ea186289c8ab5ca72e87bf28e04d87fdc0fd82a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5e06e1da9b7cb3ddd0df596003ad4cb852f51955",
        "swaps": 78,
        "distinct_swaps": 70
    },
    {
        "contract_address": "0xc121e1f36b2c0a65b1a12808be3a242b03c27a2a",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x4a853d34352e2a053570ecd7bae43673508d0088",
        "swaps": 60,
        "distinct_swaps": 60
    },
    {
        "contract_address": "0x4d809389e1e30afb1acc499b70e10eafa69f0cc2",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xeaaee7a915821bbb7df3eab2679b8cc2515af40e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5a31f830225936ca28547ec3018188af44f21467",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0x440421185d1a2b76aa0d235145df360674a3bcf0",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x17bb57a558dca5887cf819a9ebb8d7a8169627d9",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x351a7f6cebfeeef80d0cbc1fc3ac5f568c612a85",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x07a3e24bd84b00147e8c564536631c89bd52aeb8",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x205f7fbe1c8d2fb5a6c4efe8cc806a0f4c6766b0",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd9c23394357160a26a4df06477e7cb199c8dfdec",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xd02b870c556480491c70aaf98c297fddd93f6f5c",
        "swaps": 36,
        "distinct_swaps": 36
    },
    {
        "contract_address": "0xea64d795a30bb6ffb9c57c05b7e3302f6e585ac3",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xcf4ea07d7a6b36966d9214a7649bbf9efba70037",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x235bc5f65b0c665f3d5a4596fdedbf1e0e1c42b7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x5e1fcfd0fb024ee32305a988c9768f5caa6e648b",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf1f04aabbf815334072d6e2b07458085faff6927",
        "swaps": 12,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0x58bbc687ad7113e46d35314776fad9c4b73e200c",
        "swaps": 15,
        "distinct_swaps": 15
    },
    {
        "contract_address": "0xd402e14998402566bbc3cda2bb6dc89f5abc6bce",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x8922978912e9adfea6f259423c73baa5daebce38",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x811fc289a7ba96cc1f170c0d3af3ac9b43cacf26",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x77aca8564bf6d9256e7e490d9821e1cecec1657f",
        "swaps": 678,
        "distinct_swaps": 678
    },
    {
        "contract_address": "0x330c4e8db11fac97f981979de6d83a911c753d9e",
        "swaps": 1086,
        "distinct_swaps": 1077
    },
    {
        "contract_address": "0x9021a31062a1d9c9c35d632ed54a9d923e46809f",
        "swaps": 26,
        "distinct_swaps": 26
    },
    {
        "contract_address": "0x1013ba833071fd8aca8bf2ac83e5515c5fb9e76f",
        "swaps": 113,
        "distinct_swaps": 113
    },
    {
        "contract_address": "0xb1f46b71b24cfe8e100b9bcfe7dd523a6d15246a",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0xa1ae2bc91f0cb1b13bf92e42ba3c8191a924e99e",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x26d6508b564bf00b4cb4bc6f5054e1e7cc0cdea0",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0xfd3bf99e3159ed7316623b947328dcb15d60c81b",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xa375d23a751124359568f3a22576528bd1c8c3e3",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x9dc91463011bbb9d441f4c7f9be1286ac5b8f459",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xfa447eec17206c4948cba28a229346af925c2b07",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x6c1dc37dfdf7dc09cd9b17f93c19354e2e1ed38e",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x25137cbf22dbbed7e15efc992d4cdeb15f13acc4",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xff3a26198c875b5fb1bc68ae18e82d633c351049",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x81fdedf9196a75a6554ce02c9f97f4345c7ad98d",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8a4ceb4dffa238539c5d62ce424980e8fdb21ebc",
        "swaps": 532,
        "distinct_swaps": 504
    },
    {
        "contract_address": "0x1c697ef3a58208c13086b5a4ac413f3100818e8a",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x36d906b17371678ba39de21b8631854c9490e87e",
        "swaps": 33,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xf8095ffd24f02bd8aedc96e5a3617310815cc4c7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xa8b71de03fba3e65ba22cc14dd302a2494a5b98f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x79b368b3aa34ff2044f7869024b5367a284d3b0e",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x4a0ca52e4922d5f83b635a72e5c6c1344b7606f5",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x6152943b506211ce1fa872702a1b0bc594cfa2d2",
        "swaps": 10,
        "distinct_swaps": 10
    },
    {
        "contract_address": "0xc988af4a0bcff35a7533942cfcf92b7d14f94996",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xadb8f94c9b05ead2e5a34763b9a2074d25461e57",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x78c669c51417943120b2c2854bc39709410d366e",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x79c404e3085e39516aa05d506fd32fac2d18855a",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x71952d09aa093acccae0c1d5612d7fe26f20517f",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xcf0b0a0a12b7a53e888890c0d57b004956ec57cb",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4d9a44367e49907df7cd42a2bea5d7716d57ab88",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x2521027129b3ec64fc24e29178df04e51a8b3efd",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x73af6f499ad9debc7101c9b1a47a905f194f4c6b",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x4c9dc1b489d4285b71d021a76f0870f0821917cb",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x15b590e3ba006047c5a2b025034e95131134f15c",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0xf7e659966196f069a23ce9b84b9586a809c4cd9a",
        "swaps": 69,
        "distinct_swaps": 69
    },
    {
        "contract_address": "0x28c5367d8a4e85f8d7b41a0ca2579e66a58fccb6",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x5e1cd1b923674e99df95ce0f910dcf5a58a3ca2d",
        "swaps": 21,
        "distinct_swaps": 21
    },
    {
        "contract_address": "0xcd39180582238dd82cf43448750ceeb40d2a8433",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x00ebb87f12da0563454655cc5021ae235c7c634e",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xcda8e98d5aa3be4e46f3b3b23e0e7defa4560439",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x019ba0325f1988213d448b3472fa1cf8d07618d7",
        "swaps": 1517,
        "distinct_swaps": 1510
    },
    {
        "contract_address": "0x8c26252b14f9b071585b81b240c4ae2176e8cd3c",
        "swaps": 313,
        "distinct_swaps": 307
    },
    {
        "contract_address": "0x13b1e0d8319a6d727e568b7eb3ac85857f00b4ac",
        "swaps": 317,
        "distinct_swaps": 317
    },
    {
        "contract_address": "0x9283508891958dc72425339b1c25517cbc37b347",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x941eb28e750c441aef465a89e43ddfec2561830b",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x4b23803040321868fc2eeb6d3e9c353c3237031d",
        "swaps": 29,
        "distinct_swaps": 29
    },
    {
        "contract_address": "0x015957afbbd925e5d8b9419d6436c10e35efd9cf",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xc1f7bad4e8f8604971984496d637454d5f83003f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x5cffdbc1f1975e41525e1b82b4340748fcc06d54",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x981ba7359767ad378a0550e9c562eb2d628b331a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xc3c828ae133911e5c90d53eb170e63d3eb575bbc",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x7a9c27da051ae55b394498ae061a45aa7d73410f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb76140c771ab9af5a45ac1cef685d917d4122e1a",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x275b13370edd222f24d87e442b80555a8acc89af",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xdcb0c125df19598501427c28e7991564504c947b",
        "swaps": 146,
        "distinct_swaps": 146
    },
    {
        "contract_address": "0x07af07c014e221f52f68ced635e5060873b9461b",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x2d69c75c86288697b5ffd2d3068b19a92e7abb23",
        "swaps": 25,
        "distinct_swaps": 25
    },
    {
        "contract_address": "0xb234c8d1394a717f602a6bcc2405b1039ae2c7d4",
        "swaps": 18,
        "distinct_swaps": 18
    },
    {
        "contract_address": "0x7acf9f179219f382cdc754cc1b63a76c6a1d17da",
        "swaps": 19,
        "distinct_swaps": 19
    },
    {
        "contract_address": "0x614af1c46c6b693a083e38797f21242173faafcf",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xe8d71f71b3e7d13b4844e47ea41ac39c761e784b",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8bc8e9f621ee8babda8dc0e6fc991aaf9bf8510b",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0x81e91d374b5ad9998b8c78b804e786c7cb45b60f",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x8612f60c9ca6f55c06e29c0c41e15b01bb813c6c",
        "swaps": 16,
        "distinct_swaps": 16
    },
    {
        "contract_address": "0xfcaa38756c304f4969af265894f7b9824404c073",
        "swaps": 8,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x04cfb8a1176931e420cc3976d5670e6d0b5caee7",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x06503640b952e3b1eb675be6a99fc632a77c49ea",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x287bd6518ae54a4299bd766faa6df3ed795fb6c1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x9612697f4cf372688d6f72424106861a0ccfb948",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x3c45c10407c6929e09968a552f805bf0080267b6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xe427b62b495c1dfe1fe9f78bebfceb877ad05dce",
        "swaps": 381,
        "distinct_swaps": 380
    },
    {
        "contract_address": "0xef40e733aed95c2d54a1f0495e4ee54bef2b7a36",
        "swaps": 937,
        "distinct_swaps": 937
    },
    {
        "contract_address": "0xf6a637525402643b0654a54bead2cb9a83c8b498",
        "swaps": 366,
        "distinct_swaps": 363
    },
    {
        "contract_address": "0xdf4bd84b8c709c07a8db842714f4b9dd8a1755e1",
        "swaps": 83,
        "distinct_swaps": 83
    },
    {
        "contract_address": "0x04e2dc96afecdf72221882e1cee039cab4d443e0",
        "swaps": 44,
        "distinct_swaps": 44
    },
    {
        "contract_address": "0xead4c2d8859b2cb0698aeb7d0cf56a00468a4f5c",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x3edb4de1741a35f287ec77f7db3267b6578c7d4d",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x11a83070d6f41ebe3764e4efed7df9b9d20a03fa",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x6cc25699a945fca2814b9a071acf77509d79615f",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x38e65e915f8e4b0529f12a3f5a9c7708598e7ba2",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x7ca8e540df6326005b72661e50f1350c84c0e55d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xbd52c933a90895fb3262bdf1be9ea0f59c53b58c",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x35b70e9e56fe5ac4732107d55353a353466dc5b6",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x7d51bad48d253dae37cc82cad07f73849286deec",
        "swaps": 498,
        "distinct_swaps": 492
    },
    {
        "contract_address": "0xc7f1b47f4ed069e9b34e6bd59792b8abf5a66339",
        "swaps": 347,
        "distinct_swaps": 346
    },
    {
        "contract_address": "0x235aeb304cc1a06602321eaf0f1dbafd6a34fb5f",
        "swaps": 23,
        "distinct_swaps": 23
    },
    {
        "contract_address": "0x723e866989cacc8efc346e1dcf5a9d73572bcfc8",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x13c5cb6762eb5dc01c515cf85a2d8d74fc21a18d",
        "swaps": 225,
        "distinct_swaps": 216
    },
    {
        "contract_address": "0x8f82bbffcbdf2a6b1dab1a99255b9d52dce54fd6",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0x314e6134b76d3fa505bcc6cff0c298040cd0fcd8",
        "swaps": 8,
        "distinct_swaps": 8
    },
    {
        "contract_address": "0x4282c6b1c21cd1a0c363a70e4292f8bf4d7c898c",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x9514bad7f65f070c498966c371727548e840a83d",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x10ace6caeee3f403490b025b762a9ae7c1dde859",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x8599616da5952eb37f4520bf862bc46e0dc46b0d",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd011337d2a1b4acb59bfa182215036f16b6bdf8e",
        "swaps": 9,
        "distinct_swaps": 9
    },
    {
        "contract_address": "0xf2f46cfc363ff5554801eb38944148cf3d40d82f",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xb78f0f7d5b56f75368a46382d085a39331d76f62",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0xaf8bc67deae403b99975c3713f3b1ff4f61e6971",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x74084fa32dbb6b320921d4b386418328e4428a82",
        "swaps": 69,
        "distinct_swaps": 69
    },
    {
        "contract_address": "0x863325397751c51f85818a7958a7dd45209bf501",
        "swaps": 36,
        "distinct_swaps": 34
    },
    {
        "contract_address": "0x8a57af28a88a6728227cfe2fa28aa3bb74e85cc4",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0xd53a56ae0f48c9a03660cd36c2e4ae20493a1eca",
        "swaps": 24,
        "distinct_swaps": 24
    },
    {
        "contract_address": "0x71bb3a87e0c6ffb5c4ccee9aa219a9e74a18537a",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x0e9abbec810950e90b52f150e31b474bb813d882",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x7d848c8c6873e2b962c45882a6e6bf30218c9638",
        "swaps": 20,
        "distinct_swaps": 20
    },
    {
        "contract_address": "0x58ef8e61fe4d79fbb3a690496e1ab79465f6bfc1",
        "swaps": 11,
        "distinct_swaps": 11
    },
    {
        "contract_address": "0x3fdec2c2ed9326bcd7cf9d483768382c97eb41cc",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x92bb40fa63eb4f402cae5bddab3369a4fb3e33bf",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x2dc825687104100226b22452a3c36405c996d821",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0xdf7e1afe17a0e9cab396a6abe2868208e13e1698",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x868483c11c9c9e6de9ba34e9d7a1b29daf3c3fbc",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0xd84e2d725491bffae933134bdf1f7933bcba7414",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x47dde0cf1be032b8984547a00d4f07a46177d989",
        "swaps": 6,
        "distinct_swaps": 6
    },
    {
        "contract_address": "0x421a018cc5839c4c0300afb21c725776dc389b1a",
        "swaps": 108,
        "distinct_swaps": 108
    },
    {
        "contract_address": "0xe0e7db62d8aebd1838ff768e1e1a448c950d616d",
        "swaps": 77,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0x174f902194fce92ef3a51079b531f1e5073de335",
        "swaps": 28,
        "distinct_swaps": 28
    },
    {
        "contract_address": "0x272cf24826f290bfd5b3f03ef46954fe1e91f722",
        "swaps": 31,
        "distinct_swaps": 31
    },
    {
        "contract_address": "0x3b4c63e07066e7c0dd4a416fa771ad80bf9b0de1",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x23f8c444b80f29a384e940991b81b4f29421edf6",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x7effdd3b7d2044e4697df5594f4af6d002be1cdc",
        "swaps": 32,
        "distinct_swaps": 32
    },
    {
        "contract_address": "0x2b3da2565b54fc9ba04ec9ef88f2681f40c4944d",
        "swaps": 13,
        "distinct_swaps": 13
    },
    {
        "contract_address": "0x49e7d82dafcc415a6edd6e20f1710f3f024e964e",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0xb50fa9ecab1c8922562095a3cab5922577b4e5ae",
        "swaps": 23,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x20a7def0410d986aeea1e0da09b62bc5517cd126",
        "swaps": 4,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0xf87286e7116a9ca45534613a45761bc23b3a4061",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8312a29a91d9fac706f4d2adeb1fa4540fad1673",
        "swaps": 1267,
        "distinct_swaps": 1237
    },
    {
        "contract_address": "0xd86cfec4ddaaceb6b7114b7d65278d407e5e03aa",
        "swaps": 34,
        "distinct_swaps": 33
    },
    {
        "contract_address": "0xbd13d74a9b4cff99feaefa916e357056689df91f",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x3318801171f0705781ab0f97ebccef73b2486165",
        "swaps": 14,
        "distinct_swaps": 14
    },
    {
        "contract_address": "0x211f8e61113edaf00cf37a804b0ba721875ef560",
        "swaps": 5,
        "distinct_swaps": 5
    },
    {
        "contract_address": "0x5d3485e87402a9fc524745c289a94787331f9276",
        "swaps": 3,
        "distinct_swaps": 3
    },
    {
        "contract_address": "0x258cb11a5da759fad327967ad93095a4e85bdc85",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x818a2465759c2163041904626b806b2f35e39500",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9f1d8f6665733f86fe7eac3d50f79f0f012160f1",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x0f5a148992b34c04743ae9907ae1f8d0ddde90d9",
        "swaps": 2,
        "distinct_swaps": 2
    },
    {
        "contract_address": "0x477d35b4e568ce156e2955fcbd36439b4ac9f924",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x882080ecd4ac21a0caf4d282bef9cba0ef4154ab",
        "swaps": 57,
        "distinct_swaps": 57
    },
    {
        "contract_address": "0xf04adbf75cdfc5ed26eea4bbbb991db002036bdd",
        "swaps": 196,
        "distinct_swaps": 189
    },
    {
        "contract_address": "0xcce2e04f3f6961e4b0d267012c98e95afc72ec5b",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x9d860895f18456e23a73a8c7c9465faca488ed69",
        "swaps": 13,
        "distinct_swaps": 12
    },
    {
        "contract_address": "0xe6191476b72152a43c04769e3d76c285c2a89145",
        "swaps": 22,
        "distinct_swaps": 22
    },
    {
        "contract_address": "0x874b8db8294bc982e403b1429db8e2f63bbf7205",
        "swaps": 1,
        "distinct_swaps": 1
    },
    {
        "contract_address": "0x8a2423d73d6790bd61b4da33eed33744dfa3e62d",
        "swaps": 17,
        "distinct_swaps": 17
    },
    {
        "contract_address": "0x97c45f96e3ac73a0ffd7f0473b4730958ecf9d22",
        "swaps": 7,
        "distinct_swaps": 7
    },
    {
        "contract_address": "0x8dccc1251f93fc4eb71dc7a686b58d3e718a5949",
        "swaps": 4,
        "distinct_swaps": 4
    },
    {
        "contract_address": "0x9e08c38639ce78a9650d347108cd6ab7eea0700c",
        "swaps": 3,
        "distinct_swaps": 3
    }
]

const pairs: Pair[] = []
const tokens: { [key: string]: number } = {}

interface Pair {
    readonly pair: string
    readonly reserve0: BigNumber
    readonly reserve1: BigNumber
    readonly token0: string
    readonly token1: string
}

const amountOut = (amount0In: BigNumber, amount0Out: BigNumber, amount1In: BigNumber, amount1Out: BigNumber, pair: Pair, print?: boolean): boolean => {
    if (amount0In.eq(0) && amount1In.eq(0)) {
        throw "Zero amounts"
    }

    let balance0 = pair.reserve0.sub(amount0Out).add(amount0In)
    let balance1 = pair.reserve1.sub(amount1Out).add(amount1In)

    let balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3))
    let balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3))

    return balance0Adjusted.mul(balance1Adjusted) >= pair.reserve0.mul(pair.reserve1).mul(1000 ** 2)
}

const fillTokens = async (token: string): Promise<void> => {
    if (tokens[token] == undefined) {
        const decimals = await IERC20Uniswap__factory.connect(token, wallet).decimals()
        tokens[token] = decimals
    }
}

const main = async () => {
    let t = 0
    const pairsPromises = active_pairs.filter((p, i) => {
        if (p.distinct_swaps > 100 && t < 30) {
            t++
            return true
        } else {
            return false
        }
    }).map(async (pairt) => {
        const IPair = IUniswapV2Pair__factory.connect(pairt.contract_address, wallet)

        const reservsPromise = IPair.getReserves()
        const token0Promise = IPair.token0()
        const token1Promise = IPair.token1()

        const [reserves, token0, token1] = await Promise.all([
            reservsPromise,
            token0Promise,
            token1Promise
        ])

        await Promise.all([fillTokens(token0), fillTokens(token1)])

        return {
            reserve0: reserves[0],
            reserve1: reserves[1],
            token0,
            token1,
            pair: pairt.contract_address
        }
    })
    console.log(1)
    const pairs: Pair[] = await Promise.all(pairsPromises)
    const pair1Addres = "0x55ff76bffc3cdd9d5fdbbc2ece4528ecce45047e"
    const pair2Addres = "0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3"

    console.log(2)
    const pair1 = pairs.filter((pair) => pair.pair != pair1Addres)[0]
    const pair2 = pairs.filter((pair) => pair.pair != pair2Addres)[0]

    if (pair1 == undefined || pair2 == undefined) {
        throw "One of the pairs is undefined"
    }

    console.log(3)
    const startAmount = BigNumber.from("1000000000000000000") // Starting with 1 token
    const increment = BigNumber.from("100000000000000000") // Increment by 0.1 token
    const maxIterations = 1000 // Number of iterations to try

    const optimalAmountIn = await findOptimalAmountIn(pair1, pair2, startAmount, increment, maxIterations)
    console.log(`Optimal Amount In: ${ethers.utils.formatEther(optimalAmountIn)}`)
    const amountOut = getAmountOut(optimalAmountIn, pair1.reserve0, pair1.reserve1)
    console.log(`Amount Out: ${getAmountOut(amountOut, pair2.reserve1, pair2.reserve0)}`)


    const graph = constructGraph(pairs) // Assume this function is implemented
    findArbitrageCycles(graph)
}

main().catch(console.log)

// Simplified function to calculate the amount out, considering a 0.3% fee
function getAmountOut(amountIn: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber): BigNumber {
    const fee = BigNumber.from(997)
    const feeDenominator = BigNumber.from(1000)
    const amountInWithFee = amountIn.mul(fee)
    const numerator = amountInWithFee.mul(reserveOut)
    const denominator = reserveIn.mul(feeDenominator).add(amountInWithFee)
    return numerator.div(denominator)
}

// Function to find the most optimal "amount in" for an arbitrage opportunity
async function findOptimalAmountIn(pair1: Pair, pair2: Pair, startAmount: BigNumber, increment: BigNumber, maxIterations: number): Promise<BigNumber> {
    let optimalAmountIn = startAmount
    let maxProfit = BigNumber.from(0)
    let currentAmountIn = startAmount

    for (let i = 0; i < maxIterations; i++) {
        // Calculate amount out for the first trade
        let amountOut1 = getAmountOut(currentAmountIn, pair1.reserve0, pair1.reserve1)
        // Calculate amount out for the second trade using amount out from the first as input
        let amountOut2 = getAmountOut(amountOut1, pair2.reserve1, pair2.reserve0) // Assuming reverse reserves for simplicity

        let profit = amountOut2.sub(currentAmountIn)
        if (profit.gt(maxProfit)) {
            maxProfit = profit
            optimalAmountIn = currentAmountIn
        }

        currentAmountIn = currentAmountIn.add(increment)
    }

    return optimalAmountIn
}

// Example usage with mock data (replace with actual pair details)
async function runExample() {

}

runExample()

// Convert pair exchange rates to graph edges
function constructGraph(pairs: Pair[]): Map<string, Map<string, { rate: BigNumber, pair: string }>> {
    const graph = new Map<string, Map<string, { rate: BigNumber, pair: string }>>()
    pairs.forEach(({ token0, token1, reserve0, reserve1, pair }) => {
        if (!graph.has(token0)) graph.set(token0, new Map())

        if (!graph.has(token1)) graph.set(token1, new Map())
        graph.get(token0)!.set(token1, { rate: reserve1.div(reserve0), pair }) // Simplified rate calculation
        graph.get(token1)!.set(token0, { rate: reserve0.div(reserve1), pair }) // Reverse rate
    })
    return graph
}


// Detecting arbitrage using Bellman-Ford
function findArbitrageCycles(graph: Map<string, Map<string, { rate: BigNumber, pair: string }>>) {
    let nodes: string[] = Array.from(graph.keys())
    let distances = new Map<string, BigNumber>()
    let predecessors = new Map<string, { predecessor: string, pair: string }>()

    // Step 1: Initialize graphs
    nodes.forEach(node => {
        distances.set(node, ethers.constants.MaxUint256) // Max value for initialization
        predecessors.set(node, { predecessor: '', pair: '' })
    })

    // Step 2: Relax edges repeatedly
    for (let i = 0; i < nodes.length - 1; i++) {
        let updated = false
        graph.forEach((edges, source) => {
            edges.forEach(({ rate }, target) => {
                if (!distances.has(source) || !distances.has(target)) return
                let newDist = distances.get(source)!.add(rate) // Simplified for illustration
                if (newDist.lt(distances.get(target)!)) {
                    distances.set(target, newDist)
                    predecessors.set(target, { predecessor: source, pair: edges.get(target)!.pair })
                    updated = true
                }
            })
        })
        if (!updated) break // No updates mean we can exit early
    }

    // Step 3: Check for negative cycles
    let arbitrageExists = false
    graph.forEach((edges, source) => {
        edges.forEach(({ rate }, target) => {
            if (!distances.has(source) || !distances.has(target)) return
            if (distances.get(source)!.add(rate).lt(distances.get(target)!)) {
                console.log(`Arbitrage opportunity detected in cycle involving ${source} and ${target}`)
                arbitrageExists = true
                // Trace back the cycle path here
            }
        })
    })

    if (!arbitrageExists) {
        console.log("No arbitrage opportunity detected.")
    }
}