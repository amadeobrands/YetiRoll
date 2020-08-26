import chai from "chai";
import {deployContract, MockProvider} from "ethereum-waffle";
import {Contract} from 'ethers';

import StreamCompanyArtifact from "../artifacts/StreamCompany.json";
import StreamEmployeeArtifact from "../artifacts/StreamEmployee.json"
import {StreamCompany} from "../typechain/StreamCompany"

const {expect} = chai;
const provider = new MockProvider();
const [wallet, alice] = provider.getWallets();

describe("Stream Employee", () => {
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

    let streamCompany: StreamCompany;
    let streamCompanyAliceAddress: Contract;

    beforeEach(async () => {
        streamCompany = await deployContract(
            wallet,
            StreamCompanyArtifact
        ) as StreamCompany;

        streamCompanyAliceAddress = new Contract(
            streamCompany.address,
            StreamCompanyArtifact.abi,
            alice
        )
    });

    it("It should start the company with a pool balance of 0 and allow top ups", async () => {
        await streamCompany.topUp({
            value: 1000
        });

        let balance = await provider.getBalance(streamCompany.address)
        expect(balance).to.eq(1000);
    })

    it("It should allow the creation of new employees given the calling address has EMPLOYER_ROLE", async () => {
        await streamCompany.employees(alice.address).then(
            address => expect(address).to.eq(NULL_ADDRESS)
        );

        await streamCompany.createEmployee(alice.address, 1);

        await streamCompany.employees(alice.address).then(
            address => expect(address).to.not.eq(NULL_ADDRESS)
        );
    })
    it("It should disallow the creation of new employees if the calling address does not have the EMPLOYER_ROLE", async () => {
        await streamCompany.employees(alice.address).then(
            address => expect(address).to.eq(NULL_ADDRESS)
        );

        await expect(streamCompanyAliceAddress.createEmployee(alice.address, 100)).to.be.reverted;
    })

    it("It should only allow withdrawal if there is sufficient balance in the pool", async () => {
        await streamCompany.createEmployee(alice.address, 100);

        // Alice has earned no money nor is there any balance
        await expect(streamCompanyAliceAddress.getPayment(100)).to.be.reverted;

        // Load Alice's address and trigger her work start
        const aliceContract = await streamCompany.employees(alice.address).then(
            address => new Contract(address, StreamEmployeeArtifact.abi, alice)
        )

        await aliceContract.startWorking()

        await wait(3600)

        await aliceContract.stopWorking()

        // Alice has been working hard but there are no funds to pay her 🥺
        await expect(streamCompanyAliceAddress.getPayment(100)).to.be.reverted;

        await streamCompany.topUp({value: 1000});

        await expect(streamCompanyAliceAddress.getPayment(100)).to.not.be.reverted;

        await provider.getBalance(streamCompany.address).then(
            balance => expect(balance).to.be.eq(900)
        )
    })
});

async function wait(amountOfTimeToWait: number) {
    // Update the clock
    await provider.send("evm_increaseTime", [amountOfTimeToWait])

    // Process the block
    await provider.send("evm_mine", [])
}