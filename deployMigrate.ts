//https://forum.openzeppelin.com/t/openzeppelin-buidler-upgrades/3580

import {providers} from "ethers";
import {
  ExchangeAdaptorFactory,
  StreamFactory,
  StreamManagerFactory,
  TreasuryFactory,
} from "./typechain";

const {ethers} = require("@nomiclabs/buidler");
const ONE_INCH_ADDRESS = "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E";

const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
const alice = provider.getSigner(0);

async function main() {
  const streamManager = await deployStreamManager();
  const exchangeAdaptor = await deployExchangeAdaptor();
  const treasury = await deployTreasury();
  const stream = await deployStream();

  console.log("Set treasury exchange adaptor and operator");
  await treasury.setExchangeAdaptor(exchangeAdaptor.address);
  await treasury.setTreasuryOperator(streamManager.address);

  console.log("Set stream manager stream & treasury");
  await streamManager.setStream(stream.address);
  await streamManager.setTreasury(treasury.address);

  console.log("Set stream operator");
  await stream.setStreamOperator(streamManager.address);
}

async function deployTreasury() {
  console.log("Deploying Treasury Contract");
  const treasuryFactory = new TreasuryFactory(alice);
  const treasury = await treasuryFactory.deploy();
  await treasury.deployed();
  console.log("Deployed Treasury at " + treasury.address);

  return treasury;
}

async function deployExchangeAdaptor() {
  console.log("Deploying Exchange Adaptor Contract");
  const exchangeAdaptorFactory = new ExchangeAdaptorFactory(alice);
  const exchangeAdaptor = await exchangeAdaptorFactory.deploy();
  await exchangeAdaptor.deployed();
  console.log("Deployed Stream Manager at " + exchangeAdaptor.address);

  return exchangeAdaptor;
}

async function deployStreamManager() {
  console.log("Deploying Stream Manager Contract");
  const streamManagerFactory = new StreamManagerFactory(alice);
  const streamManager = await streamManagerFactory.deploy();
  await streamManager.deployed();
  console.log("Deployed Stream Manager at " + streamManager.address);

  return streamManager;
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
