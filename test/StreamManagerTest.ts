import chai from "chai";
import {deployErc20, getBlockTime, getProvider} from "./helpers/contract";

import {
  deployContract,
  deployMockContract,
  MockContract,
} from "ethereum-waffle";

import TreasuryArtifact from "../artifacts/Treasury.json";
import StreamArtifact from "../artifacts/Stream.json";
import StreamManagerArtifact from "../artifacts/StreamManager.json";
import {StreamManager} from "../typechain/StreamManager";

import {oneEther, oneHour} from "./helpers/numbers";
import {MockErc20} from "../typechain/MockErc20";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Stream Manager", () => {
  let streamManager: StreamManager;
  let treasury: MockContract;
  let stream: MockContract;
  let USDT: MockErc20;
  let DAI: MockErc20;
  let timestamp: number;

  beforeEach(async () => {
    timestamp = (await getBlockTime()) + 10;

    treasury = await deployMockContract(alice, TreasuryArtifact.abi);
    stream = await deployMockContract(alice, StreamArtifact.abi);

    streamManager = (await deployContract(
      alice,
      StreamManagerArtifact
    )) as StreamManager;
    await streamManager.setTreasury(treasury.address);
    await streamManager.setStream(stream.address);

    DAI = await deployErc20(alice);
    USDT = await deployErc20(alice);

    await USDT.mint(alice.address, oneEther.mul(1000));
    await DAI.mint(alice.address, oneEther.mul(1000));

    await USDT.approve(treasury.address, oneEther.mul(1000));
    await DAI.approve(treasury.address, oneEther.mul(1000));
  });

  describe("Stream creation", async () => {
    it("Should revert if there is not enough available balance", async () => {
      await treasury.mock.viewAvailableBalance.returns(oneEther.mul(200));

      await expect(
        streamManager.startStream(
          DAI.address,
          bob.address,
          oneEther.mul(300),
          timestamp,
          timestamp + oneHour
        )
      ).to.be.revertedWith("Not enough balance to start stream");
    });

    it("Should allocate funds and start a stream", async () => {
      const amount = oneEther.mul(200);
      await treasury.mock.viewAvailableBalance.returns(amount);

      await treasury.mock.allocateFunds
        .withArgs(DAI.address, alice.address, amount)
        .returns();

      await stream.mock.createStream
        .withArgs(
          bob.address,
          amount,
          DAI.address,
          timestamp,
          timestamp + oneHour
        )
        .returns(1);

      await streamManager.startStream(
        DAI.address,
        bob.address,
        amount,
        timestamp,
        timestamp + oneHour
      );
    });

    it("Should allow withdrawal of funds from a stream", async () => {
      const amount = oneEther.mul(200);
      await treasury.mock.viewAvailableBalance.returns(amount);

      await treasury.mock.allocateFunds
        .withArgs(DAI.address, alice.address, amount)
        .returns();

      await stream.mock.createStream
        .withArgs(
          bob.address,
          amount,
          DAI.address,
          timestamp,
          timestamp + oneHour
        )
        .returns(1);

      await streamManager.startStream(
        DAI.address,
        bob.address,
        amount,
        timestamp,
        timestamp + oneHour
      );

      await stream.mock.withdraw
        .withArgs(1, oneEther.mul(100), alice.address)
        .returns();

      await stream.mock.getStream
        .withArgs(1)
        .returns(
          alice.address,
          bob.address,
          oneEther.mul(100),
          DAI.address,
          timestamp,
          timestamp + oneHour,
          oneEther.mul(100),
          oneEther.mul(1),
          oneEther.mul(50)
        );

      await treasury.mock.transferFunds
        .withArgs(DAI.address, alice.address, bob.address, oneEther.mul(100))
        .returns();

      await streamManager.claimFromStream(1, oneEther.mul(100));
    });
  });
});
