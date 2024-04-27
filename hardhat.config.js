/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-preprocessor");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "sepolia",
  networks: {
    polygon: {
      url: process.env.ALCHEMY_API_POLYGON,
      accounts: [process.env.PRIV_KEY],
    },
    sepolia: {
      url: process.env.ALCHEMY_API_SEPOLIA,
      chainId: 11155111,
      accounts: [process.env.PRIV_KEY],
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHER_SCAN_KEY,
  },
};