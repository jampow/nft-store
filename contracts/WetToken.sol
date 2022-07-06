// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

import "hardhat/console.sol";

/// @custom:security-contact gianpaulo@ae.studio
contract WetTokens is ERC20, Ownable, ERC20FlashMint {
    address payable tokenOwner;
    uint unitsOneEthCanBuy = 10;

    constructor() ERC20("WetTokens", "WTT") payable {
      tokenOwner = payable(msg.sender);
    }

    receive() external payable {
        uint256 amount = msg.value * unitsOneEthCanBuy;
        _mint(msg.sender, amount);
    }

}
