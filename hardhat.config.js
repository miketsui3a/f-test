require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.12",
  networks:{
    kovan:{
      url:"https://kovan.infura.io/v3/50aa19ab84df4855923c094d5b4d0c2a",
      accounts:["07b94076e5c0f24c00489402a1eac10e3bdce1d125f389b6d98a92d6619f012f"],
      network_id: 42,
      gas: 5500000, 
    },
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/50aa19ab84df4855923c094d5b4d0c2a"
      }
    }
  }
};

