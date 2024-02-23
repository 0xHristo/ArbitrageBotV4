import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import { ExchangeExtractorV4__factory, IERC20Uniswap__factory, IERC20__factory, IUniswapV2Pair__factory, UniswapV2Router02__factory } from "../typechain"
import { ExchangeExtractor } from "../tokens/ExchangeExtractor"
import { toUtf8Bytes } from "ethers/lib/utils"
import { appendFileSync, writeFileSync } from "fs"
import { settings } from "cluster"
import { GasAwareSigner } from "./GasAwareSigner"
import { WMATIC_USDC_PAIR_KEY, amountIn, providerHTTP, wmatic } from "./arbitrage/configs"
import { Arbitrage, Cycle, Pair, Token } from "./arbitrage/entities"
import { getPairData } from "./arbitrage/get_pairs"
import { addPairOfType, getUniqueArbs } from "./arbitrage/generate_arbitrages"
import { calculateCycleAmountOut } from "./arbitrage/amounts"
import { getActionsStartingWithTheSameToken } from "./arbitrage/generate_actions"


const wmaticUsdcPairs = [
    "0x7d3349d9cb14019376b84cda4b01b396a4950900",
    "0x8312a29a91d9fac706f4d2adeb1fa4540fad1673",
    "0x019011032a7ac3a87ee885b6c08467ac46ad11cd",
    "0xb4a2cb99b453e2b7bc3d2af1c763402de449c695",
    "0x382da162ad195edc74d2dbe7d7f76ecd0dba14f9",
    "0x13c5cb6762eb5dc01c515cf85a2d8d74fc21a18d",
    "0xbe83240eab06a5e8b55a828d72ac514dd0318a38",
    "0x8c81a9cfb8a64170c6edbe62ce193f87a2346b2f",
    "0x427f73303064a4eedb0c438f06d17bcb73291a42",
    "0x763dd5e7fcd83a2156e65d358bfc19246072893b",
    "0x9c2d07126eb45eadaf75736692f07ee52003e8ab",
    "0x7bdcf237925bc714ac68ba8658588ec176455445",
    "0x9f3769d46c1b5a5f1e56d78d94053b4957a798b4",
    "0x164511af9b314de22ccf1dabf66c5c2f06a9d08a",
    "0x1de31f148297072d0f1808071a9986966475d984",
    "0x52fca7ac32e6dcbe1cacd8d50c6343f0f04d1dad",
    "0xda18fa3c26ad872ce73102289e1867400596d462",
    "0xa76b0d74151541451bccbaced4249483cd510097",
    "0xef45e5814cc503fd3691dcd9128f4200d4e46d02",
    "0xe8c21e0377fbf10546566b04b391d9c66baebc91",
    "0xd776c65b2a7a5832b4172742bf8c40cc062c678e",
    "0x753abcccc646234b3d63c3cc46336bee41f63c22",
    "0x049ca2e9dee376b474ba1b4980d586f7a2d71195",
    "0xa2937659873ef52da71a399e4079ebb2a7e5fff6",
    "0x1210e12c1457acb40dec57884e4ebfa5b9578968",
    "0x8a4ceb4dffa238539c5d62ce424980e8fdb21ebc",
    "0x81666d646f3dee91481a5b6de4be046fa2dec709",
    "0x400190e0111694c8cf35ce704aeec7433ce175b7",
    "0x10d39a3fb1ef2647f6e93635cbd179918e2b9fb5",
    "0x7c31e047ac83d54706d8ae56184f9e89200cfb2a",
    "0x00c94f00ad88f6f2a3077af683cf03bc1727e2c8",
    "0x5b6c31812cf3b53c9f78e6a7f6f8de3d024109a7",
    "0x86b7249272fabb82ef36550ef898ea539225e7f0",
    "0x1f604f13f8ba2359dd8cc9ca65fa2e4f6c55e2e1",
    "0x1ce7b3f6eb5230f10331d4b627d417c8bf8f87a3",
    "0x944524f21851ccdc1303196209d222716a4b758f",
    "0x85a3eafc123ea9f55ddfbb583c09688ae0583da8",
    "0x9f365d603b3ecbd38290d2d78f00158c3750398f",
    "0x10e987d8a8934ab1ddf062878885e33b2621a9c1",
    "0x0b15e940df8af9a54b873b4cf212edf341d47188",
    "0x6471155e47d2c86e9808a6bebe203960f5e32584",
    "0x3781fdafdeffe1c73615ccab6d5fd78a029b7022",
    "0x695d892bc7c9411848ac7fb473d358a93d1376ad",
    "0x9d2ae4888a96bee039255062a6f59a8cbd850495",
    "0xe88a33ec106e725d5237813d6070989775127cf5",
    "0x219a3d20b49d5fa32a6c89559d9dc28cee37eaa8",
    "0x9f1fb9f997d8f645bdfa519847fe4d65c8f861f9",
    "0xb169ad9edd1ac2b258cb056a00c925abdadf26fc",
    "0xfd7ee44b92d4feb539007fbc91a1c29b96d9d491",
    "0x907b6202dcee1ae5d3a9ccd929f736e5857a94be",
    "0xe0ce1d5380681d0d944b91c5a56d2b56e3cc93dc",
    "0xf9a77160098f346becf6ea6f8f411207922f6677",
    "0x85d5bf6231c6195764cb8157843a79e173362d3b",
    "0x77723d91de098d15a3b8c92c022384f901254bc5",
    "0xcc30acb19fa6469e19f0c39db2ae151775e8f334",
    "0x0bf045d85853f4cff733a6a2839aa2401833614b",
    "0x47ebdaaa1da5a2907097a15f8c68617752c68523",
    "0xeb3b164269cc31ef12d7ded7c4d5bab10067107c",
    "0x37d3bbb3f16e2bf7394270ecff16890606a5cbbb",
    "0x2c66c306f623886a895bf68d1c5a316dcefddd13",
    "0x409d68c26af235c81e2b9bb213603bb390e1d1aa",
    "0x53889dc7a90d318fae1d2dae27db1633fcb8fa23",
    "0x32c4ae48e6fa3b8d7811600b5d9e1d500eb94de9",
    "0xf8e7bceb14d1c5017802ad9582ac4a0b661fb388",
    "0xa1ae2bc91f0cb1b13bf92e42ba3c8191a924e99e",
    "0xe512fbc65a7245834e1080ce659b6d5875969206",
    "0x7954006f16b4e6c7cb4073bc1d382cd3d32ce4c5",
    "0x3d6a4fc74b03eca523de244cbc6ac9b59b518478",
    "0xc39981c63bf3c83bd93f75bfaf3e8123d1dc43dd",
    "0xbf513305a1d1a1f0c8a10485339b60da753b3474",
    "0xfdf6f1a2d3a0a24807de2cdb3afd2a813920436e",
    "0x2ef4a1ebb0b32e6140ca52b5e8b75f2598a52418",
    "0xb965c131f1c48d89b1760860b782d2acdf87273b",
    "0x62cad357ebc6fff4e67ac536b1b61722251c1ae3",
    "0x8dbc7a3d8e6c1689cbb9f0b0a5efe139479f7e5d",
    "0x9bcf4a90296b30f74d15c49775822ea4e4f0e633",
    "0x6f78797dd99a877673552d1f78e863a59a4bbc43",
    "0x35c326041cd6953b3f20ede7d471426f081eb810",
    "0xdad5de7714113e32c0b8574f1f396c0a76dda380",
    "0xf458a703bf6bf721b2826c8eefc7efc8b3b0f227",
    "0x4f608d5bc43f1e80f1b4b56888c1697ff9d160e6",
    "0xf4b715be7983c2e949f397d53f1a435868a9f25a",
    "0x5c812308ef416579af03b4bd80065d8e41739990",
    "0x416c0c9e9ea860dee8062b11652a1cb0dffa3d20",
    "0x55f9ac3c134eef11d302e42e82c75a8c33081d15",
    "0xd954b1e2c25cd3c23d77e21def6b5710c005b1a5",
    "0x734d284ca4c228a2521668300203832e7d456509",
    "0x1d34befcc91c95da6c384fd6f46b7b64341d86ca",
    "0xa230f23b7dcb4ee22b33cb160e83e57aec2c7a8b",
    "0xe18a59e582eef94ef4742c721a8a8f7c2186295e",
    "0xbf72e9b935ee7fdcbe8c8f11b297c74518aa779e",
    "0x83143049f1501a696f32ec638af62d71ba2fef4b",
    "0xda7c1b91db8429c44b77d0bdd20f0232f3974289",
    "0x0a458ec1fcd91b3ff23810d1a7c65e7d3fc7d111",
    "0x719aa1724e9ed40da916961afb37910cf346f851",
    "0x8ef58a4068652c900816d25e32bcb6eb36bcab71",
    "0x921586e35bc38e360deead11ee5a9a1aae74a25e",
    "0x7097119c03bad1f5a95591b4c5410a7f2aa13b47",
    "0x6be6274b83fa97ab39c14d0de42ec006c11d3cab",
    "0xdf71d5b3d3380f3a62df2f78bc4dd6c6e02b4ccd",
    "0xa3a5fa3dea7e173338a82504efa6c55f3f7223d9",
    "0x579cc276241ccc3fc4f56e761ffc85904fcda336",
    "0x217fe15fe0ba16638122be20d0c2d3442b689d82",
    "0x133b0bdd32196f6ecedb4bcc024875110e45f344",
    "0xf717a723372f7e269339a5b3ff52952f6641ea56",
    "0x38be2b8562a4241253c8d4d57325bd3419fec551",
    "0x61199b99f2d6c54516d465eb0b6b86729916abaf",
    "0xcd353f79d9fade311fc3119b841e1f456b54e858",
    "0x7f694841c3df9a454126a614bf9b89205d8e3039",
    "0xda213f89d23c55062b4d5972cd4d178194f64e8e",
    "0x55b66debfa695744d3de43e5e62aff6d128b3379",
    "0x20decb2b3f2c5db6fbdb90f25f4abacc391ade42",
    "0x252add40b104a664a148c7f2b612c3bfeb2ab227",
    "0xc89b8fda670033541b82edf7d509275834d60208",
    "0x7130d1ab6d9c657240331a4de3e88b5497be9ceb",
    "0x823955cd569f8c27c38b8c90ad40314262ca5f3d",
    "0xd5d076894b21d68c7c98f35a7b3c4c8821c296e9",
    "0x4b5b00445afe51b629ce641df1c2044ab63fb569",
    "0x45bac6629aee6f95ffe0ed4f4409017f65bb6ae0",
    "0xf0a07629b53f7814eb2a2f0b2c713ea64f4a2377",
    "0xaf80c207c3efdf5a5fc1ecdc305aad314b65e68c",
    "0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827",
    "0x23a21cb8bb38d3f26f8e966f098b9312f64415c1",
    "0x9c50847f7486651178ed8dcaef165b6e219fb0a4",
    "0x5d72bf8f600059642a242448c48ca7f51f5c2548",
    "0x654909a8a8b623e34c1d6ba50315651c3799ddee",
    "0x0a9451062902c989eb026dba12b0abfb7a66177a",
    "0xcaf7834cab11e00123d3510abbbcb912b39ab456",
    "0x74a66f90c230ae6f1d3aacf75e54b11fdaaafede",
    "0xab9cb3817880e37b8fc6fd1d5cedcb84ae9b8c15",
    "0x2317162af22f6b335787a8aac4a2fc561d1b38e5",
    "0xef6e1fbdd30c7e6401db71f6622062b1b99c5060",
    "0xb514575a02dccbbac17436ae3f39eee7897ccd7a",
    "0xb569b9cb7b6d2423d690937701a6a2d3bc5f428e",
    "0x4ce6d1e5a098a374f5b8216a821e74ac08431f52",
    "0xc53e4ea29605bed0d8a2acbc55d921064059f28e",
    "0xb988bf9071697f233d1e9efe3927b641237d247e",
    "0xb4dcb5720d77a248abaaba4ae34858083bc66927",
    "0x29a92b95be45d5bdd638b749798f0fee107fdbc7",
    "0x7b9c91183a25411a375e1567ee5f2395c5294021",
    "0xbcc871ad1ce206b0a228c133c3fed98a7bc8c4da",
    "0xd80a78f512829458b25a503737cf78d2e0dc301b",
    "0xe36777e21768e51bec2c676ff76ccd8f28377e52",
    "0xc5df216e315f3e57e641da8d7b7f271e0efe7366",
    "0x9003e1a7cd4b58e5a49870a9122e038d676a553a",
    "0xc0e53bd0539b7f2dac98fafd5bc5f65a491c16c8",
    "0xaa1c939a3f266e5ebb31339eba396e73b51ce758",
    "0xd11bbde14c6ad396b28c2fcafa249499953fd29c",
    "0x792a5a04b6c1357f7dc3da620621b437739e193f",
    "0xd61d37e959ef76f590bd3dd986b7cb898ff0dcee",
    "0xcae98f781ec17535aef6e2b46bfcc6ca90d78636",
    "0x8c352995adad67eebbe2eda1fef56102035c8aef",
    "0x2747635f98a3762543a02d281c136d58bb8e6833",
    "0x47aaf7fb3fc4b2c04fd3619440f17c6118802814",
    "0xfbb102791bca7695c7897bf0531248cc0d47b030",
    "0x98cfc3e4c4fbaa1c2a814104fcfd31313511ee71",
    "0x16ca7dfee3eae0b3618fca18fc87b87380842875",
    "0x91d5eba1087d062dd656c3e62eeba924d94998a3",
    "0x9b2ff150d6c631244988af421c330cc632331596",
    "0x3b8e0fe3c6332c8834b59f63af390ca2e85885d3",
    "0xcd353f79d9fade311fc3119b841e1f456b54e858",
    "0xc544576de3ce33dc2b93dbd5a533d29e641fad10",
    "0x259b5a424f3ca33f1c5cd3cd8fe4bd9039ec3393",
    "0xc59f7ff808889e932f9b8bf405bd3e698830b4c0",
    "0x91df68dd7f9fc77bab1c61e6ad1c568036dc1d9a",
    "0xbcda315446ca4fe9b21edbe1f1f0dba683c59a9a",
    "0xdcb8b99e97e8f8536854aef67535e95843aa9bf5",
    "0x3a9490c56efb1a7b55b484f2d2bba663dc05827a",
    "0x0354743c4a5bdbd290c330a72b6cceb1491cef91",
    "0x9a0e1011460e76f25576883f0555a43924b9c1a2",
    "0xec6d33ea8a25e10d1095a32978499c66d72e4811",
    "0xd989c73f094f3c9e93147a526687c9ae8c216b3f",
    "0x5e58e0ced3a272caeb8ba00f4a4c2805df6be495",
    "0x287bc00455dd50dbe2188926f853835297387ab2",
    "0xd5b16645f12d4bece4f8b29fb0392da7259a24ff",
    "0xd477b6ffcc082039df7209fa62ea7fe1dcf49b99",
    "0x64106bc9e4e0d5ba9537a3582d27799fa3dcaf61",
    "0x3bfc61bb53276b5734225b8cb4a45bb0d466f970",
    "0xa9e9b3858204b2a5676dac3b05994d1ab623053f",
    "0x5fcf087429edc1771b0987dd94547920fdbb5c21",
    "0x0bb47ec28dd608486524eab1379a0a4716a4578e",
    "0xdfea739ac76e7502d6d8f0de24379efe4dc12bb6",
    "0xf85ac8aff5ad22c745bfca07d65fbcde67a04c90",
    "0x65cad5694ed3e23c2e671bd6d1386817f655930e",
    "0x3425ab3a6a92aed14c665fe8c9c206386540fc14",
    "0xce68e44d522a24805ee71749f1e1d6cb462cae91",
    "0x18fc48dec00a98ce3b49052adefccaae802385d5",
    "0xbb0dbc0e2b6fbef902bc046ecfc2d664658baafc",
    "0x0d407bc857d80d79163ccf60a9ad446eac9017e6",
    "0x15918043872dabcc3dc9a9b1d1c0f96505e6a5a7",
    "0xf939863bb282b3e87f85218a0eda0745f0873d4e",
    "0x82404e05857e83ba35faa99824245cdf641845e3",
    "0x439d5928f4f16e17efc77f3524afbbdf8f56da20",
    "0x54614f0e1410b1a2276e42cd42482a3bd4705c78",
    "0x8b08434c77c450108b4efaaa6b33b0352b18e254",
    "0xb1413edee69a7fd152e5dff2be278e916fa73b21",
    "0xb3a46650fad8a6548233d8eea5a4e5f2e4abeb22",
    "0x422e99b99f35edd9763bd8f2bce4573926dea21f",
    "0x2310d65f9003f9f7ec974b89772634548f4905a7",
    "0x8b1c1b05e1557ed1027bfd55e57648da7cec0405",
    "0x8ee0fa091cf31c2b410450787aa2468f2a7e554c",
    "0xae0d2798bbdd3b8c693bd4a523cded8edf32e3c0",
    "0x593afd7c3f20fb6d6d698abf7cc02a95dee36f26",
    "0x91351c266945cccf847d1ec5e2e354cd8270e63d",
    "0xc961ac0404f95141573dae224525ae936bd3bf64",
    "0x7b14fef2b899d05cc64522220254756fbcb07e15",
    "0xe014fac9ff6015a6ca9f9321e8e947d12f89e3a3",
    "0x69ecc64ce0dfcfa08ff8d8ebc818dad883f36b77",
    "0xa0bbfdf57437730cf3a55d6411890fe1dd9c87b1",
    "0x88be49e33f2e364b42999fdfad07513bc245e93b",
    "0xdc88437519f4d86ee6f69657455e93cdc328f8e4",
    "0xbad11fade0e96ed550af1dff366b65fc7126df9f",
    "0xd1d3ea23d3e7a0ef3fd529e957f39f384e43db78",
    "0x88b77924a57cc6dbbf9be4158b7998f2efc351c0",
    "0xaf55e3f63c75e8e4fcc9cd4f8154b0840d4ee803",
    "0x94f3cc628a30fee244056d7e3fc29cf72e9df873",
    "0xc651f84d436c58d037710ca0bf907524bb1dcef8",
    "0x0fbd01079a88d1a97b9eac1fa724705c807ba1ff",
    "0xd5476ec927443791c63f1566a9e99e9cdd6c8f4b",
    "0x0dc097332e48cb70fcb1dae7b9dbd63d18131ce7",
    "0x4fcb2bf7c03565f24d9959b36d2ce34e217cd4bf",
    "0x2203846fd483e557e3a6d7f270637c7685472658",
    "0x13eee175641d19736ee051b381cd28dc8b09f9c9",
    "0x1eb002138610aa338945a1ebaefc896c3d1a77a4",
    "0xab087514bb8f44501afbfea98c844e2f2b30c023",
    "0x64ce2bece3185aaf3c72fc5f7b0f0d1cb99a25a1",
    "0xcee763bdb6889ef54939e79261473de92ec83dcc",
    "0xcd353f79d9fade311fc3119b841e1f456b54e858",
    "0xf8281988343cc9f479975e9dfef2b064fdee8da4",
    "0xa341af5b94ee3c579667075b8b6091023611e9c2",
    "0xc926daee416cf6b63f0979c7563c5a45c6cde54e",
    "0x0c9580ec848bd48ebfcb85a4ae1f0354377315fd",
    "0xdef121de2848c71a2ffb81e4af93bc9d06fcbe82",
    "0xd4bdb68ad7490149587c1117f9aa20d862105d14",
    "0x6c8c54d5808a8dd24482232ce11b29b37cc9ccd2",
    "0x5f3dc00f434d81389df1a807eaf5c04efb109cf0",
    "0x6a2c2e7bb242c9ece355f9c6c7e3f96e43c16263",
    "0x7d7ff983f1eefa40146e460e3b8beaabba65c6bd",
    "0x3bff8725219504d31f544b55480ba00b0d4cb173",
    "0x42b285531d9afc8bf5d1c84e334e39df0bdc5d86",
    "0xd7e604aef39c9a1c95bd8ce2d0cd2753ac86851f",
    "0x019cd22c4b4aa61588df4c7a375e95d9c47fe27b",
    "0x12c9852be7f2270917d3146571ffb95a93c440f8",
    "0x430b38c5b73302c6c0a7dc3445f37e8366249e70",
    "0x1fb22b0c2e130d4d81b862d46563d34c72e30aff",
    "0xd21d11ab4266b5faa5781f74d3b9cb1aab202fab",
    "0x43e45615b2e29054bbdb70e8e69f67fa708edfeb",
    "0x00d36e10ffcaef2bb83b02531650a986bf838c80",
    "0x0134f0d3acca6929d2fc8c34d7ff8117f5b8c2d6",
    "0xacad739db350cf6098e83d353b4783875ec6ecea"
]

