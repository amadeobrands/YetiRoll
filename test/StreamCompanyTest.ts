import {ethers} from "@nomiclabs/buidler";
import chai from "chai";
import {deployContract, MockProvider, solidity} from "ethereum-waffle";

import StreamCompanyArtifact from "../artifacts/StreamCompany.json";
import {StreamCompany} from "../typechain/StreamCompany"

const {expect} = chai;
const provider = new MockProvider();
const [wallet, alice, bob] = provider.getWallets();

describe("Stream Employee", () => {
    let streamCompany: StreamCompany;

    beforeEach(async () => {
        streamCompany = await deployContract(
            wallet,
            StreamCompanyArtifact
        ) as StreamCompany;
    });

    it("It should start the company with a pool balance of 0 and allow top ups", async () => {
        let balance = await streamCompany.poolBalance();
        expect(balance).to.eq(0);

        await streamCompany.topUp({
            value: 1000
        });

        balance = await streamCompany.poolBalance();
        expect(balance).to.eq(1000);
    })

});