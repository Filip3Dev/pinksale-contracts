const { expect } = require("chai");
const { ethers } = require("hardhat");
const truffleAssert = require('truffle-assertions');
const { expectRevert } = require('@openzeppelin/test-helpers');

describe("Standard1155", function () {

  let instance;
  beforeEach('should setup the contract instance', async () => {
    const Greeter = await ethers.getContractFactory("Standard1155");
    const greeter = await Greeter.deploy();
    instance = await greeter.deployed();
  });

  it("Should return default/initial status", async function () {

    expect(await instance.DEFAULT_ADMIN_ROLE()).to.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
    expect(await instance.MAX_SUPPLY()).to.equal("0");
    expect(await instance.MINTER_ROLE()).to.equal("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6");
    expect(await instance.NFT_PRICE()).to.equal("1000000000000000");
    expect(await instance.PAUSER_ROLE()).to.equal("0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a");
    expect(await instance.REVELETED()).to.equal(false);
    expect(await instance.TOTAL_SUPPLY()).to.equal("0");
    expect(await instance.URI_SETTER_ROLE()).to.equal("0x7804d923f43a17d325d77e781528e0793b2edd9890ab45fc64efd7b4b427744c");
  });

  it("Should be initialized", async function () {
    const [owner] = await ethers.getSigners();
    let init = await instance.initialize(owner.address.toString(), "Filipe", "FMC", 10);
    await init.wait();
    
    expect(await instance.name()).to.equal("Filipe");
    expect(await instance.symbol()).to.equal("FMC");
    expect(await instance.MAX_SUPPLY()).to.equal("10");
    expect(await instance.MINTER_ROLE()).to.equal("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6");
    expect(await instance.NFT_PRICE()).to.equal("1000000000000000");
    expect(await instance.PAUSER_ROLE()).to.equal("0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a");
    expect(await instance.REVELETED()).to.equal(false);
    expect(await instance.TOTAL_SUPPLY()).to.equal("0");
    expect(await instance.URI_SETTER_ROLE()).to.equal("0x7804d923f43a17d325d77e781528e0793b2edd9890ab45fc64efd7b4b427744c");
  });

  it("Should NOT initialize again", async function () {
    const [owner] = await ethers.getSigners();
    let init = await instance.initialize(owner.address.toString(), "Filipe", "FMC", 10);
    await init.wait();
    await expectRevert(instance.initialize(owner.address.toString(), "Filipe", "FMC", 10), "VM Exception while processing transaction: revert Initializable: contract is already initialized");
  });

  it("Should NOT mint", async function () {
    let addr = '0xd50a088a4e3d7e020a7db6f77c347e67268a83fc';
    await expectRevert(instance.connect(addr).mint(addr), `VM Exception while processing transaction: revert AccessControl: account ${addr} is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6`);
  });

  it("Should mint", async function () {
    const [owner] = await ethers.getSigners();
    let addr = owner.address.toString();
    console.log('instance: ', instance.signer.address);
    console.log('Should mint Owner: ', addr);
    let init = await instance.connect(instance.signer.address).mint(instance.signer.address);
    await init.wait();
    console.log('Should mint TXHASH: ', init);
    // expect(await instance.TOTAL_SUPPLY()).to.equal("1");
    // expect(await instance.balanceOf(owner.address.toString(), 0)).to.equal("1");
    // expect(await instance.exists(0)).to.equal(true);
    // expect(await instance.totalSupply(0)).to.equal("1");
  });
});