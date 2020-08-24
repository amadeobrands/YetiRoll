import { ethers } from "@nomiclabs/buidler";
import chai from "chai";
import { deployContract, MockProvider, solidity } from "ethereum-waffle";

import StreamEmployeeArtifact from "../artifacts/StreamEmployee.json";
import { StreamEmployee } from "../typechain/StreamEmployee"

chai.use(solidity);
const { expect } = chai;
const provider = new MockProvider();
const [wallet, otherWallet] = provider.getWallets();


describe("Stream Employee", () => {
    let streamEmployee: StreamEmployee;

    beforeEach(async () => {
        streamEmployee = await deployContract(wallet, StreamEmployeeArtifact) as StreamEmployee;
    });


    it("Should be instantiated with no balance but have an initial payment per hour", async() => {

    });

    // 5
    // it("should count up", async () => {
    //     await counter.countUp();
    //     let count = await counter.getCount();
    //     expect(count).to.eq(1);
    //
    //     await counter.countUp();
    //     count = await counter.getCount();
    //     expect(count).to.eq(2);
    // });
    //
    // it("should count down", async () => {
    //     // 6
    //     await counter.countDown();
    //     const count = await counter.getCount();
    //     expect(count).to.eq(0);
    // });
});