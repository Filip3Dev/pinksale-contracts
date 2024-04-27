const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run("compile");

  // We get the contract to deploy
  // const StandardERC20 = await hre.ethers.getContractFactory("StandardERC20");
  // const erc20 = await StandardERC20.deploy();
  // const Standard1155 = await hre.ethers.getContractFactory("Standard1155");
  // const erc1155 = await Standard1155.deploy();
  // const Standard721 = await hre.ethers.getContractFactory("Standard721");
  // const erc721 = await Standard721.deploy();
  // const TokenFactoryManager = await hre.ethers.getContractFactory(
  //   "TokenFactoryManager"
  // );

  // const StandardTokenFactory = await hre.ethers.getContractAt("StandardTokenFactory", "0xDFFF94BA8D6bE609945A1f47E44490D436B17882");
  // console.log("StandardTokenFactory address:", StandardTokenFactory.address);
  // const decimals = 4;
  // const transact = await StandardTokenFactory.createERC20(
  //   "Credit Ledger",
  //   "CTL",
  //   decimals,
  //   100 * 10 ** decimals
  // );

  const StandardERC20 = await hre.ethers.getContractAt("StandardERC20", "0x84beB0076025CDD6552D9c7ebc74BB131E0cFc71");
  console.log("StandardERC20 address:", StandardERC20.address);
  const transact = await StandardERC20.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    "0x1fcFC55CB26f1BB814023E250A3b4E0bAf3B6eAD"
  );

  console.log(
    `createERC20 at ${transact.hash}\n`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
