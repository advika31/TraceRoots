// /backend/contracts/ImpactToken.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ImpactToken {

    string public name = "ImpactToken";
    string public symbol = "IMPT";
    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    event Transfer(address indexed to, uint256 amount);

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(to, amount);
    }
}
