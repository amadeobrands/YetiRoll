import {BigNumber, providers} from "ethers";

import {MockErc20Factory, MultipleRecipientStreamFactory} from "../typechain";
import {MockErc20} from "../typechain/MockErc20";
import {MultipleRecipientStream} from "../typechain/MultipleRecipientStream";
import {oneHour} from "../test/helpers/numbers";

const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
const alice = provider.getSigner(0);
const bob = provider.getSigner(1);
const charlie = provider.getSigner(2);
const dennis = provider.getSigner(3);
const ethan = provider.getSigner(4);
const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

async function main() {
  console.log("Starting...");
  const multipleRecipientStream = await deployMultipleRecipientStream();
  const token = await deployErc20Token();

  const balance = BigNumber.from(10000).mul(oneEther);

  await mintAndApproveBalance(token, balance, multipleRecipientStream);

  // Predicable date should make testing easier
  const now = Math.ceil(new Date().getTime() / 1000);
  await provider.send("evm_setNextBlockTimestamp", [now + 10]);

  const aliceAddress = await alice.getAddress();
  const bobAddress = await bob.getAddress();
  const charlieAddress = await charlie.getAddress();
  const dennisAddress = await dennis.getAddress();
  const ethanAddress = await ethan.getAddress();

  await multipleRecipientStream.createStream(
    aliceAddress,
    Array.of(bobAddress, charlieAddress, dennisAddress, ethanAddress),
    oneEther.mul(100),
    token.address,
    now + oneHour,
    now + oneHour * 2
  );
}

async function deployMultipleRecipientStream() {
  console.log("Deploying Multiple Recipient Stream Contract");
  const multipleRecipientStreamFactory = new MultipleRecipientStreamFactory(
    alice
  );
  const multipleRecipientStream = await multipleRecipientStreamFactory.deploy();
  await multipleRecipientStream.deployed();
  console.log(
    "Deployed Multiple Recipient Stream at " + multipleRecipientStream.address
  );

  return multipleRecipientStream;
}

async function deployErc20Token() {
  console.log("Deploying Erc20 Token");
  const erc20Factory = new MockErc20Factory(alice);
  const erc20 = await erc20Factory.deploy("MOCK", "MCK");
  await erc20.deployed();
  console.log("Deployed Erc20 Token at " + erc20.address);

  return erc20;
}

async function mintAndApproveBalance(
  erc20: MockErc20,
  balance: BigNumber,
  streamManager: MultipleRecipientStream
) {
  console.log("Minting and approving Erc20 balance");

  const aliceConnectedErc20 = await erc20.connect(alice);

  await alice.getAddress().then(async (aliceAddress) => {
    console.log("Minting balance");
    await aliceConnectedErc20.mint(aliceAddress, balance);

    console.log("Approving allowance");
    await aliceConnectedErc20.approve(streamManager.address, balance);

    await erc20
      .balanceOf(aliceAddress)
      .then((balance) =>
        console.log("Balance of Alice: " + balance.toString())
      );
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
