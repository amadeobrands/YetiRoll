import {ethers} from "@nomiclabs/buidler";
import chai from "chai";
import {deployContract, MockProvider, solidity} from "ethereum-waffle";

import StreamEmployeeArtifact from "../artifacts/StreamEmployee.json";
import {StreamEmployee} from "../typechain/StreamEmployee"

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

    xit("Should be instantiated with no balance but have an initial payment per hour", async () => {
        let address = await streamEmployee.employeeAddress();
        let pay = await streamEmployee.payPerHour();
        let balance = await streamEmployee.balance();

        expect(address).to.eq(alice.address);
        expect(pay).to.eq(10);
        expect(balance).to.eq(0);
    });

    xit("Should be able to toggle working and not working", async () => {
        // By default is working should not be true
        let isWorking = await streamEmployee.isWorking();
        expect(isWorking).to.eq(false);

        await streamEmployee.startWorking();

        isWorking = await streamEmployee.isWorking();
        expect(isWorking).to.eq(true);

        await streamEmployee.stopWorking();

        isWorking = await streamEmployee.isWorking();
        expect(isWorking).to.eq(false);
    });

    xit("Should disallow starting work if work has started and also disallow stopping work if work is stopped", async () => {
        await streamEmployee.startWorking();

        await expect(streamEmployee.startWorking()).to.be.reverted;

        await streamEmployee.stopWorking();

        await expect(streamEmployee.stopWorking()).to.be.reverted;
    });

    // Todo look at fixtures maybe it is easier to preload some data here
    xit("Should calculate the total number of hours worked when work ends", async () => {
        await streamEmployee.startWorking();
        await expect(streamEmployee.stopWorking()).to.emit(streamEmployee, "e").withArgs(123);
        // await streamEmployee.hoursWxorked().then(console.log)

    });
});