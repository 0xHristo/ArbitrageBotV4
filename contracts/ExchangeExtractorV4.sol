// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);

    function symbol() external pure returns (string memory);

    function decimals() external pure returns (uint8);

    function totalSupply() external view returns (uint);

    function balanceOf(address owner) external view returns (uint);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);

    function transfer(address to, uint value) external returns (bool);

    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);

    function PERMIT_TYPEHASH() external pure returns (bytes32);

    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);

    function factory() external view returns (address);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);

    function price0CumulativeLast() external view returns (uint);

    function price1CumulativeLast() external view returns (uint);

    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);

    function burn(address to) external returns (uint amount0, uint amount1);

    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;

    function skim(address to) external;

    function sync() external;

    function initialize(address, address) external;
}

library SafeTransfer {
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        (bool s, ) = address(token).call(abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, value));
        require(s, "safeTransferFrom failed");
    }

    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        (bool s, ) = address(token).call(abi.encodeWithSelector(IERC20.transfer.selector, to, value));
        require(s, "safeTransfer failed");
    }

    function safeApprove(IERC20 token, address to, uint256 value) internal {
        (bool s, ) = address(token).call(abi.encodeWithSelector(IERC20.approve.selector, to, value));
        require(s, "safeApprove failed");
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool s, ) = to.call{ value: value }(new bytes(0));
        require(s, "safeTransferETH failed");
    }
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
    using SafeTransfer for IERC20;
    address public myOwner;

    constructor() {
        myOwner = msg.sender;
    }

    function run(address[] calldata addresses, bytes[] calldata datas) external {
        require(myOwner == msg.sender, "SNO");

        for (uint32 i = 0; i < addresses.length; i++) {
            (bool success, ) = addresses[i].call(datas[i]);
            if (!success) {
                revert();
            }
        }
    }

    function getReserves(address[] calldata pairs) public view returns (address[] calldata, uint256[] memory, uint256[] memory) {
        uint256[] memory reserve0 = new uint256[](pairs.length);
        uint256[] memory reserve1 = new uint256[](pairs.length);

        for (uint i = 0; i < pairs.length; i++) {
            (reserve0[i], reserve1[i], ) = IUniswapV2Pair(pairs[i]).getReserves();
        }

        return (pairs, reserve0, reserve1);
    }
}
