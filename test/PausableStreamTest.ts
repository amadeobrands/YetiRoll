import chai from "chai";

import {deployContract, MockProvider} from "ethereum-waffle";

import PausableStreamArtifact from "../artifacts/PausableStream.json";
import {PausableStream} from "../typechain/PausableStream";

import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20, wait} from "./helpers/contract";

const {expect} = chai;

const provider = new MockProvider();
const [alice, bob] = provider.getWallets();

describe("Pausable Stream", () => {
  let pausableStream: PausableStream;
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

    pausableStream = (await deployContract(
      alice,
      PausableStreamArtifact
    )) as PausableStream;

    await token.mint(alice.address, 10000000);
    await token.approve(pausableStream.address, 10000000);

    startTime = timestamp + 100;
  });

  it("Should create a pausable stream", async () => {
    // 0.01 dai per second
    let ratePerSecond = BigNumber.from(1).mul(oneEther).div(100);

    await expect(createPausableStream(deposit, token, startTime))
      .to.emit(pausableStream, "PausableStreamCreated")
      .withArgs(1, startTime, deposit, oneHour, ratePerSecond, true);

    // todo get the id from stream creation
    const stream = await pausableStream.getPausableStream(1);

    expect(stream.duration).to.eq(oneHour);
    expect(stream.durationElapsed).to.eq(0);
    expect(stream.durationRemaining).to.eq(oneHour);
  });

  it("Should allow a stream to be started and paused", async () => {
    await createPausableStream(deposit, token, timestamp + 1);

    let stream = await pausableStream.getPausableStream(1);

    expect(stream.isActive).to.eq(true);

    await pausableStream.pauseStream(1);

    stream = await pausableStream.getPausableStream(1);

    expect(stream.isActive).to.eq(false);
  });

  it("Should calculate an accurate amount of money paid from a running stream over 30 minutes", async () => {
    await createPausableStream(deposit, token, timestamp + 1);

    await wait(1801, provider);
    let pausedStream = await pausableStream.getPausableStream(1);

    expect(pausedStream.duration).to.eq(
      pausedStream.durationElapsed.add(pausedStream.durationRemaining)
    );

    expect(pausedStream.balanceAccrued).to.eq(BigNumber.from(18).mul(oneEther));
  });

  function createPausableStream(
    deposit: BigNumber,
    token: MockErc20,
    startTime: number
  ) {
    return pausableStream.createPausableStream(
      bob.address,
      deposit.toString(),
      token.address,
      oneHour,
      startTime
    );
  }
});
