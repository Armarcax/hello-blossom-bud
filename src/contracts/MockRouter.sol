// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockRouter {
    event SwapExecuted(
        address indexed fromToken,
        address indexed toToken,
        uint256 amountIn,
        uint256 amountOutMin,
        address to
    );

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {
        require(block.timestamp <= deadline, "MockRouter: EXPIRED");
        require(path.length >= 2, "MockRouter: INVALID_PATH");
        require(to != address(0), "MockRouter: INVALID_TO");

        address tokenIn = path[0];
        address tokenOut = path[1];

        uint256 amountOut = amountIn;
        require(amountOut >= amountOutMin, "MockRouter: INSUFFICIENT_OUTPUT_AMOUNT");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(to, amountOut);

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOutMin, to);
    }
}