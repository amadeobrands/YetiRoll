import chai from "chai";
import {StreamLender} from "../typechain";

import {getProvider} from "./helpers/contract";
import {Signer} from "ethers";
import {deployContract} from "ethereum-waffle";
import StreamLenderArtifact from "../artifacts/contracts/StreamLender.sol/StreamLender.json";
import {oneEther} from "./helpers/numbers";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Stream Lender", async () => {
  let streamLender: StreamLender;

  beforeEach(async () => {
    streamLender = await deployStreamLender(alice);
  });

  describe("Stream Borrowing", async () => {
    it("Should allow a stream to be used as collateral for a loan", async () => {
      await streamLender.borrowAgainstStream(1, oneEther.mul(200));
    });
  });
});

export async function deployStreamLender(signer: Signer) {
  return (await deployContract(signer, StreamLenderArtifact)) as StreamLender;
}
