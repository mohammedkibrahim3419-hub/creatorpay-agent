require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    arc: {
      url: "https://rpc.arc.testnet.circle.com",
      accounts: []
    }
  }
};
