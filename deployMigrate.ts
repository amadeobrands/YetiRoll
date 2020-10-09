//https://forum.openzeppelin.com/t/openzeppelin-buidler-upgrades/3580

import {providers} from "ethers";
import {MockErc20Factory, StreamFactory} from "./typechain";

const {ethers} = require("@nomiclabs/buidler");

const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
const alice = provider.getSigner(0);

async function main() {
  await deployErc20Token();
  await deployStream();
}

async function deployErc20Token() {
  console.log("Deploying Erc20 Token");
  const erc20Factory = new MockErc20Factory(alice);
  const erc20 = await erc20Factory.deploy("MOCK", "MCK");
  await erc20.deployed();
  console.log("Deployed Erc20 Token at " + erc20.address);

  return erc20;
}

async function deployStream() {
  console.log("Deploying Stream Contract");
  const streamFactory = new StreamFactory(alice);
  const stream = await streamFactory.deploy();
  await stream.deployed();
  console.log("Deployed Stream at " + stream.address);

  return stream;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
