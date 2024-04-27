const hre = require("hardhat");
const dotenv = require("dotenv");
dotenv.config();

const sleep = (ms) => new Promise((f) => setTimeout(f, ms));

async function main() {
  await hre.run('compile');

  // We get the contract to deploy
  const StandardERC20 = await hre.ethers.getContractFactory("StandardERC20");
  const erc20 = await StandardERC20.deploy();
  const Standard1155 = await hre.ethers.getContractFactory("Standard1155");
  const erc1155 = await Standard1155.deploy();
  const Standard721 = await hre.ethers.getContractFactory("Standard721");
  const erc721 = await Standard721.deploy();
  const TokenFactoryManager = await hre.ethers.getContractFactory("TokenFactoryManager");
  const TFM = await TokenFactoryManager.deploy();

  await erc20.waitForDeployment();
  await sleep(20000);
  await hre.run("verify:verify", { address: erc20.target });

  await erc1155.waitForDeployment();
  await sleep(20000);
  await hre.run("verify:verify", { address: erc1155.target });

  await erc721.waitForDeployment();
  await sleep(20000);
  await hre.run("verify:verify", { address: erc721.target });
  
  await TFM.waitForDeployment();
  await sleep(20000);
  await hre.run("verify:verify", { address: TFM.target });

  
  console.log("\nStandardERC20 deployed to:", erc20.target);
  console.log("\nStandard1155 deployed to:", erc1155.target);
  console.log("\nStandard721 deployed to:", erc721.target);
  console.log("\nTokenFactoryManager deployed to:", TFM.target);

  const StandardTokenFactory = await hre.ethers.getContractFactory("StandardTokenFactory");
  const STF = await StandardTokenFactory.deploy(TFM.target, erc20.target, erc1155.target, erc721.target);
  await STF.waitForDeployment();
  console.log("\nStandardTokenFactory deployed to:", STF.target);
  await sleep(20000);
  await hre.run("verify:verify", {
    address: STF.target,
    constructorArguments: [
      TFM.target,
      erc20.target,
      erc1155.target,
      erc721.target,
    ],
  });
  
  let addTokenFactoryTX = await TFM.addTokenFactory(STF.target);
  await addTokenFactoryTX.wait();
  console.log(`Added StandardTokenFactory at ${STF.target} to TokenFactoryManager at ${TFM.target}\n`);
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