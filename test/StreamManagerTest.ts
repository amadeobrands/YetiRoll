import chai from "chai";

import {deployContract} from "ethereum-waffle";

import StreamManagerArtifact from "../artifacts/StreamManager.json";
import {StreamManager} from "../typechain/StreamManager";

import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20, getProvider, wait} from "./helpers/contract";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("The stream manager", () => {
  let streamManager: StreamManager;
  let token: MockErc20;
  let blockId: number;
  let timestamp: number;
  let startTime: number;

  let deposit = BigNumber.from(36).mul(oneEther);

  beforeEach(async () => {
    token = await deployErc20(alice);

    timestamp = await getProvider()
      .getBlock(blockId)
      .then((block) => block.timestamp);

    streamManager = (await deployContract(
      alice,
      StreamManagerArtifact
    )) as StreamManager;

    await token.mint(alice.address, deposit);
    await token.approve(streamManager.address, oneEther.mul(9999));

    startTime = timestamp + 100;
  });

  it("Should allow creation of streams through its interface", async () => {
    let startTime = timestamp + 100;

    await streamManager.createPausableStream(
      bob.address,
      oneEther,
      token.address,
      oneHour,
      startTime
    );

    const stream = await streamManager.getPausableStream(1);

    expect(stream.deposit).to.eq(oneEther);

    await token
      .balanceOf(alice.address)
      .then((balance) => expect(balance).to.eq(oneEther.mul(35)));

    await token
      .balanceOf(streamManager.address)
      .then((balance) => expect(balance).to.eq(oneEther));
  });

  it("Should allow withdrawal of funds after balance has accrued", async () => {
    await streamManager.createPausableStream(
      bob.address,
      oneEther.mul(36),
      token.address,
      oneHour,
      timestamp + 1
    );

    // Check balance matches deposit and no funds have been paid out
    let stream = await streamManager.getPausableStream(1);
    expect(stream.balanceAccrued).to.eq(0);
    expect(stream.deposit).to.eq(oneEther.mul(36));

    // Set the clock forward 30 minutes
    await wait(1800);

    // Should see 18 Dai have been paid out (Out of 36 deposit)
    stream = await streamManager.getPausableStream(1);
    expect(stream.balanceAccrued).to.eq(oneEther.mul(18));

    // 1 should represent PausableStream
    // Withdraw funds from stream
    await streamManager.withdrawFromStream(1, oneEther.mul(9), bob.address, 1);

    await token
      .balanceOf(streamManager.address)
      .then((balance) => expect(balance).to.eq(oneEther.mul(27)));

    await token
      .balanceOf(bob.address)
      .then((balance) => expect(balance).to.eq(oneEther.mul(9)));
  });
});
