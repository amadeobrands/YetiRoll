import chai from "chai";
import {deployErc20, getProvider} from "./helpers/contract";

import {deployContract, deployMockContract, MockContract,} from "ethereum-waffle";

import TreasuryArtifact from "../artifacts/Treasury.json";
import StreamManagerArtifact from "../artifacts/StreamManager.json";
import {StreamManager} from "../typechain/StreamManager";

import {oneEther} from "./helpers/numbers";
import {MockErc20} from "../typechain/MockErc20";

const {expect} = chai;

const [alice, bob, charlie, dennis, ethan] = getProvider().getWallets();

describe("Stream Manager", () => {
  let streamManager: StreamManager;
  let treasury: MockContract;
  let USDT: MockErc20;
  let DAI: MockErc20;

  before(async () => {
    treasury = await deployMockContract(
      alice,
      TreasuryArtifact.abi
    );
  });

  beforeEach(async () => {
    streamManager = (await deployContract(alice, StreamManagerArtifact)) as StreamManager;

    USDT = await deployErc20(alice);
    DAI = await deployErc20(alice);

    await DAI.mint(alice.address, oneEther.mul(1000));
    await USDT.mint(alice.address, oneEther.mul(1000));

    await DAI.approve(treasury.address, oneEther.mul(1000));
    await USDT.approve(treasury.address, oneEther.mul(1000));
  });

  describe("Stream creation", async () => {
      it("Should allow creation of a stream if there is enough balance available", async () => {
      });
    });
});