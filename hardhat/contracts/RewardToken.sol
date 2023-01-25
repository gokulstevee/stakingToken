//SPDX-License-Identifier:MIT
pragma solidity ^0.8.6;

import "./Openzeppelin/ERC20.sol"; //create a folder openzeppelin and add ERC20,IERC20 contracts etc..

contract RewardToken is ERC20 {
    constructor() ERC20("Reward", "RT") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}
