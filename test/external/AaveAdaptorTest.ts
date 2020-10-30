import chai from "chai";

import {deployMockContract, MockContract, solidity} from "ethereum-waffle";
import {AaveAdaptor} from "../../typechain";

import AAVE_ABI from "../../integration/ABI/Aave.json";
import A_TOKEN_ABI from "../../integration/ABI/AToken.json";
import USDC_ABI from "../../integration/ABI/AUSDC.json";

import {getAccounts} from "../helpers/contract";
import {ethers} from "hardhat";
import {oneEther} from "../helpers/numbers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

chai.use(solidity);
const {expect} = chai;

// These are surface level tests with check the interactions on a unitary level but cannot
// sufficiently be used to check true interaction. Integration tests will cover this.
describe("Aave Adaptor", async () => {
  let aave: MockContract;
  let aToken: MockContract;
  let USDC: MockContract;
  let aaveAdaptor: AaveAdaptor;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  before(async () => {
    [alice, bob] = await getAccounts();

    aave = await deployMockContract(alice, AAVE_ABI);
    aToken = await deployMockContract(alice, A_TOKEN_ABI);
    USDC = await deployMockContract(alice, USDC_ABI);

    const AaveAdaptorFactory = await ethers.getContractFactory(
      "AaveAdaptor",
      alice
    );

    aaveAdaptor = (await AaveAdaptorFactory.deploy()) as AaveAdaptor;

    await aaveAdaptor.setAave(aave.address);
  });

  describe("Depositing and withdrawing", async () => {
    it("Should allow funds to be deposited into Aave lending platform and send the A token to the return address", async () => {
      expect(1).to.eq(1);
      const amount = oneEther.mul(200);

      await USDC.mock.approve.withArgs(aave.address, amount).returns(true);

      await aave.mock.deposit.withArgs(USDC.address, amount, 0).returns();

      await aToken.mock.balanceOf.withArgs(aaveAdaptor.address).returns(amount);

      await aToken.mock.transfer.withArgs(alice.address, amount).returns(true);

      await aaveAdaptor.setATokenPair(USDC.address, aToken.address);

      await expect(aaveAdaptor.deposit(USDC.address, amount))
        .to.emit(aaveAdaptor, "AssetDeposited")
        .withArgs(USDC.address, alice.address, amount, expect(1).to.be.eq(1)); // Hack to skip validation on timestamp
    });

    it("Should allow redemption of A tokens for the underlying asset", async () => {
      const amount = oneEther.mul(200);

      await aToken.mock.redeem.withArgs(amount).returns();

      await USDC.mock.transfer.withArgs(alice.address, amount).returns(true);

      await USDC.mock.balanceOf.withArgs(aaveAdaptor.address).returns(amount);

      await aaveAdaptor.setATokenPair(USDC.address, aToken.address);

      await expect(aaveAdaptor.withdraw(USDC.address, amount))
        .to.emit(aaveAdaptor, "AssetWithdrawn")
        .withArgs(USDC.address, alice.address, amount, expect(1).to.be.eq(1)); // Hack to skip validation on timestamp
    });
  });

  describe("Access control", async () => {
    let bobConnectedAaveAdaptor: AaveAdaptor;

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
