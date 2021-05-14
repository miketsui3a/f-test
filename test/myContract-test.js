const { expect } = require("chai");

describe("Greeter", function () {
  it("Should deploy MyContract", async function () {
    this.timeout(1000000);
    const USDTAddress = "0x13512979ADE267AB5100878E2e0f485B568328a4"
    const aUSDTAddress = "0xFF3c8bc103682FA918c954E84F5056aB4DD5189d"

    const MyContract = await hre.ethers.getContractFactory("MyContract");
    const aaveUSDT = await hre.ethers.getContractAt("IERC20",USDTAddress);
    const aaveAUSDT = await hre.ethers.getContractAt("IERC20",aUSDTAddress);
    const UpgradeabilityProxy = await hre.ethers.getContractFactory("OwnedUpgradeabilityProxy")

    const myContract = await MyContract.deploy();
    console.log("MyContract address: ", myContract.address)

    const proxy = await UpgradeabilityProxy.deploy()
    console.log("proxy address: ",proxy.address)

    const proxyUpgradeReceipt = await proxy.upgradeTo(myContract.address)
    console.log("proxy upgrade Tx: ", proxyUpgradeReceipt.hash)

    console.log("proxy implementation: ", await proxy.implementation())
    const myContractProxy = await hre.ethers.getContractAt("MyContract",proxy.address);

    const myContractInitializationReceipt = await myContractProxy.initialize("0x88757f2f99175387aB4C6a4b3067c77A695b0349","0x3c73A5E5785cAC854D468F727c606C07488a29D6")
    console.log("my contract initialize Tx: ",myContractInitializationReceipt.hash)



    const amountInEthbefore = await myContractProxy.checkCollateralValueInEth()
    console.log("amount in ETH before deposit: ",parseInt(amountInEthbefore._hex, 16)/Math.pow(10, 18))

    const approvalReciept = await aaveUSDT.approve(myContractProxy.address,300000)
    // console.log(approvalReciept)

    const depositReceipt = await myContractProxy.deposit(USDTAddress, 300000)
    // console.log(depositReceipt)
    const amountInEthAfter = await myContractProxy.checkCollateralValueInEth()
    console.log("amount in ETH after deposit: ",parseInt(amountInEthAfter._hex, 16)/Math.pow(10, 18))

    const aUSDTApprovalReceipt = await aaveAUSDT.approve(myContractProxy.address, 300000)
    // console.log(aUSDTApprovalReceipt)
    const withdrawReceipt = await myContractProxy.withdraw(USDTAddress, 300000)
    // console.log(withdrawReceipt)
    const amountInEthAfterWithdraw = await myContractProxy.checkCollateralValueInEth()
    console.log("amount in ETH after withdraw: ",parseInt(amountInEthAfterWithdraw._hex, 16)/Math.pow(10, 18))
  });

});
