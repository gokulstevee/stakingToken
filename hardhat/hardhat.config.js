require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.MAIN_ACCOUNT],
      chainId: 80001,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.MAIN_ACCOUNT],
      chainId: 5,
    },
  },
  gasReporter: {
    enabled: true,
    // currency: "INR",
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    // token: "matic",
    outputFile: "gasReporter.txt",
    noColors: false,
  },
};
