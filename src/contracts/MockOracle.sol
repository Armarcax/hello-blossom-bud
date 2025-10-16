// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockOracle {
    int256 private price;

    event PriceUpdated(int256 oldPrice, int256 newPrice);

    constructor(int256 _price) {
        price = _price;
    }

    function setPrice(int256 _price) external {
        int256 oldPrice = price;
        price = _price;
        emit PriceUpdated(oldPrice, _price);
    }

    function latestAnswer() external view returns (int256) {
        return price;
    }
}
