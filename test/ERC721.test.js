const { expect } = require("chai");
const { ethers } = require("hardhat");
const truffleAssert = require('truffle-assertions');
const { expectRevert } = require('@openzeppelin/test-helpers');

let name = "TESTER";
let symbol = "TEST";
let DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("Standard721", function () {
    let instance;
    let attacker;
    beforeEach('should setup the contract instance', async () => {
      const Greeter = await ethers.getContractFactory("Standard721");
      const greeter = await Greeter.deploy();
      instance = await greeter.deployed();
      [attacker] = await ethers.getSigners();
    });

    it("Should initialize - OK", async function () {
        const [owner] = await ethers.getSigners();
        let initialize = await instance.initialize(owner.address, name, symbol);
        await initialize.wait();

        expect(await instance.DEFAULT_ADMIN_ROLE()).to.equal(DEFAULT_ADMIN_ROLE);
        expect(await instance.MAX_SUPPLY()).to.equal("0");
    });

    it("Should initialize - ERROR", async function () {
        const [owner] = await ethers.getSigners();
        let initialize = await instance.initialize(owner.address, name, symbol);
        await initialize.wait();

        await expectRevert(
            instance.initialize(owner.address, name, symbol), 'Initializable: contract is already initialized',
        );

        expect(await instance.DEFAULT_ADMIN_ROLE()).to.equal(DEFAULT_ADMIN_ROLE);
        expect(await instance.MAX_SUPPLY()).to.equal("0");
    });

    it("Should change price - OK", async function () {
        const [owner] = await ethers.getSigners();
        let initialize = await instance.initialize(owner.address, name, symbol);
        await initialize.wait();

        let price_before = await instance.NFT_PRICE();
        let price_change = await instance.setNftPrice(2000000000000000);
        await price_change.wait();
        let price_after = await instance.NFT_PRICE();

        expect(price_before).to.equal("1000000000000000");
        expect(price_after).to.equal("2000000000000000");
    });

    it("Should setURI and setDefaultUrl - OK", async function () {
        const [owner] = await ethers.getSigners();
        let initialize = await instance.initialize(owner.address, name, symbol);
        await initialize.wait();

        let defaults = await instance.setDefaultUrl('default.com');
        await defaults.wait();

        let uri = await instance.setURI('google.com');
        await uri.wait();

        let mint = await instance.safeMint(owner.address, '');
        await mint.wait();
        
        let turi = await instance.tokenURI(0);

        let mint2 = await instance.safeMint(owner.address, '');
        await mint2.wait();

        let turi2 = await instance.tokenURI(1);

        expect(turi).to.equal("default.com");
        expect(turi2).to.equal("google.com/1.json");
    });

});