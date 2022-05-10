// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

interface IStandard1155 {
    function initialize(
      address owner_, 
      string memory name_, 
      string memory symbol_
    ) external;
}