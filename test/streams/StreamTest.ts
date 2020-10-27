import chai from "chai";
import {Stream} from "../../typechain/Stream";
import {MockErc20} from "../../typechain/MockErc20";
import {BigNumber, Contract} from "ethers";
import {
  deployErc20,
  deployStream,
  getBlockTime,
  getProvider,
  wait,
} from "../helpers/contract";
import {id, keccak256} from "ethers/lib/utils";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Payment Stream", () => {
  const oneEther = BigNumber.from(10).pow(18);

  let paymentStream: Stream;
  let token: MockErc20;
  let timestamp: number;

  beforeEach(async () => {
    token = await deployErc20(alice);

    paymentStream = await deployStream(alice);

    await token.mint(alice.address, 10000000);
    await token.approve(paymentStream.address, 10000000);

    timestamp = (await getBlockTime()) + 10;
  });

  describe("Stream creation", async () => {
    beforeEach(async () => {
      await paymentStream.setStreamOperator(alice.address);
    });

    it("Should allow creation of a stream", async () => {
      await paymentStream.createStream(
        alice.address,
        bob.address,
        oneEther,
        token.address,
        timestamp,
        timestamp + 100
      );

      const stream = await paymentStream.getStream(1);

      expect(stream.recipient).to.eq(bob.address);
      expect(stream.deposit).to.eq(oneEther);
      expect(stream.tokenAddress).to.eq(token.address);
      expect(stream.startTime).to.eq(timestamp);
      expect(stream.stopTime).to.eq(timestamp + 100);
    });

    it("Should prevent creation of a stream with a start time in the past", async () => {
      await expect(
        paymentStream.createStream(
          alice.address,
          bob.address,
          oneEther,
          token.address,
          100,
          200
        )
      ).to.be.revertedWith("Cannot start a stream in the past");
    });

    it("Should prevent creation of a stream with a rate per second of less than 1 wei", async () => {
      await expect(
        paymentStream.createStream(
          alice.address,
          bob.address,
          1800,
          token.address,
          timestamp,
          timestamp + 3601
        )
      ).to.be.revertedWith("Rate per second must be above 0");
    });

    it("Should prevent creation of a stream an end date before the start date", async () => {
      await expect(
        paymentStream.createStream(
          alice.address,
          bob.address,
          1800,
          token.address,
          timestamp + 3600,
          timestamp
        )
      ).to.be.revertedWith("SafeMath: subtraction overflow");
    });

    it("Should prevent creation of a stream where start and end date are the same time", async () => {
      await expect(
        paymentStream.createStream(
          alice.address,
          bob.address,
          1800,
          token.address,
          timestamp,
          timestamp
        )
      ).to.be.revertedWith("Stream must last a least a second");
    });
  });

  describe("Balance accruing", async () => {
    beforeEach(async () => {
      await paymentStream.setStreamOperator(alice.address);
    });

    it("Should accrue a funds over time", async () => {
      await paymentStream.createStream(
        alice.address,
        bob.address,
        oneEther.mul(36),
        token.address,
        timestamp,
        timestamp + 3600
      );

      await wait(1800);

      await paymentStream.getStream(1).then((stream) => {
        expect(stream.startTime).to.be.eq(timestamp);
        expect(
          stream.balanceAccrued.div(oneEther).toNumber()
        ).to.be.approximately(18, 1);
      });
    });
  });

  describe("Access control", async () => {
    let bobConnectedStream: Stream;

    beforeEach(async () => {
      bobConnectedStream = await paymentStream.connect(bob);
    });

    it("Should allow stream admins to set a stream operator", async () => {
      await paymentStream.setStreamOperator(bob.address);

      await paymentStream.callStatic
        .hasRole(id("STREAM_OPERATOR"), bob.address)
        .then((hasRole) => expect(hasRole).to.be.true);
    });

    it("Should prevent non stream admins from setting a stream operator", async () => {
      await expect(
        bobConnectedStream.setStreamOperator(bob.address)
      ).to.be.revertedWith("Not Stream Admin");
    });

    it("Should prevent creation of streams by non stream operators", async () => {
      await expect(
        bobConnectedStream.createStream(
          alice.address,
          bob.address,
          1800,
          token.address,
          timestamp,
          timestamp
        )
      ).to.be.revertedWith("Not Stream Operator");
    });
  });
});
