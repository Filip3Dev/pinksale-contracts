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
  
  const Standard721 = await hre.ethers.getContractFactory("Standard721");
  const erc721 = await Standard721.deploy();
  
  await erc20.deployed();
  await erc1155.deployed();
  await erc721.deployed();

  
  console.log("StandardERC20 deployed to:", erc20.address);
  console.log("Standard1155 deployed to:", erc1155.address);
  console.log("Standard721 deployed to:", erc721.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });