import {FundManager} from "../typechain/FundManager";
import {Treasury} from "../typechain/Treasury";
import {MockErc20} from "../typechain/MockErc20";

import TreasuryArtifact from "../artifacts/Treasury.json";

import {oneEther} from "./helpers/numbers";
import {deployErc20, deployFundManager, getProvider} from "./helpers/contract";
import {deployMockContract, MockContract} from "ethereum-waffle";

const [alice, bob] = getProvider().getWallets();

describe("Fund Manager", () => {
  let treasury: Treasury | MockContract;
  let fundManager: FundManager;
  let token: MockErc20;

  beforeEach(async () => {
    token = await deployErc20(alice);
    treasury = await deployMockContract(alice, TreasuryArtifact.abi);
    fundManager = await deployFundManager(alice);

    await fundManager.setTreasury(treasury.address);
  });

  it("Should allow withdrawal of funds to an address", async () => {
    const amount = oneEther.mul(100);

    await treasury.mock.withdraw
      .withArgs(token.address, alice.address, bob.address, amount)
      .returns();

    await fundManager.withdrawTokensToAccount(
      token.address,
      bob.address,
      amount
    );
  });
});
