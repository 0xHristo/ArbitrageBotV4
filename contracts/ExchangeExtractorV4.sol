// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapV2Pair {
    function token0() external view returns (address);

    function token1() external view returns (address);

    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapV2Router02 {
    function factory() external pure returns (address);

     function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract ExchangeExtractorV4 {
    struct PairInfo {
        address token1;
        address token2;
        uint256 reserve1;
        uint256 reserve2;
    }

    function getPairReserves(
        IUniswapV2Router02 router,
        address[] calldata tokanAs,
        address[] calldata tokenBs
    ) public view returns (PairInfo[] memory, address) {
        IUniswapV2Factory factory = IUniswapV2Factory(router.factory());
        PairInfo[] memory pairsData = new PairInfo[](tokanAs.length);

        for (uint256 i = 0; i < tokanAs.length; i++) {
            IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(tokanAs[i], tokenBs[i]));
            uint256[2] memory pairReserves;
            (pairReserves[0], pairReserves[1], ) = pair.getReserves();

            pairsData[i] = PairInfo({
                token1: pair.token0(),
                token2: pair.token1(),
                reserve1: pairReserves[0],
                reserve2: pairReserves[1]
            });
        }

        return (pairsData, address(router));
    }

    function run(address[] calldata addresses, bytes[] calldata datas) external {
        for (uint32 i = 0; i < addresses.length; i++) {
            (bool success, ) = addresses[i].call(datas[i]);
            if (!success) {
                revert();
            }
        }
    }

    function runSimple(address[] calldata addresses, bytes[] calldata datas, address token, uint256 amountIn) external {
        IERC20(token).transferFrom(msg.sender, address(this), amountIn);

        for (uint32 i = 0; i < addresses.length; i++) {
            (bool success, ) = addresses[i].call(datas[i]);
            if (!success) {
                revert();
            }
        }

        IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)) - 1);
    }
}