const usdcToUSDTPairs = [
    "0xf6a63270517f0b4d3d999a4b367e0821e285586a",
    "0x7242e19a0937ac33472febd69462668a4cf5bbc5",
    "0x3f24e142fbf05d16ab1cf79e6df3473f515b16e0",
    "0x0c04f4750d3d77749c4513e3154bb980301f73f8",
    "0xca5b1ef8ae43e1f05809c0f31bb3d66e991752e6",
    "0x6cb9ea2d1e00e0eb573cb16a265991515b3ff06e",
    "0xb39aefc0ea6230b880f07f2ec1aa324f2e57465d",
    "0x7da722fc0dc4732bfc32ffce3baaa41474947fc1",
    "0x8dfcfe28cdbcc2b685688f2d2681626125845f54",
    "0x1542ac4a9cb9b969f6c3ee25e9da64254aa273dd",
    "0xcf0ca1dac4ae4efed637e0c071e91a7dc850f248",
    "0xba4f73b753669a939f227788bde1bce766833dc2",
    "0x6cf66b50967f1aabb62aa2678e877f06d26fa5ae",
    "0xfde125091165ef4c03c4c22b4840aa8096e48f5e",
    "0x0a1970792114aaa40611b95988b24644583e7d3c",
    "0x63ed9319f8f90cb3519d37618b3b97ab23836913",
    "0x51f0a57d5fe33057d75037dc62b35a0ba2350679",
    "0x3ae5ad1a9197dd4c6ee45318bbb744659658be83",
    "0x6dabe03d0e56450b282a4413ebcf1fe0175dc38d",
    "0xf3322156c00dc6e4b345289804fcb36030e1150c",
    "0x42ac6116c273645b417bf80bc74007f640b220d2",
    "0x7cc2cc154081e8ea17bfa4978f3feef1169436e6",
    "0x5a7ba2050add50531b532f25a97e06ba33dbb0c4",
    "0x96e922ff63cdd9b4ba49b1197dd4672a58e3c923",
    "0x1bb6b16727a68e242a45f9cb67fb2939c9757ebc",
    "0xf3a55033b95cb96448fad329b517415dbe626b47",
    "0x54bbabacad5460e395447cc202a1acc67159693a",
    "0x3c0e3ea7e0a6ae33f21f2994f0952466f55f3512",
    "0x1e38fe64500a52f8bf3552d828e7a63095744fa3",
    "0xfa8286ce9a9ca82d4a689a52d0771654be102ed6",
    "0xd547065218ed2c1de897239fed3a0c61273087ae",
    "0x4c6a549b7e1dd26ab2bac189b8389039163a2721",
    "0xcdcc5a52aef9fc28abfa17127174bbb620585b2e",
    "0x1ce19f464a20b654c8ab359194b38d736105b640",
    "0xd002cba1a26bf25b3daa62cbc303f20711b3a56d",
    "0x05d68c9f042b71a04d17b56e35005628c87700a4",
    "0x854a8b385e1dac2731c40a8daae0234c4bd568dc",
    "0x30d4b8594afc6f3c2bd73f078fcd75459dcba91c",
    "0x81656492e6f2ee85c06ee7e98d594f67d554b867",
    "0x384c1b95027b73a98fe31ea5b4b7b031b9ddd724",
    "0x283127128da6fdfc11da1314598326b2a84a39f7",
    "0xca9de85d73a1794f6b9c1550efb6920af90e094a",
    "0x13b572f9f9459af00cfcad506c1c14d3ad2b48cf",
    "0xd8edcc5da51143cc1edde58fe3204a5584ce5844",
    "0x9d818c34a2d13c6cd9ffdeff5dfab78c111081bb",
    "0xb4639114be718cb817846638ed9652c067082826",
    "0xe8950731feadf2e8bf379c07b23afa9e70fa0130",
    "0x7e6590814d37dd4b0553b5547a540a7f8b604929",
    "0x08baaa8e443b0928abd352cff4976333366fb6f8",
    "0x33919208efb4530819e9769a51fe4cf2524f56b1",
    "0x1a3876e3eef6dcf2e1cf5c181ef509d388d97b6d",
    "0x2cf7252e74036d1da831d11089d326296e64a728",
    "0xfc345b2ea902a96a0638a3afb5864fa61054d6cc",
    "0x75f78aab0ecaeade61ad618e0820bd3229af6fdd",
    "0xbe40f7fff5a2235af9a8cb79a17373162efefa9c",
    "0x9ec257c1862f1bdf0603a6c20ed6f3d6bae6deb0",
    "0xf38d18265d5bfd00df4456f9146e5ba5be6164af",
    "0x5dfc1721cef19ce2cef625f488d77fab86802fd5",
    "0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001",
    "0x274b6d2e4945fc8b143a19074f25d98cbec797d0",
    "0xa73c4b2164ea28a2faf937095fabc230141fab5e",
    "0x59feb48aabd9b8124554657998cb0f3ed3b373aa",
    "0x97b4f2797cc903d76f9b8ff41a94286f0b16198e",
    "0xf938d98ade027175271f813b4f042bc8fba769bc",
    "0xcb5d57dbb0cbc7b0d94380bae96a5ec657f81563",
    "0x964ac9a783513f0cc94ed2734ef5d29e4ae54fbd",
    "0x2a25d5185f8cc8098ae0433ce2dc88cc30bc0eb3",
    "0xd0403580e206921cdf2d62c2fada351bbfc2ae45",
    "0xac7dabf03e50b2130e6409044e06804de10ef161",
    "0x8f19f667acabe0c249e5424a2da821f1d5048e73",
    "0x8200125d31ec1776b29b45a91eea7a3f6a9a171a",
    "0x6c73b9a94d2b7539b3a8c1035c1df01af0677498",
    "0xbc53ef2c1f90fd613430f8fcd290d432643800d6",
    "0xc993029a50571ec44265a5624c1220d2819000b7",
    "0x65f0d0bc2b3ea4a6fcae5ca6f27e65cbbf5c048e",
    "0x212f46b2db2cf46f32a8ebc48031d06609139b27",
    "0xa04c50463706954537dd4574de522a030b56b539",
    "0xe3014ff72a9a6ec43e0ac8e4e2b94f44486a40ec",
    "0xf550b19dd72ba367f90fd6799cfb8dfb34f9420b",
    "0x20bf018fddba3b352f3d913fe1c81b846fe0f490",
    "0x513bfc23d5d0ff6e054446fda6f1b7099d4dc8e4",
    "0xae8d7eefbf5001c512137b4794814d3e606a2d6a",
    "0x42286296c3ede3f6a0ec4e687939b017408cf321",
    "0x50f820d987f450b7961d99252e2a2ea874fadbde",
    "0xb5b7f5ce64a89fada1e3f5ff057367bec8a6d7eb",
    "0xa8c1349a88523b6f5ee24ffb8d8ce35f2c90bf13",
    "0x57ada541cb34ecf12d1d457ee1d96eae71b39333",
    "0x9c0f54f5e69e140a194dff10f605c77468982545",
    "0x0ca2735f0aea0922a31fb263d6abbb77633054bd",
    "0x96f1ef36b52ccc103ee4e3b0c60421542c804af9",
    "0x124d9821c1d34d5ce0c2a8a89e3b0c2dc91fda70",
    "0x262e7a8f09d18b935d7243cc1d7ce00ed57db636",
    "0xe84cd302789a95cf4f4f5bda98b35b780dcd763f",
    "0x7f4cdea583b6c4dd3241fd6618236ff1fe57f549",
    "0x4efb74d2b471f52a6873605ab7790ff0eb68abac",
    "0x9fd29013027684f7785d88abb4eb41341325e2ee",
    "0xfc9d506c2db76a2c82bec3dfe2c845df3db7093a",
    "0x7093ae7ce8a7dfee43627a5fc1173efa18211dc3",
    "0x8219c88a57974e60b81011526adab508c9c7d73b",
    "0xf1f62425d22fd758a7dfa3f0bfdbe8ba364fb5c3",
    "0x6007a4c6f6d9e33cf27f3ffd2abd903e76750682",
    "0x64f66b906480fafce1d6114db11a35dea2543139",
    "0x8278d6c8c0e4bcf9afb60d36f6b075ade1492982",
    "0x7816635482622728989d4a50f64171b62016a551",
    "0xfa99c28a42870df1a4c08abba3d0e0fe06b049dd",
    "0x51c8fcc0993672a26ac5a59edebe93f28fedfefe",
    "0x18f501866fcaa9935367a223b79041e603b3b86e",
    "0x3765d4b107bd9ace9bf367fd25edef33cf809cce",
    "0xc4009359bced80bce1ade056e53b710fa885f962",
    "0xceac64c42974b8da7d5c4f81a1ef9f7104723f98",
    "0x6566f3b85d62762cc1d98a93f38282d3e60c9bb0",
    "0x12ecb405046280c4b886c58157423685160827b9",
    "0xd8a82adb42bfeea1f2d7412b8ac0e7c81e1c9460",
    "0xdc0f3b388dd60f48d2508f05006a0632e76d91e4",
    "0x3e65ccd3de105f7be6821e196355794a60e14739",
    "0xb3ca904d4a521b54f2c1b2b6f5584e295f700909",
    "0xd820ec99f8c2a93efc19553c8f5a9e3341f838ef",
    "0x5184f82c16ae079c98a0fb21826f81c32a87119b",
    "0xcdca692844c104dffc41fd9b9a8797a17b922a42",
    "0x81efcf78298e951b6bee15cbcb71070c62970bfc",
    "0x148258df134a417b7bcc0e5be320cb87a078f3cb",
    "0xc878f03372852bd04b3734a43d23bdee534dcd33",
    "0x15a7ae039413af233205c189874dc7d8a7461c80",
    "0x02fd1fbb9a28e12bcc112f7fcfe608b5ccd95b58",
    "0xcb3bb026479f595a4da8370ee5a0c5cd12f04bcb"
]

