// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./TokenFactoryBase.sol";
import "../../interfaces/IStandardERC20.sol";
import "../../interfaces/IStandard1155.sol";

contract StandardTokenFactory is TokenFactoryBase {
  using Address for address payable;
  using SafeMath for uint256;
  constructor(address factoryManager_, address implementationERC20_, address implementationERC1155_) TokenFactoryBase(factoryManager_, implementationERC20_, implementationERC1155_) {}

  function createERC20(
    string memory name, 
    string memory symbol, 
    uint8 decimals, 
    uint256 totalSupply
  ) external nonReentrant onlyOwner returns (address token) {
    token = Clones.clone(implementationERC20);
    IStandardERC20(token).initialize(msg.sender, name, symbol, decimals, totalSupply);
    assignTokenToOwner(msg.sender, token, 0);
    emit TokenCreated(msg.sender, token, 0);
  }

  function createERC1155(
    string memory name, 
    string memory symbol
  ) external nonReentrant onlyOwner returns (address token) {
    token = Clones.clone(implementationERC1155);
    IStandard1155(token).initialize(msg.sender, name, symbol);
    assignTokenToOwner(msg.sender, token, 1);
    emit TokenCreated(msg.sender, token, 1);
  }
}