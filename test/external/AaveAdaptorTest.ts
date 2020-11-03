import chai from "chai";

import {deployMockContract, MockContract, solidity} from "ethereum-waffle";
import {AaveAdaptor} from "../../typechain";

import LENDING_POOL_ABI from "../../integration/ABI/Aave/LendingPool.json";
import LENDING_POOL_CORE_ABI from "../../integration/ABI/Aave/LendingPoolCore.json";
import LENDING_POOL_ADDRESSES_PROVIDER_ABI from "../../integration/ABI/Aave/LendingPoolAddressesProvider.json";
import A_TOKEN_ABI from "../../integration/ABI/Aave/AToken.json";
import USDC_ABI from "../../integration/ABI/Erc20/AUSDC.json";

import {getAccounts} from "../helpers/contract";
import {ethers} from "hardhat";
import {oneEther} from "../helpers/numbers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

chai.use(solidity);
const {expect} = chai;

// These are surface level tests with check the interactions on a unitary level but cannot
// sufficiently be used to check true interaction. Integration tests will cover this.
describe("Aave Adaptor", async () => {
  let lendingPool: MockContract;
  let lendingPoolCore: MockContract;
  let lendingPoolAddressesProvider: MockContract;
  let aToken: MockContract;
  let USDC: MockContract;
  let aaveAdaptor: AaveAdaptor;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  before(async () => {
    [alice, bob] = await getAccounts();

    lendingPool = await deployMockContract(alice, LENDING_POOL_ABI);
    lendingPoolCore = await deployMockContract(alice, LENDING_POOL_CORE_ABI);
    lendingPoolAddressesProvider = await deployMockContract(alice, LENDING_POOL_ADDRESSES_PROVIDER_ABI);

    aToken = await deployMockContract(alice, A_TOKEN_ABI);
    USDC = await deployMockContract(alice, USDC_ABI);

    const AaveAdaptorFactory = await ethers.getContractFactory(
      "AaveAdaptor",
      alice
    );

    await lendingPoolAddressesProvider.mock.getLendingPool.returns(lendingPool.address);
    await lendingPoolAddressesProvider.mock.getLendingPoolCore.returns(lendingPoolCore.address);

    aaveAdaptor = (await AaveAdaptorFactory.deploy(lendingPoolAddressesProvider.address)) as AaveAdaptor;
  });

  describe("Depositing and withdrawing", async () => {
    it("Should allow funds to be deposited into Aave lending platform and send the A token to the return address", async () => {
      const amount = oneEther.mul(200);

      await USDC.mock.approve.withArgs(lendingPoolCore.address, amount).returns(true);

      await lendingPool.mock.deposit.withArgs(USDC.address, amount, 0).returns();

      await aToken.mock.balanceOf.withArgs(aaveAdaptor.address).returns(amount);

      await aToken.mock.transfer.withArgs(alice.address, amount).returns(true);

      await aaveAdaptor.setATokenPair(USDC.address, aToken.address);

      await expect(aaveAdaptor.deposit(USDC.address, amount))
        .to.emit(aaveAdaptor, "AssetDeposited")
        .withArgs(USDC.address, alice.address, amount, expect(1).to.be.eq(1)); // Hack to skip validation on timestamp
    });

    xit("Should allow redemption of A tokens for the underlying asset", async () => {
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
        bobConnectedAaveAdaptor.setLendingPoolAddressesProvider(lendingPool.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should only allow the owner to set an Aave token pair ", async () => {
      await expect(
        bobConnectedAaveAdaptor.setATokenPair(USDC.address, aToken.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
