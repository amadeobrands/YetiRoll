import chai from "chai";

import {deployContract, MockProvider} from "ethereum-waffle";

import StreamArtifact from "../artifacts/Stream.json";
import {Stream} from "../typechain/Stream";
import MockERC20Artifact from "../artifacts/MockERC20.json";
import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";

const {expect} = chai;

const provider = new MockProvider();
const [alice, bob] = provider.getWallets();

describe("Payment Stream", () => {
  const oneHour = 3600;
  const oneEther = BigNumber.from(10).pow(18);

  let paymentStream: Stream;
  let token: MockErc20;
  let blockId: number;

  beforeEach(async () => {
    token = (await deployContract(alice, MockERC20Artifact, [
      "MOCK",
      "MOCK",
    ])) as MockErc20;
    paymentStream = (await deployContract(alice, StreamArtifact)) as Stream;

    blockId = await provider.getBlockNumber();
  });

  it("Should allow creation of a stream", async () => {
    const {timestamp} = await provider.getBlock(blockId);
    await token.mint(alice.address, 10000000);
    await token.approve(paymentStream.address, 10000000);

    let deposit = 10000;
    let startTime = timestamp + 100;
    let stopTime = timestamp + 1100;

    await paymentStream.createStream(
      bob.address,
      deposit,
      token.address,
      startTime,
      stopTime
    );

    // todo get the id from stream creation
    const stream = await paymentStream.getStream(1);

    expect(stream.recipient).to.eq(bob.address);
    expect(stream.deposit).to.eq(deposit);
    expect(stream.tokenAddress).to.eq(token.address);
    expect(stream.startTime).to.eq(startTime);
    expect(stream.stopTime).to.eq(stopTime);
  });
});
