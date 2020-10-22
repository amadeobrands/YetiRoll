import {BuidlerConfig, usePlugin} from "@nomiclabs/buidler/config";

usePlugin("@nomiclabs/buidler-ethers");
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@openzeppelin/buidler-upgrades");
usePlugin("buidler-deploy");
usePlugin("solidity-coverage");

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
  // defaultNetwork: "rinkeby",
  networks: {
    buidlerevm: {},
    ropsten: {
      url: "https://ropsten.infura.io/v3/73bd0ea4c5d64e248551358ec2f1a8c3",
      accounts: [""],
    },
  },
  namedAccounts: {
    deployer: 0,
    proxyOwner: 1,
    admin: "0xa4b9D4D9f0Bd2c16A2eb349F7C26aD508D06A895",
  },
};

export default config;
