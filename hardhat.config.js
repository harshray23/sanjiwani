
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    fuji: {
      url: process.env.AVAX_RPC || "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: process.env.AVAX_PRIVATE_KEY ? [process.env.AVAX_PRIVATE_KEY] : [],
      chainId: 43113
    }
  }
};
