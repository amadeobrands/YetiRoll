//https://forum.openzeppelin.com/t/openzeppelin-buidler-upgrades/3580

import {BigNumber, providers} from "ethers";
import {
  ExchangeAdaptorFactory,
  StreamFactory,
  StreamManagerFactory,
  TreasuryFactory,
  MockErc20Factory,
} from "../typechain";
import {oneEther, oneHour} from "../test/helpers/numbers";
import {getBlockTime, wait} from "../test/helpers/contract";

const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
const alice = provider.getSigner(0);
const bob = provider.getSigner(1);

/**
 * Covers:
 * Stream deployment & necessary permissions
 * Depositing funds to Treasury
 * Starting a stream
 * Claiming from a stream
 * Withdrawing from a stream
 */
async function main() {
  const aliceAddress = await alice.getAddress();
  const bobAddress = await bob.getAddress();

  const streamManager = await deployStreamManager();
  const exchangeAdaptor = await deployExchangeAdaptor();
  const treasury = await deployTreasury();
  const stream = await deployStream();

  const bobConnectedStreamManager = await streamManager.connect(bob);

  console.log("Set treasury exchange adaptor and operator");
  await treasury.setExchangeAdaptor(exchangeAdaptor.address);
  await treasury.setTreasuryOperator(streamManager.address);

  console.log("Set stream manager stream & treasury");
  await streamManager.setStream(stream.address);
  await streamManager.setTreasury(treasury.address);

  console.log("Set stream operator");
  await stream.setStreamOperator(streamManager.address);

  console.log("Deploying Erc20");
  const erc20 = await deployMockErc();

  console.log("Minting 40,000 Erc20");
  await erc20.mint(aliceAddress, oneEther.mul(40000));

  console.log("Approving Treasury to spend 40,000 erc20");
  await erc20.approve(treasury.address, oneEther.mul(40000));

  console.log("Alice depositing 40,000 erc20");
  await treasury.deposit(erc20.address, oneEther.mul(40000));

  const timestamp = await getBlockTime();

  console.log("Starting stream for 20,000 erc20 to Bob");
  await streamManager.startStream(
    erc20.address,
    bobAddress,
    oneEther.mul(20000),
    timestamp + 60,
    timestamp + oneHour
  );

  await wait(oneHour / 2);

  console.log("Bob withdrawing from stream");
  await bobConnectedStreamManager.withdrawFromStream(1, oneEther, bobAddress);

  await erc20.balanceOf(bobAddress).then((balance: BigNumber) => {
    console.log("Bobs erc20 balance is " + balance.toString());
  });

  console.log("Bob claiming from stream");
  await bobConnectedStreamManager.claimFromStream(1, oneEther);

  await treasury
    .viewAvailableBalance(erc20.address, bobAddress)
    .then((balance: BigNumber) => {
      console.log("Bob deposited balance is " + balance.toString());
    });
}

async function deployMockErc() {
  console.log("Deploying Mock Erc Contract");
  const mockErc20Factory = new MockErc20Factory(alice);
  const mockErc20 = await mockErc20Factory.deploy("", "");
  await mockErc20.deployed();
  console.log("Deployed Mock Erc at " + mockErc20.address);

  return mockErc20;
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
