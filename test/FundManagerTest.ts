import {FundManager, Treasury, MockErc20} from "../typechain";

import TreasuryArtifact from "../artifacts/contracts/Treasury.sol/Treasury.json";

import {oneEther} from "./helpers/numbers";
import {deployErc20, deployFundManager, getProvider} from "./helpers/contract";
import {deployMockContract, MockContract} from "ethereum-waffle";

const [alice, bob] = getProvider().getWallets();

describe("Fund Manager", () => {
  let treasury: Treasury | MockContract;
  let fundManager: FundManager;
  let dai: MockErc20;
  let usdt: MockErc20;

  beforeEach(async () => {
    dai = await deployErc20(alice);
    usdt = await deployErc20(alice);
    treasury = await deployMockContract(alice, TreasuryArtifact.abi);
    fundManager = await deployFundManager(alice);

    await fundManager.setTreasury(treasury.address);
  });

  it("Should allow withdrawal of funds to an address", async () => {
    const amount = oneEther.mul(100);

    await treasury.mock.withdraw
      .withArgs(dai.address, alice.address, bob.address, amount)
      .returns();

    await fundManager.withdrawTokensToAccount(dai.address, bob.address, amount);
  });

  it("Should allow swapping funds then withdrawing to an address", async () => {
    const amount = oneEther.mul(100);

    await treasury.mock.exchangeFunds
      .withArgs(
        dai.address,
        usdt.address,
        amount,
        amount,
        [],
        alice.address,
        bob.address
      )
      .returns();

    await fundManager.swapTokensAndWithdrawToAccount(
      dai.address,
      usdt.address,
      amount,
      amount,
      [],
      bob.address
    );
  });
});
