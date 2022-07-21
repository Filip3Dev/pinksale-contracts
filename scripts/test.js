const hre = require("hardhat");

async function main() {
  await hre.run('compile');

  // We get the contract to deploy
  const Standard721 = await hre.ethers.getContractFactory("Standard721");
  const erc721 = await Standard721.deploy();
  
  await erc721.deployed();

  const accounts = await hre.ethers.getSigners();

  console.log("Standard721 deployed to:", erc721.address);

  console.log('accounts: ', accounts[0].address);
  let initialize = await erc721.initialize(accounts[0].address, "TESTER", "TEST");
  await initialize.wait();

  let pric = await erc721.setNftPrice(2000000000000000);
  await pric.wait();

  let mint = await erc721.safeMint(accounts[0].address, "https://hardhat.org/hardhat-runner/docs/guides/deploying");
  await mint.wait();

  let uii = await erc721.setURI("https://bafybeickqla727tv5ixlqsqhwyo26bqmr4me23q4v5oliqkot3nkprcwaq.ipfs.nftstorage.link");
  await uii.wait();

  let def = await erc721.setDefaultUrl("https://hardhat.org/hardhat-runner/docs");
  await def.wait();

  let uri = await erc721.tokenURI(0);
  console.log('tokenURI: ', uri);

  let tk = await erc721.isRevelated(0);
  console.log('tk: ', tk);
  
  let mint2 = await erc721.safeMint(accounts[0].address, "https://hardhat.org/hardhat-runner/docs/guides/deploying");
  await mint2.wait();

  let uri2 = await erc721.tokenURI(1);
  console.log('tokenURI 2: ', uri2);


  
//   let addTokenFactoryTX = await TFM.addTokenFactory(STF.address);
//   await addTokenFactoryTX.wait();
//   console.log(`Added StandardTokenFactory at ${STF.address} to TokenFactoryManager at ${TFM.address}`);
//   TFM.getAllowedFactories().then(console.log);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });