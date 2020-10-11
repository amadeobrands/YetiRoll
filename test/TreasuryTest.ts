import chai from "chai";
import {deployErc20, getProvider} from "./helpers/contract";

import {
  deployContract,
  deployMockContract,
  MockContract,
} from "ethereum-waffle";

import TreasuryArtifact from "../artifacts/Treasury.json";
import {Treasury} from "../typechain/Treasury";
import ExchangeAdaptorArtifact from "../artifacts/ExchangeAdaptor.json";

import {oneEther} from "./helpers/numbers";
import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";

const {expect} = chai;

const [alice, bob, charlie, dennis, ethan] = getProvider().getWallets();

describe("Treasury", () => {
  let exchangeAdaptor: MockContract;
  let treasury: Treasury;
  let USDT: MockErc20;
  let DAI: MockErc20;

  before(async () => {
    exchangeAdaptor = await deployMockContract(
      alice,
      ExchangeAdaptorArtifact.abi
    );
  });

  beforeEach(async () => {
    treasury = (await deployContract(alice, TreasuryArtifact)) as Treasury;
    await treasury.setExchangeAdaptor(exchangeAdaptor.address);

    USDT = await deployErc20(alice);
    DAI = await deployErc20(alice);

    await DAI.mint(alice.address, oneEther.mul(1000));
    await USDT.mint(alice.address, oneEther.mul(1000));

    await DAI.approve(treasury.address, oneEther.mul(1000));
    await USDT.approve(treasury.address, oneEther.mul(1000));
  });

  describe("Deposit functionality", async () => {
    it("Should allow deposits of a single asset", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await treasury
        .viewUserTokenBalance(USDT.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(200));
          expect(balances.allocated).to.eq(oneEther.mul(0));
        });

      await validateErc20Balance(USDT, treasury.address, oneEther.mul(200));
    });

    it("Should allow multiple deposits of different assets", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));
      await treasury.deposit(DAI.address, alice.address, oneEther.mul(420));

      await treasury
        .viewUserTokenBalance(USDT.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(200));
        });

      await treasury
        .viewUserTokenBalance(DAI.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(420));
        });

      await validateErc20Balance(USDT, treasury.address, oneEther.mul(200));
      await validateErc20Balance(DAI, treasury.address, oneEther.mul(420));
    });

    it("Should allow multiple deposits of the same asset", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(420));

      await treasury
        .viewUserTokenBalance(USDT.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(620));
          expect(balances.allocated).to.eq(oneEther.mul(0));
        });

      await validateErc20Balance(USDT, treasury.address, oneEther.mul(620));
    });
  });

  describe("Withdrawal functionality", async () => {
    it("Should allow deposits and withdrawals from one account to another", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await treasury.withdraw(
        USDT.address,
        alice.address,
        bob.address,
        oneEther.mul(100)
      );

      await validateErc20Balance(USDT, alice.address, oneEther.mul(800));
      await validateErc20Balance(USDT, treasury.address, oneEther.mul(100));
      await validateErc20Balance(USDT, bob.address, oneEther.mul(100));

      await treasury
        .viewUserTokenBalance(USDT.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(100));
          expect(balances.allocated).to.eq(oneEther.mul(0));
        });
    });

    it("Should prevent withdrawals if there is not enough available balance", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await expect(
        treasury.withdraw(
          USDT.address,
          alice.address,
          bob.address,
          oneEther.mul(300)
        )
      ).to.be.revertedWith("Insufficient balance to withdraw");
    });

    it("Should allow withdrawal while converting the deposited token into another", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await exchangeAdaptor.mock.exchange
        .withArgs(
          USDT.address,
          DAI.address,
          oneEther.mul(100),
          oneEther.mul(90),
          [10],
          bob.address
        )
        .returns(true);

      await treasury.withdrawAs(
        USDT.address,
        DAI.address,
        oneEther.mul(100),
        oneEther.mul(90),
        [10],
        alice.address,
        bob.address
      );
    });
  });

  describe("Fund allocation", async () => {
    it("Should allow funds to be allocated", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await treasury.allocateFunds(
        USDT.address,
        alice.address,
        oneEther.mul(100)
      );

      await treasury
        .viewUserTokenBalance(USDT.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(200));
          expect(balances.allocated).to.eq(oneEther.mul(100));
        });
    });

    it("Should prevent withdrawal of funds which have been allocated", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await treasury.allocateFunds(
        USDT.address,
        alice.address,
        oneEther.mul(100)
      );

      await expect(
        treasury.withdraw(
          USDT.address,
          alice.address,
          alice.address,
          oneEther.mul(200)
        )
      ).to.be.reverted;
    });
  });

  describe("Fund transfer", async () => {
    it("Should allow transferring of allocated funds from one account to another", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await treasury.allocateFunds(
        USDT.address,
        alice.address,
        oneEther.mul(100)
      );

      await treasury.transferFunds(
        USDT.address,
        alice.address,
        bob.address,
        oneEther.mul(100)
      );

      await treasury
        .viewUserTokenBalance(USDT.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(100));
          expect(balances.allocated).to.eq(oneEther.mul(0));
        });

      await treasury
        .viewUserTokenBalance(USDT.address, alice.address)
        .then((balances: any) => {
          expect(balances.deposited).to.eq(oneEther.mul(100));
          expect(balances.allocated).to.eq(oneEther.mul(0));
        });
    });

    it("Should prevent withdrawal of funds which have been allocated", async () => {
      await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

      await treasury.allocateFunds(
        USDT.address,
        alice.address,
        oneEther.mul(100)
      );

      await expect(
        treasury.withdraw(
          USDT.address,
          alice.address,
          alice.address,
          oneEther.mul(200)
        )
      ).to.be.reverted;
    });
  });
});

async function validateErc20Balance(
  Erc20: MockErc20,
  who: string,
  amount: BigNumber
) {
  Erc20.balanceOf(who).then((balance) => expect(balance).to.eq(amount));
}
