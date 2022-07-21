/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ganache");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      gasLimit: 6000000000,
      defaultBalanceEther: 10,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIV_KEY]
    },
    rinkeby: {
      url: process.env.ALCHEMY_API_RINKEBY,
      accounts: [process.env.PRIV_KEY]
    },
    polygon: {
      url: process.env.ALCHEMY_API_POLYGON,
      accounts: [process.env.PRIV_KEY]
    },
    mumbai: {
      url: process.env.ALCHEMY_API_MUMBAI,
      accounts: [process.env.PRIV_KEY]
    }
  },
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHER_SCAN_KEY
  }
};