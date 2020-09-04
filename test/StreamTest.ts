import chai from "chai";

import {deployContract} from "ethereum-waffle";

import StreamArtifact from "../artifacts/Stream.json";
import {Stream} from "../typechain/Stream";
import MockERC20Artifact from "../artifacts/MockERC20.json";
import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {getProvider} from "./helpers/contract";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

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

    blockId = await getProvider().getBlockNumber();
  });

  it("Should allow creation of a stream", async () => {
    const {timestamp} = await getProvider().getBlock(blockId);
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
