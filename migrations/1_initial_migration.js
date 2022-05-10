// const Migrations = artifacts.require("StandardTokenFactory");
// const Migrations = artifacts.require("StandardERC20");
const Migrations = artifacts.require("Standard1155");

module.exports = function (deployer) {
  // deployer.deploy(Migrations, "0x8816110b5961884c1246036e2ab2Da8C7f02Cc4B", "0xAdb3414aE9A3DeCa0fC33cAA9a8957269b18B439");
  // deployer.deploy(Migrations, "0x8816110b5961884c1246036e2ab2Da8C7f02Cc4B", "0xAdb3414aE9A3DeCa0fC33cAA9a8957269b18B439");
  deployer.deploy(Migrations);
};
