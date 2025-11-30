require("@fhevm/hardhat-plugin");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("@typechain/hardhat");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("solidity-coverage");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x1abb16e7f9d43ed0577d0ed38728e5d7eb941e75cba63913897feb99d3a7328a";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "PdDY0FCflhQnCiLhEwxih";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type {import('hardhat/config').HardhatUserConfig} */
const config = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: !!process.env.REPORT_GAS,
  },
  networks: {
    hardhat: {
      accounts: [{ privateKey: PRIVATE_KEY, balance: "10000000000000000000000" }],
      chainId: 31337,
    },
    sepolia: {
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.24",
    settings: {
      metadata: { bytecodeHash: "none" },
      optimizer: { enabled: true, runs: 800 },
      evmVersion: "cancun",
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

module.exports = config;
