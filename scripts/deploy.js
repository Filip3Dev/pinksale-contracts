const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  // We get the contract to deploy
  const StandardERC20 = await hre.ethers.getContractFactory("StandardERC20");
  const erc20 = await StandardERC20.deploy();
  const Standard1155 = await hre.ethers.getContractFactory("Standard1155");
  const erc1155 = await Standard1155.deploy();
  const TokenFactoryManager = await hre.ethers.getContractFactory("TokenFactoryManager");
  const TFM = await TokenFactoryManager.deploy();
  
  await erc20.deployed();
  await erc1155.deployed();
  await TFM.deployed();

  
  console.log("StandardERC20 deployed to:", erc20.address);
  console.log("Standard1155 deployed to:", erc1155.address);
  console.log("TokenFactoryManager deployed to:", TFM.address);

  const StandardTokenFactory = await hre.ethers.getContractFactory("StandardTokenFactory");
  const STF = await StandardTokenFactory.deploy(TFM.address, erc20.address, TFM.address);
  await STF.deployed();
  console.log("StandardTokenFactory deployed to:", STF.address);
  
  let addTokenFactoryTX = await TFM.addTokenFactory(STF.address);
  await addTokenFactoryTX.wait();
  console.log(`Added StandardTokenFactory at ${STF.address} to TokenFactoryManager at ${TFM.address}`);
  TFM.getAllowedFactories().then(console.log);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });