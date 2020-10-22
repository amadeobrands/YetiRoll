import {BuidlerConfig, usePlugin} from "@nomiclabs/buidler/config";

usePlugin("buidler-ethers-v5");
usePlugin("@nomiclabs/buidler-ethers");
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@openzeppelin/buidler-upgrades");
usePlugin("buidler-deploy");
usePlugin("solidity-coverage");

const PRIVATE_KEY  = "0x02474913c1cfc37413f6bb69541176a696becf60e58f2a44ec668fd8fcd6fdf0";

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
      url: "https://ropsten.infura.io/v3/73bd0ea4c5d64e248551358ec2f1a8c3",
      accounts: [PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      ropsten :"0x40aB75676527ec9830fEAc40e525764405453914"
    },
    admin: {
      default: 0,
      ropsten: "0x40aB75676527ec9830fEAc40e525764405453914",
    },
    proxyOwner: 1,
  },
};

export default config;
