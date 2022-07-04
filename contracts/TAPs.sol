// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

/// @custom:security-contact gianpaulo@ae.studio
contract WetTaps is ERC20, Ownable, ERC20FlashMint {
    constructor() ERC20("WetTaps", "WTP") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function buyTaps(uint256 amount) public {
      
    }

}
