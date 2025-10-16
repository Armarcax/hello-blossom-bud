// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract HAYQMiniMVP is Initializable, ERC20Upgradeable, OwnableUpgradeable {

    function initialize(uint256 initialSupply) public initializer {
        __ERC20_init("HAYQ Mini MVP", "HAYQ");
        __Ownable_init(); // ոչ մի parameter պետք չէ
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
