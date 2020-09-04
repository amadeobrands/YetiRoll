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
const [alice, bob, charlie] = provider.getWallets();

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

  xit("Should create a pausable stream", async () => {
    // 0.01 dai per second
    let ratePerSecond = BigNumber.from(1).mul(oneEther).div(100);

    await expect(createStream(deposit, token, startTime))
      .to.emit(pausableStream, "PausableStreamCreated")
      .withArgs(1, startTime, deposit, oneHour, ratePerSecond, true);

    // todo get the id from stream creation
    const stream = await pausableStream.getPausableStream(1);

    expect(stream.duration).to.eq(oneHour);
    expect(stream.durationElapsed).to.eq(0);
    expect(stream.durationRemaining).to.eq(oneHour);
  });

  xit("Should allow a stream to be started and paused", async () => {
    await createStream(deposit, token, timestamp + 1);

    let stream = await pausableStream.getPausableStream(1);

    expect(stream.isActive).to.eq(true);

    await pausableStream.pauseStream(1);

    stream = await pausableStream.getPausableStream(1);

    expect(stream.isActive).to.eq(false);
  });

  xit("Should calculate an accurate amount of money paid from a running stream over 30 minutes", async () => {
    await createStream(deposit, token, timestamp + 1);

    await pausableStream
      .getPausableStream(1)
      .then((stream) => expect(stream.balanceAccrued).to.eq(0));

    await pausableStream
      .getStream(1)
      .then((stream) => expect(stream.deposit).to.eq(oneEther.mul(36)));

    await wait(1800, provider);

    let stream = await pausableStream.getPausableStream(1);

    expect(stream.duration).to.eq(
      stream.durationElapsed.add(stream.durationRemaining)
    );

    expect(stream.durationElapsed).to.eq(1800);
    expect(stream.durationRemaining).to.eq(1800);

    expect(stream.balanceAccrued).to.eq(BigNumber.from(18).mul(oneEther));
  });

  it("Should disallow calling of the withdraw function unless called by the stream manager", async () => {
    await createStream(deposit, token, timestamp + 1);

    await pausableStream.withdraw(1, 800);
  });

  // it("Should not allow withdrawal unless balance has accrued", async () => {
  //   await createStream(deposit, token, timestamp + 1);
  //
  //   await pausableStream
  //     .getPausableStream(1)
  //     .then((stream) => expect(stream.balanceAccrued).to.eq(0));
  //
  //   await pausableStream
  //     .getStream(1)
  //     .then((stream) => expect(stream.deposit).to.eq(oneEther.mul(36)));
  //
  //   await wait(901, provider);
  //
  //   let stream = await pausableStream.getPausableStream(1);
  //
  //   expect(stream.duration).to.eq(
  //     stream.durationElapsed.add(stream.durationRemaining)
  //   );
  //
  //   expect(stream.durationElapsed).to.eq(900);
  //   expect(stream.durationRemaining).to.eq(2700);
  //
  //   expect(stream.balanceAccrued).to.eq(BigNumber.from(9).mul(oneEther));
  // });

  function createStream(
    deposit: BigNumber,
    token: MockErc20,
    startTime: number
  ) {
    return pausableStream.createStream(
      bob.address,
      deposit.toString(),
      token.address,
      oneHour,
      startTime
    );
  }
});
