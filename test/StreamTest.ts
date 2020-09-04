import chai from "chai";

import {deployContract} from "ethereum-waffle";

import StreamArtifact from "../artifacts/Stream.json";
import {Stream} from "../typechain/Stream";
import MockERC20Artifact from "../artifacts/MockERC20.json";
import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {getBlockTime, getProvider} from "./helpers/contract";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Payment Stream", () => {
  const oneHour = 3600;
  const oneEther = BigNumber.from(10).pow(18);

  let paymentStream: Stream;
  let token: MockErc20;
  let timestamp: number;

  beforeEach(async () => {
    token = (await deployContract(alice, MockERC20Artifact, [
      "MOCK",
      "MOCK",
    ])) as MockErc20;
    paymentStream = (await deployContract(alice, StreamArtifact)) as Stream;

    timestamp = (await getBlockTime()) + 1;
  });

  it("Should allow creation of a stream", async () => {
    await token.mint(alice.address, 10000000);
    await token.approve(paymentStream.address, 10000000);

    let deposit = 10000;

    await paymentStream.createStream(
      bob.address,
      deposit,
      token.address,
      timestamp,
      timestamp + 100
    );

    // todo get the id from stream creation
    const stream = await paymentStream.getStream(1);

    expect(stream.recipient).to.eq(bob.address);
    expect(stream.deposit).to.eq(deposit);
    expect(stream.tokenAddress).to.eq(token.address);
    expect(stream.startTime).to.eq(timestamp);
    expect(stream.stopTime).to.eq(timestamp + 100);
  });

  it("Prevent creation of a stream with a start time in the past", async () => {
    await expect(
      paymentStream.createStream(bob.address, oneEther, token.address, 100, 200)
    ).to.be.reverted;
  });
});
