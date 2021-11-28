const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const Token1 = artifacts.require('LiquidityGeneratorToken.sol');

module.exports = async done => {
  try {
    const [admin, _] = await web3.eth.getAccounts();
    const factory = await Factory.at('0x6725F303b657a9451d8BA641348b6761A6CC7a17');
    const router = await Router.at('0xD99D1c33F9fC3444f8101754aBC46c52416550D1');
    const token1 = await Token1.new(
      "0x9a28dFaB25bd43aB773B7Cab231aab263722cDEd",
      "Teste FinanceBit",
      "TFBX",
      "10000000000000000",
      "0xbdE6F3b1bfb4421838Aeebca495D0A3afda637FE",
      "0",
      "0",
      "10",
      "10000"
    );
    console.log('Token deployed: ', token1.address);
    console.log('Token transactionHash: ', token1.transactionHash);
    const pairAddress = await factory.createPair.call(token1.address, "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7");
    console.log('pairAddress: ', pairAddress);
    const tx = await factory.createPair(token1.address, "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7");
    console.log('Pair created', tx);
    await token1.approve(router.address, 1000);
    await router.addLiquidity(
      token1.address,
      "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
      1000,
      1000,
      1000,
      1000,
      admin,
      Math.floor(Date.now() / 1000) + 60 * 10
    );
    const pair = await Pair.at(pairAddress);
    const balance = await pair.balanceOf(admin); 
    console.log(`balance LP: ${balance.toString()}`);
    } catch(e) {
      console.log(e);
    }
  done();
};
