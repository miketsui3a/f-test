const { expect } = require("chai");

describe("Greeter", function () {
  it("Should deploy MyContract", async function () {
    // const Greeter = await ethers.getContractFactory("Greeter");
    // const greeter = await Greeter.deploy("Hello, world!");

    // await greeter.deployed();
    // expect(await greeter.greet()).to.equal("Hello, world!");

    // await greeter.setGreeting("Hola, mundo!");
    // expect(await greeter.greet()).to.equal("Hola, mundo!");
    this.timeout(1000000);

    const MyContract = await hre.ethers.getContractFactory("MyContract");
    const aaveUSDT = await hre.ethers.getContractAt("IERC20","0x13512979ADE267AB5100878E2e0f485B568328a4");
    // const myContract = await MyContract.deploy();
    const myContract = await MyContract.attach("0x8536f6c4860A1D4Cb8041316d9aDB1ca5877B4B6")
    console.log("address: ", myContract.address)
    const v = await aaveUSDT.approve("0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe", 100000000).catch(err=>console.log(err))
    console.log(v)
    const a = await myContract.deposit("0x13512979ADE267AB5100878E2e0f485B568328a4", 1000000).catch(err=>console.log(err))
    console.log(a)
    const b = await myContract.withdraw("0x13512979ADE267AB5100878E2e0f485B568328a4", 1).catch(err=>console.log(err))
    console.log(b)
    const amountInEth = await myContract.checkCollateralValueInEth().catch(err=>console.log(err))
    console.log(amountInEth)
  });

});