const wmaticUSDTPairs = [
    "0x085fe343aaf4b049b54dc68ab47c2121c70763e9",
    "0xf7bc741b2086ca344e78225d06224ffdcd86d110",
    "0x75992e8266ab600d4e9b0d7471db6ba0d75b44b8",
    "0xa5989849ee7a1bffa1d4862331ec277fc1530028",
    "0x0b23bd7d56160272049c6b33e2d4d575b6be46ae",
    "0xd60641c40a9aa3e4dbf85814785940fcb259ddb6",
    "0x8b4437bd956c411cf326c36caa6e2803bf230d20",
    "0x1505af55938756559541c49d093fcdc2ae8e674e",
    "0x45eb22986ff634b9fb3e56ead6bb6164e36103be",
    "0x218e468b15469228f35b0e7f88425cd45fb982bd",
    "0x373d3587d6782a44aa11507a39ce0b278724909d",
    "0x787334006b1d62ae182169bb96fe66e59d3b3468",
    "0x416cd487dc8195c7f67a82ff78edef3b3f13f385",
    "0x22c23baa73d0804b2c05fb2789a212df65257e4d",
    "0x0ca60238f931decd9ca035319ef402ad5a7c6435",
    "0xa28424f5391a2c7512efd92dc178a3a125408cb0",
    "0xb2b39b54a82aedcab018eb601e8fcd19bc6ec8ab",
    "0x8ae2341a67ce48ed0cff19fb757682c89aefdfbb",
    "0xe7db2870aa044d75921aa7dce8268c41c50bb8e5",
    "0xba90fcb9bc8e09446fef99be47fca2689e6b8cc2",
    "0xe2eb3b0b6a698071575a60cc97680b67e13f4e18",
    "0xc36884a64f12a48407b279721dba91d415545ca6",
    "0x1c87d8c743ae69381d281c9c706fcf7dc1c36e61",
    "0x23329d03b4cc722d92efa99b352a2d246bef03a0",
    "0x739e455e1e54761038e4d8985c4fc7be9cf35576",
    "0xec23fa6ca6c510a46a5988afbb779d591f4711da",
    "0xfe122521a868f0f317adf9cb671bb139e04c3d96",
    "0x02116b1c2b6ba8343757bff77785e3844cf0c268",
    "0xa1ef00954c1c91afcadf439dad69cf647a2bfcaf",
    "0xf39e4ce2dedcfc3103436621075003174a1f84b2",
    "0x09d70798a19f8201e98daedabb46bd4e6f81ffa1",
    "0xae5faf42d7a9f637b82987b3c177f2f46fd5f3bb",
    "0x91ecc60724e96c5c911dc2f4343d899cd04c5faf",
    "0xe57773b55557bbb7ec0544ec08e70ae87ca7f765",
    "0xdcba618df52677a1c41bf195104fc8c498f73e33",
    "0x8ad4b3f2c3cc0e4b017e48290f1517824830aa04",
    "0x54414d54988549d0b583b2b8a9c70c94b74548f7",
    "0xa84221ad67a996d6753c1456b7a2711084fb75ea",
    "0x35d59ac5629ba7acddf294010efc9434cb9aecff",
    "0xe4e3a503a5bc0e1efc5217c13ecc2462ffaf9cea",
    "0x82188c21263a893bf34d7b59ca56d04e0a0727fe",
    "0x035571c65dd6cfb3052978b41e777688b72b19e5",
    "0x595519dab18166f23d3a0592d83dcad4ab88cf25",
    "0x21664aa191e5a28a034d0050debaed6b48d16dbe",
    "0xa3e4f5a045d386d0ab25bf003d89aa531cc53837",
    "0x92fac626fe193c00e13b553a7313057124cac65a",
    "0xd724b218abd67ca32ce1038f742b535abd629f88",
    "0x4db1087154cd5b33fa275a88b183619f1a6f6614",
    "0x8b89ad716284ec69d2165f9b198e48e519cb8fff",
    "0x3b211c86c533ce0650a7f813a8f034e4b901b478",
    "0xb21c3387aa3dc5f476ac8678e3f3c9520eb52ef9",
    "0xc7822550dd0f36715e5446986ec2da14e0bae40d",
    "0x4de238196e067fd7d642c1b5a238c18a63f58f34",
    "0x068c9ce6abe3544af19fcf7a55ddf7c92614fb37",
    "0x9a99905c0d02c744534cd07afea4803e385df56a",
    "0x205f7fbe1c8d2fb5a6c4efe8cc806a0f4c6766b0",
    "0x74b9c3bf155a4f4d5925f99057eb4215b536e377",
    "0x77ed9e1d57e354feb373d3f6177f949eb2baba7e",
    "0x89ee602ea7dac1bda0e24cca086dbd2876fd54b4",
    "0x5a218e3a6c571c161e9cdbedcf699e219b737a67",
    "0xf86b4ef132d8823729971f379615b78c7710b54b",
    "0xc45c82184f4a93d0e0de284a1b15755af85da7c1",
    "0x762d134c7f6edfdc885d00b146983e30ffadc9e9",
    "0xf0b18ea2ead1f954d4ea2d1f4eec1ec8888e04d5",
    "0xbf68e75977f3823618725cc3f6ae4c59498593f0",
    "0x1b9b207a21f95d349faf4f25aba068072dd5f638",
    "0x84d0c9131a6bf227c960b94e47d84709fab01712",
    "0x95e6d697c7b0195cb3a6a85bc2a9eb44917de037",
    "0x50808574f44773951dc40626351a06a984f7311d",
    "0xfe9d2fb07e4eb47eff0ba3e470648f5b11a956c3",
    "0x2ba7856e71899d5695bbdf6b9e20bf9935320745",
    "0xa789324e64268c5385ea7678435fa83532705b0f",
    "0xd9d45e53cbfa4ab5b080425fd8e273544deedf76",
    "0xb000053b4f217b54285b73a8f65793cae531920d",
    "0x250a890be232f598cd3249db912c683708d234d0",
    "0xea7c3b5299f6807f69952e2a2a33480bfc708a7f",
    "0xb9656e80f6d79b02cfd0bf879be93b712c6e699b",
    "0x650332871a182da99a8334492ef1b79a2701ee50",
    "0x442db78861ef17ee8b9aa436d12ab41481b41d24",
    "0xc1bd93c22ee16fba9a1c69cf70f9921ede907c2a",
    "0xd0350e224a89fa5bfda6b0c752369bc5da0ac6bc",
    "0x14ca3a0c389e0326ca8c60ad2bac220acc294c87",
    "0x2f745816763383e4fac923a5207eb0a9359b52c1",
    "0xc1baf0f523833594ee402043a2bd4fb0b58f606e",
    "0x0e8d09ad1a17f2558253638ff3a4d98afe64c98f",
    "0x766d7a8b8dd365ddbb9b69c0a07509b736efb9b8",
    "0x55ff76bffc3cdd9d5fdbbc2ece4528ecce45047e",
    "0x70dfc8493ed75e68678cd7ce610e5be84b486c72",
    "0x19cb487ad74cf3e06f7d34b6f31d7d866d34da21",
    "0xb4682fd5a717c919714052167ccb46492e8c1ee5",
    "0x3b4c8f66bb044f5e35b0147d0835a67894b25917",
    "0xd267b80c8eeec2a4ff95edd90b4adf4c19260b2d",
    "0xfae54311cdd545319b82bafb87808ab5b9a5a0b0",
    "0x604229c960e5cacf2aaeac8be68ac07ba9df81c3",
    "0x44c283445e84ea33c4a2c82205e730c0bd815d39",
    "0xc783369170f6950c6afb2db328f78989dcfdda34",
    "0x6d65adf782c202788b1814e39cad2221547c1900",
    "0x236640ec36e66e5e4d3eb63d0e40893b3110995a",
    "0x0c17f6885d61556764f2ad692b2a440317f2ade3",
    "0xdd5330cecdb75c367eb273377caf691f57f18a0c",
    "0x63155e89a87bdc4f41264caa244358bd8776d7b8",
    "0x95d64177247eccf985258fa6ded87242797344d7",
    "0x643252858d58e4ee851e91aa31adf63b13b0448c",
    "0x069b749f4c84f61007dcce312642956a696c14c2",
    "0xdc6ff9a2d0518194cf88b437e7268242f126e553",
    "0x55ff76bffc3cdd9d5fdbbc2ece4528ecce45047e",
    "0x39a93d226568b841562566d06379d6e15acb19fc",
    "0x0377ca072a21038658d7ac9c4a00c9dde1284963",
    "0x1402df91c20123e0474c096c66e3ec426366671f",
    "0x50a972b5b7475eff961e18061b5283bb197c4642",
    "0x827ab2cbafdb21bb5f475e19d0c0e2197e693cdf",
    "0x33b10cca615b872d45b8b6d82e8ec6a3307cc2c8",
    "0xc4307ecf41f9e42aa4a0fcac16ed97cd1352c2d0",
    "0xc84f479bf220e38ba3bd0262049bad47aaa673ee",
    "0x89b53005e86fd69f0533cbb019c1d43f5c808f6c",
    "0xdce44a52411b6859072f45a01968da24409feded",
    "0x90bffc9b55db05e2c95569a312bb57b8369ccdb0",
    "0x65d43b64e3b31965cd5ea367d4c2b94c03084797",
    "0xf14f5ef67e4b15d3f12cd3f20a70dab7d0f5d03c",
    "0xdf100665173024e23080eca70e3aa0216578526e",
    "0x8cc5d506b74b9721e6dd315b1e73fb05162cb432",
    "0x0b8715d795fcb4f4007e91d043c1b70761266207",
    "0xde4e663019e4c3d59661b839d4c9854ac01e0c10",
    "0xace47ce0f84d47a275957e0d8937bed8eb981da7",
    "0xf9c100da2d1208323eb59953f973c1102354a117",
    "0x1f778018eade171e5f5647e58909a48cb077733b",
    "0x101640e107c4a72dec79826768c239f1eb48cc85",
    "0x2058e6cd1d8041b1f86d32cda7b6b29d49ecf4f6",
    "0x3c9d7387feb922c830a196eae5a4a0f8bc4b4f9d",
    "0x881204fbeea7958bb6ed7967a13c4ea0fe073088",
    "0xc26e2c734a43a9918aa82d8b4ae96af6835f7c93",
    "0xf36a1ac0ea83a1524dd958e1b42c9a20d1c7bae0",
    "0xbdb7a1fca7c0cddccda83d182bdc7271e0abb7f2",
    "0x42431a3b07c794697037bad9694e6905aa0771dd",
    "0x2d9afb00488a5ef5ece144e19324fd1663f5c16b",
    "0x849a088f8e5e8423cee0b0420dfb150dffce4c5a",
    "0x7d2abfacf2e9af7840002ae4ed5e9f1ea14a2d1c",
    "0xe3b39110508d039bb2d5ed29417a1a189dc55b1e",
    "0x48345a101c762dceda92cc4115a386a4408a5d54",
    "0x366cabf9a0bb68dba4626ebbb85a651695eb3cb7",
    "0xa528f222d336c8edf53603ecd7d1af1a034517a4",
    "0x769b3bc1a6475d185f314314639745a58e2144a7",
    "0x2cd55921cea7571dad8b725845f4095336f367db",
    "0xd939ff24cfc76bed9d79b79948dd788cb3ace9d3",
    "0x63c29840b141be700e256f42bb3df71063a61958",
    "0xd69ca094b678e090e0f3898d40d2b428d47bc979",
    "0x3a9990dd29284a50f0cbfa1457b02b11ead9c848",
    "0xadc9480b8ecbfa2b4ce8955be37a7a934d1e0c40",
    "0x3c4a39d870782b222ab981fdb48e8dc1fa315428",
    "0x057836c156dc0b663538c3f18d25131ddbd62903",
    "0xe55e632972e77bd070bda29f1fd62e6ca84277dc",
    "0x029ca490887ebec7ddd07d1463f2ec654ff62c15",
    "0x495b7a0610fe3e9cc11a031de466e8475a27375e",
    "0xd52976ca1c35556d6e49cccec832f8ed840c2042",
    "0xb577cdb712ff55da9a7709678f477f8b44679d5d",
    "0xc278542b6535d49ddb76d20116243be41256ff4a",
    "0x6399c8700047298fbb31f68a7fce3d609e559926",
    "0x3ab5cddbd9a9ebdebf42b0b497be16dbfc4e7a9b",
    "0x57256ca9c2d19140b51a49852080bdf9c498de9a",
    "0x12dade87f099ba32c34772c4b3b7f7c1225d58a9",
    "0xc6eecdeb5948e68ca3aae7c7a887765c112d1471",
    "0xfd5c2eda66f7cfcfcbf87b6b1d6c395853e323a9",
    "0x18e2577d162a59e290283076892cd93b19e66eb4",
    "0xf908a0e2fecfb491c1a3b597c37d43cf7facb97e",
    "0xba72472d74cc562575df1b985d262af183e1aaec",
    "0x4da977db0e667a19411ce939516bfe043d0bb456",
    "0x94579c8ad5c1ac77a04451223b20ed55e379c6c8",
    "0xc04a948a3ac64d6a829432822fb7e4c61e54119e",
    "0x3c09a586666c7ba5416fdfb3b343930423f5dd4b",
    "0x0b0adf8ff1a9abbd250040c7fe8bed0d68b7528c",
    "0xffe6ceae4747d94194dcc711773868b9aa057738",
    "0xc3b95848e80647f63bcc4aaf95e5b5b96e8ecb50",
    "0xdbf25037a90368464f994ac71258d688d0361af3",
    "0x8cc3e3170ff7d54fca9517f28aa2b8f2a3f6337e",
    "0x653f6516439220342f148bf58fe5f3dce2aefc9d",
    "0xa0d7559791667afb93437d270cf06cf7a3980d5a",
    "0xbe5fa4a5b77f8bad71148334cbfe5a045f713af3",
    "0xa1e66ccda8302a3bc2bb278b15c48e08dd1441c0",
    "0x43ca03908649f7eb8d653e1621910f53e331f464",
    "0xbf3a37be07fd1c87f0856851ae68b30185c40dca",
    "0xbf257b2eb31ab824a26cd49d6d58910e80854cce",
    "0x547907a18a7aec18e2af26cfab26e4078d22f29b",
    "0xcbb66cf1160e12afa3d3f54b3e8f353ee15ee2a0",
    "0xe1a756e12d5a8be75df84c572489a24aa1984624",
    "0x32f7392d7cf0be17229006d371f02508d3b33866",
    "0xe3283789f521499a5c2e50189bcad96c6104075b"
]

