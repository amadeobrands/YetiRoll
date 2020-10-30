import chai, {expect} from "chai";
import {deployErc20, getProvider} from "../helpers/contract";

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
import {Contract} from "ethers";

const [alice, bob] = getProvider().getWallets();

// These are surface level tests with check the interactions on a unitary level but cannot
// sufficiently be used to check true interaction. Intergration tests will cover this.
describe("Aave Adaptor", () => {
  let aave: MockContract;
  let aToken: MockContract;
  let aaveAdaptor: AaveAdaptor;
  let USDT: MockErc20;
  let DAI: MockErc20;

  before(async () => {
    aave = await deployMockContract(alice, AAVE_ABI);
    aToken = await deployMockContract(alice, A_TOKEN_ABI);

    aaveAdaptor = (await deployContract(
      alice,
      AaveAdaptorArtifact
    )) as AaveAdaptor;

    USDT = await deployErc20(alice);
    DAI = await deployErc20(alice);

    await USDT.mint(alice.address, oneEther.mul(99999999));
    await DAI.mint(aaveAdaptor.address, oneEther.mul(99999999));

    await aaveAdaptor.setAave(aave.address);
  });

  describe("Depositing and withdrawing", () => {
    it("Should allow funds to be deposited into Aave lending platform and send the A token to the return address", async () => {
      const amount = oneEther.mul(200);

      await aave.mock.deposit.withArgs(USDT.address, amount, 0).returns();

      await aToken.mock.balanceOf.withArgs(aaveAdaptor.address).returns(amount);

      await aToken.mock.transfer.withArgs(alice.address, amount).returns(0);

      await aaveAdaptor.setATokenPair(USDT.address, aToken.address);

      await expect(aaveAdaptor.deposit(USDT.address, amount))
        .to.emit(aaveAdaptor, "AssetDeposited")
        .withArgs(USDT.address, alice.address, amount);
    });
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
        bobConnectedAaveAdaptor.setATokenPair(USDT.address, aToken.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
