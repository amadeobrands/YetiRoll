import chai from "chai";
import {PausableStream} from "../typechain/PausableStream";

import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20, deployPausableStream, getBlockTime, getProvider, wait} from "./helpers/contract";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Pausable Stream", () => {
  let pausableStream: PausableStream;
  let token: MockErc20;
  let timestamp: number;

  let deposit = BigNumber.from(36).mul(oneEther);

  beforeEach(async () => {
    token = await deployErc20(alice);

    pausableStream = await deployPausableStream(alice);

    await token.mint(alice.address, 10000000);
    await token.approve(pausableStream.address, 10000000);

    timestamp = (await getBlockTime()) + 1;
  });

  describe("Start and stop assertions", () => {
    it("Should create a pausable stream", async () => {
      // 0.01 dai per second
      let ratePerSecond = oneEther.div(100);

      await expect(createStream(deposit, token, timestamp))
        .to.emit(pausableStream, "PausableStreamCreated")
        .withArgs(1, timestamp, deposit, oneHour, ratePerSecond, true);

      // todo get the id from stream creation
      const stream = await pausableStream.getPausableStream(1);

      expect(stream.duration).to.eq(oneHour);
      expect(stream.durationElapsed).to.eq(0);
      expect(stream.durationRemaining).to.eq(oneHour);
    });

    it("Should not allow you to start a stream if it is running", async () => {
      await createStream(deposit, token, timestamp);

      await expect(pausableStream.startStream(1)).to.be.reverted;
    });

    it("Should not allow you to pause a stream if it has been paused", async () => {
      await createStream(deposit, token, timestamp);
      await pausableStream.pauseStream(1);
      await expect(pausableStream.pauseStream(1)).to.be.reverted;
    });

    it("Should allow a running stream to be started and paused", async () => {
      await createStream(deposit, token, timestamp);

      await wait(1800);
      let stream = await pausableStream.getPausableStream(1);

      expect(stream.isRunning).to.eq(true);

      await pausableStream.pauseStream(1);

      stream = await pausableStream.getPausableStream(1);

      expect(stream.isRunning).to.eq(false);
      expect(stream.startTime.toNumber()).to.be.eq(0);
    });

    it("Should set the correct start and stop times to a paused stream which is restarted", async () => {
      await createStream(deposit, token, timestamp);
      await pausableStream.pauseStream(1);
      await pausableStream.startStream(1);

      let stream = await pausableStream.getPausableStream(1);

      expect(stream.isRunning).to.eq(true);

      // todo maybe we can check what the actual start time should be
      expect(stream.startTime.toNumber()).to.not.be.eq(0);
    });
  });

  describe("Balance accruing", () => {
    it("Should calculate an accurate amount of money paid from a running stream over 30 minutes", async () => {
      await createStream(deposit, token, timestamp);

      await pausableStream
        .getPausableStream(1)
        .then((stream) => expect(stream.balanceAccrued).to.eq(0));

      await pausableStream
        .getStream(1)
        .then((stream) => expect(stream.deposit).to.eq(oneEther.mul(36)));

      // +1 to offset the later timestamp
      await wait(1801);

      let stream = await pausableStream.getPausableStream(1);

      expect(stream.duration).to.eq(
        stream.durationElapsed.add(stream.durationRemaining)
      );

      // Not great assumptions - todo look at how to fix blocktime
      expect(stream.durationElapsed.toNumber()).to.be.approximately(1800, 1);
      expect(stream.durationRemaining.toNumber()).to.be.approximately(1800, 1);

      expect(
        stream.balanceAccrued.div(oneEther).toNumber()
      ).to.be.approximately(18, 1);
    });

    it("Should disallow calling of the withdraw function unless called by the stream manager", async () => {
      await createStream(deposit, token, timestamp);

      const bobStream = await pausableStream.connect(bob);

      // todo have a message
      await expect(bobStream.withdraw(1, 800, bob.address)).to.be.reverted;
    });

    it("Should not allow withdrawal unless balance has accrued", async () => {
      await createStream(deposit, token, timestamp);

      // todo have a message
      await expect(pausableStream.withdraw(1, 800, bob.address)).to.be.reverted;
    });
  });

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
