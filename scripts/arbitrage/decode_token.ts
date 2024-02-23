import { IERC20Uniswap__factory } from "../../typechain"
import { providerHTTP } from "./configs"
import { Token } from "./entities"

export const decodeToken = async (token: string): Promise<Token> => {
    try {
        return {
            address: token,
            decimals: await IERC20Uniswap__factory.connect(token, providerHTTP).decimals()
        }
    } catch {
        return {
            address: token,
            decimals: 0
        }
    }
}