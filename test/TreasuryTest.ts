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

    treasury = (await deployContract(alice, TreasuryArtifact)) as Treasury;

    USDT = await deployErc20(alice);
    DAI = await deployErc20(alice);

    await USDT.mint(alice.address, oneEther.mul(99999999));

    await treasury.setExchangeAdaptor(exchangeAdaptor.address);
  });

  it("Should allow deposits of a single asset", async () => {
    await treasury.deposit(USDT.address, alice.address, oneEther.mul(200));

    await treasury
      .viewUserTokenBalance(alice.address, USDT.address)
      .then((balances: any) => {
        expect(balances.totalBalance).to.eq(oneEther.mul(200));
        expect(balances.availableBalance).to.eq(oneEther.mul(200));
      });
  });
});
