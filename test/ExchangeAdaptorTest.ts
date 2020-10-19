import chai from "chai";
import {deployErc20, getProvider} from "./helpers/contract";

import {deployContract, deployMockContract, MockContract,} from "ethereum-waffle";

import ExchangeAdaptorArtifact from "../artifacts/ExchangeAdaptor.json";
import {ExchangeAdaptor} from "../typechain/ExchangeAdaptor";
import {oneEther} from "./helpers/numbers";
import {MockErc20} from "../typechain/MockErc20";

import ONE_INCH_ABI from "../integration/ABI/1Inch.json";
import {BigNumber} from "ethers";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Exchange Adaptor", () => {
    let oneInch: MockContract;
    let exchangeAdaptor: ExchangeAdaptor;
    let USDT: MockErc20;
    let DAI: MockErc20;

    before(async () => {
        oneInch = await deployMockContract(alice, ONE_INCH_ABI);
        exchangeAdaptor = (await deployContract(
            alice,
            ExchangeAdaptorArtifact
        )) as ExchangeAdaptor;

        USDT = await deployErc20(alice);
        DAI = await deployErc20(alice);

        await USDT.mint(alice.address, oneEther.mul(99999999));
        await DAI.mint(exchangeAdaptor.address, oneEther.mul(99999999));

        await exchangeAdaptor.setOneInch(oneInch.address);
    });

    describe("Swapping funds", () => {
        it("Should forward exchange requests to an exchange", async () => {
            await oneInch.mock.swap.withArgs(
                USDT.address,
                DAI.address,
                oneEther.mul(200),
                oneEther.mul(195),
                [10],
                0
            ).returns(oneEther.mul(195));

            await exchangeAdaptor.setOneInch(oneInch.address);

            await exchangeAdaptor.callStatic
                .exchange(
                    USDT.address,
                    DAI.address,
                    oneEther.mul(200),
                    oneEther.mul(195),
                    [10],
                    alice.address
                )
            .then((totalReceived : BigNumber) => {
                expect(totalReceived).to.be.eq(oneEther.mul(195));
            });
        });
    });
    describe("Access control", () => {
        it("Only the owner should be able to set the 1inch ", async () => {
            const bobConnectedExchangeAdaptor = exchangeAdaptor.connect(bob);
            await expect(bobConnectedExchangeAdaptor.setOneInch(oneInch.address)).to.be.revertedWith(" Ownable: caller is not the owner");

        });
    });
});
