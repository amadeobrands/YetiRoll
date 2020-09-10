import {BuidlerConfig, usePlugin} from "@nomiclabs/buidler/config";

usePlugin("@nomiclabs/buidler-ethers");
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@openzeppelin/buidler-upgrades");

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
};

export default config;
