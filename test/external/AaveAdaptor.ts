import chai, {expect} from "chai";
import {deployErc20, getBlockTime, getProvider} from "../helpers/contract";

import {
  deployContract,
  deployMockContract,
  MockContract,
} from "ethereum-waffle";

import AaveAdaptorArtifact from "../../artifacts/AaveAdaptor.json";
import {AaveAdaptor} from "../../typechain/AaveAdaptor";
import {oneEther} from "../helpers/numbers";
import {MockErc20} from "../../typechain/MockErc20";

import AAVE_ABI from "../../integration/ABI/Aave.json";
import A_TOKEN_ABI from "../../integration/ABI/AToken.json";
import USDC_ABI from "../../integration/ABI/AUSDC.json";
import {Contract} from "ethers";

const [alice, bob] = getProvider().getWallets();

// These are surface level tests with check the interactions on a unitary level but cannot
// sufficiently be used to check true interaction. Intergration tests will cover this.
describe("Aave Adaptor", () => {
  let aave: MockContract;
  let aToken: MockContract;
  let USDC: MockContract;
  let aaveAdaptor: AaveAdaptor;

  before(async () => {
    aave = await deployMockContract(alice, AAVE_ABI);
    aToken = await deployMockContract(alice, A_TOKEN_ABI);
    USDC = await deployMockContract(alice, USDC_ABI);

    aaveAdaptor = (await deployContract(
      alice,
      AaveAdaptorArtifact
    )) as AaveAdaptor;

    await aaveAdaptor.setAave(aave.address);
  });

  describe("Depositing and withdrawing", () => {
    it("Should allow funds to be deposited into Aave lending platform and send the A token to the return address", async () => {
      const amount = oneEther.mul(200);

      await USDC.mock.approve.withArgs(aave.address, amount).returns(true);

      await aave.mock.deposit.withArgs(USDC.address, amount, 0).returns();

      await aToken.mock.balanceOf.withArgs(aaveAdaptor.address).returns(amount);

      await aToken.mock.transfer.withArgs(alice.address, amount).returns(true);

      await aaveAdaptor.setATokenPair(USDC.address, aToken.address);

      await expect(aaveAdaptor.deposit(USDC.address, amount))
        .to.emit(aaveAdaptor, "AssetDeposited")
        .withArgs(USDC.address, alice.address, amount, await getBlockTime());
    });
  });

  it("Should allow redemption of A tokens for the underlying asset", async () => {
    const amount = oneEther.mul(200);

    await aToken.mock.redeem.withArgs(amount).returns();

    await USDC.mock.transfer.withArgs(alice.address, amount).returns(true);

    await USDC.mock.balanceOf.withArgs(aaveAdaptor.address).returns(amount);

    await aaveAdaptor.setATokenPair(USDC.address, aToken.address);

    await expect(aaveAdaptor.withdraw(USDC.address, amount))
      .to.emit(aaveAdaptor, "AssetWithdrawn")
      .withArgs(USDC.address, alice.address, amount, await getBlockTime());
  });

  describe("Access control", () => {
    let bobConnectedAaveAdaptor: Contract;

    beforeEach(async () => {
      bobConnectedAaveAdaptor = aaveAdaptor.connect(bob);
    });

    it("Should only allow the owner to set Aave ", async () => {
      const bobConnectedAaveAdaptor = aaveAdaptor.connect(bob);
      await expect(
        bobConnectedAaveAdaptor.setAave(aave.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should only allow the owner to set an Aave token pair ", async () => {
      await expect(
        bobConnectedAaveAdaptor.setATokenPair(USDC.address, aToken.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
