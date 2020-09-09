import {BigNumber, providers} from "ethers";

import {MockErc20Factory, StreamManagerFactory} from "./typechain";
import {MockErc20} from "./typechain/MockErc20";
import {StreamManager} from "./typechain/StreamManager";
import {getBlockTime} from "./test/helpers/contract";

const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
const alice = provider.getSigner(0);
const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

async function main() {
  console.log("Starting...");
  const streamManager = await deployStreamManager();
  const erc20 = await deployErc20Token();

  const balance = BigNumber.from(10000).mul(oneEther);

  await mintAndApproveBalance(erc20, balance, streamManager);

  // Predicable date should make testing easier
  const now = Math.ceil(new Date().getTime() / 1000);
  await provider.send("evm_setNextBlockTimestamp", [now + 10]);
}

async function deployStreamManager() {
  console.log("Deploying Stream Manager");
  const streamManagerFactory = new StreamManagerFactory(alice);
  const streamManager = await streamManagerFactory.deploy();
  await streamManager.deployed();
  console.log("Deployed Stream Manager at " + streamManager.address);

  return streamManager;
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
  streamManager: StreamManager
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
