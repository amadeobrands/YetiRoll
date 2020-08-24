import chai from "chai";

import {deployContract, MockProvider} from "ethereum-waffle";

import StreamEmployeeArtifact from "../artifacts/StreamEmployee.json";
import {StreamEmployee} from "../typechain/StreamEmployee"
import {BigNumber} from "ethers";

const {expect} = chai;
const provider = new MockProvider();
const [wallet, alice] = provider.getWallets();

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
        let balance = await streamEmployee.balance();

        expect(address).to.eq(alice.address);
        expect(pay).to.eq(10);
        expect(balance).to.eq(0);
    });

    it("Should be able to toggle working and not working", async () => {
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

    it("Should disallow starting work if work has started and also disallow stopping work if work is stopped", async () => {
        await streamEmployee.startWorking();

        await expect(streamEmployee.startWorking()).to.be.reverted;

        await streamEmployee.stopWorking();

        await expect(streamEmployee.stopWorking()).to.be.reverted;
    });

    // Assumption that pay per hour is 10
    it("Should calculate the amount earned per second", async () => {
        let payPerSecond = await streamEmployee.payPerSecond().then(parseInt);

        // To get accurate value payPerSecond / 10 ^-18
        expect(payPerSecond).to.eq(2777777777777777);
    })

    it("Should calculate the total pay owed after working for an hour", async () => {
        await streamEmployee.startWorking();

        // Wait 10 minutes
        await wait(3600);

        await streamEmployee
            .timeWorkedInSeconds()
            .then((timeWorked: bigint) => expect(timeWorked).to.eq(3600))

        let payAccrued = await streamEmployee.payAccrued().then(parseInt)

        // Basically 10
        expect(payAccrued).to.eq(9999999999999998000);
    });

    it("Should calculate the amount owed for each working block", async () => {
        await streamEmployee.startWorking();
        await wait(3600);
        await streamEmployee.stopWorking();

        await streamEmployee.startWorking();
        await wait(1800);
        await streamEmployee.stopWorking();

        let balance = await streamEmployee.balance();

        let expectedBalance = BigNumber.from("0xd02ab486cedbef98");

        expect(balance).to.be.at.least(expectedBalance)
    });
});

async function wait(amountOfTimeToWait: number) {
    // Wait 10 minutes
    await provider.send("evm_increaseTime", [amountOfTimeToWait])

    // Process the block
    await provider.send("evm_mine", [])
}