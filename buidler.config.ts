import {BuidlerConfig, usePlugin} from "@nomiclabs/buidler/config";
import environment from "./config";

usePlugin("@nomiclabs/buidler-ethers");
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@openzeppelin/buidler-upgrades");
usePlugin("buidler-deploy");
usePlugin("solidity-coverage");
usePlugin("buidler-ethers-v5");
usePlugin("@nomiclabs/buidler-etherscan");

const config: BuidlerConfig = {
  solc: {
    version: "0.6.8",
  },
  paths: {
    root: "./",
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  defaultNetwork: "buidlerevm",
  networks: {
    buidlerevm: {},
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + environment.infuraKey,
      accounts: [environment.privateKey],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      ropsten: "0x40aB75676527ec9830fEAc40e525764405453914",
    },
    admin: {
      default: 0,
      ropsten: "0x40aB75676527ec9830fEAc40e525764405453914",
    },
    proxyOwner: 1,
  },
  etherscan: {
    apiKey: environment.etherScanKey,
  },
};

export default config;
