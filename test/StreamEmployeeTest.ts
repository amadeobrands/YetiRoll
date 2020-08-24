import {ethers} from "@nomiclabs/buidler";
import chai from "chai";
import {deployContract, MockProvider, solidity} from "ethereum-waffle";

import StreamEmployeeArtifact from "../artifacts/StreamEmployee.json";
import {StreamEmployee} from "../typechain/StreamEmployee"

chai.use(solidity);
const {expect} = chai;
const provider = new MockProvider();
const [wallet, alice, bob] = provider.getWallets();

describe("Stream Employee", () => {
    let streamEmployee: StreamEmployee;

    beforeEach(async () => {
        streamEmployee = await deployContract(
            wallet,
            StreamEmployeeArtifact,
            [10, alice.address]
        ) as StreamEmployee;
    });


    it("Should be instantiated with no balance but have an initial payment per hour", async () => {
        let address = await streamEmployee.employeeAddress();
        let pay = await streamEmployee.payPerHour();

        expect(address).to.eq(alice.address);
        expect(pay).to.eq(10);
    });
});