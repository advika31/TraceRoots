// /backend/contracts/ImpactToken.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ImpactToken {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    string public name = "ImpactToken";
    string public symbol = "IMPT";
    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    event Transfer(address indexed to, uint256 amount);

    function mint(address to, uint256 amount) external onlyOwner {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(to, amount);
    }
}
