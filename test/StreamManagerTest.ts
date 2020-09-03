import chai from "chai";

import {deployContract, MockProvider} from "ethereum-waffle";

import StreamManagerArtifact from "../artifacts/StreamManager.json";
import {StreamManager} from "../typechain/StreamManager";
import {PausableStream} from "../typechain/PausableStream";

import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20} from "./helpers/contract";

const {expect} = chai;

const provider = new MockProvider();
const [alice, bob] = provider.getWallets();

describe("The stream manager", () => {
  let streamManager: StreamManager;
  let token: MockErc20;
  let blockId: number;
  let timestamp: number;
  let startTime: number;

  let deposit = BigNumber.from(36).mul(oneEther);

  beforeEach(async () => {
    token = await deployErc20(alice);

    timestamp = await provider
      .getBlock(blockId)
      .then((block) => block.timestamp);

    streamManager = (await deployContract(
      alice,
      StreamManagerArtifact
    )) as StreamManager;

    await token.mint(alice.address, 10000000);
    await token.approve(streamManager.address, 10000000);

    startTime = timestamp + 100;
  });

  it("Should allow creation of streams through its interface", async () => {
    let deposit = 10000;
    let startTime = timestamp + 100;

    await streamManager.createPausableStream(
      bob.address,
      deposit.toString(),
      token.address,
      oneHour,
      startTime
    );

    await streamManager
      .getPausableStream(1)
      .then((stream: PausableStream) => expect(stream.deposit).to.eq(10000));

    await token
      .balanceOf(alice.address)
      .then((balance) => expect(balance).to.eq(9990000));

    await token
      .balanceOf(streamManager.address)
      .then((balance) => expect(balance).to.eq(10000));
  });
});