const main = async () => {
    const [wallet] = await ethers.getSigners()

    const wmaticUsdcPairsData = await getPairData(wmaticUsdcPairs)
    const fillteredWmaticUsdcPairsData: Pair[] = wmaticUsdcPairsData
        .filter(p => p != undefined && (p as Pair).reserve0.gt(amountIn))
        .filter(p => p?.reserve1.gt(0))
        .map((p: Pair | undefined) => p as Pair)
    console.log(`Pairs used: ${fillteredWmaticUsdcPairsData.length}`)

    console.log(2)
    const createCycle = addPairOfType(fillteredWmaticUsdcPairsData.map<Pair[]>(pair => [pair]), WMATIC_USDC_PAIR_KEY)

    // await getPairData(usdcToUSDTPairs)
    // appendFileSync("./data", `USDC_USDT_PAIR_KEY len: ${knownPairs[USDC_USDT_PAIR_KEY].length} \n`)

    // const wmatic_usdc_usdt_pair_list = addPairOfType(fillteredWmaticUsdcPairsData.map<Pair[]>(pair => [pair]), USDC_USDT_PAIR_KEY)
    // appendFileSync("./data", `wmatic_usdc_usdt_pair_list len: ${wmatic_usdc_usdt_pair_list.length} \n`)

    // console.log(3)
    // await getPairData(wmaticUSDTPairs)
    // appendFileSync("./data", `WMATIC_USDT_PAIR_KEY len: ${knownPairs[WMATIC_USDT_PAIR_KEY].length} \n`)

    // const wmatic_usdc_usdt_wmatic_pair_list = addPairOfType(wmatic_usdc_usdt_pair_list, WMATIC_USDT_PAIR_KEY)

    const cycles: Cycle[] = createCycle.reduce<Cycle[]>((cycles: Cycle[], pairList: Pair[]) => {
        const cycle: Cycle = {
            pairs: pairList,
            initialToken: wmatic
        }
        return [...cycles, cycle]
    }, [])

    console.log(cycles)
    let arbs: Arbitrage[] = []

    for (let i = 0; i < cycles.length; i++) {
        const cycle = cycles[i]
        const amounts = calculateCycleAmountOut(cycle, amountIn)

        if (amounts[0].lt(amounts[amounts.length - 1])) {
            arbs.push({
                cycle: cycle,
                amounts: amounts,
            })
        }
    }

    arbs.sort((a: Arbitrage, b: Arbitrage) => a.amounts[a.amounts.length - 1].gt(b.amounts[a.amounts.length - 1]) ? -1 : 1)

    const uniqueArbs = getUniqueArbs(arbs)
    const actions = await getActionsStartingWithTheSameToken(uniqueArbs, wallet)
    const exchangeExtractor = new ExchangeExtractorV4__factory(wallet).attach(ExchangeExtractor)

    const tnx = await exchangeExtractor.run(
        actions.map(a => a.adress),
        actions.map(a => a.data),
        {
            gasLimit: BigNumber.from(uniqueArbs.length).mul(500_000),
        }
    )

    console.log(tnx.hash)

    const r = await tnx.wait()

    console.log(r)
}

main()