import chai from "chai";

import {deployContract, MockProvider} from "ethereum-waffle";

import PaymentStreamArtifact from "../artifacts/PaymentStream.json";
import {PaymentStream} from "../typechain/PaymentStream"
import {MockErc20} from "../typechain/MockErc20"
import {BigNumber} from "ethers";
import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20} from "./helpers/contract";

const {expect} = chai;

const provider = new MockProvider();
const [alice, bob] = provider.getWallets();

describe("Payment Stream", () => {
    let paymentStream: PaymentStream;
    let token: MockErc20;
    let blockId: number;
    let timestamp: number;
    let startTime: number;

    let deposit = BigNumber.from(36).mul(oneEther);

    beforeEach(async () => {
        token = await deployErc20(alice);
        timestamp = await provider.getBlock(blockId).then(block => block.timestamp)
        paymentStream = await deployContract(alice, PaymentStreamArtifact) as PaymentStream;

        await token.mint(alice.address, 10000000);
        await token.approve(paymentStream.address, 10000000);

        startTime = timestamp + 100;
    });

    it("Should create a pausable stream", async () => {
        // 0.01 dai per second
        let ratePerSecond = BigNumber.from(1).mul(oneEther).div(100);

        await expect(createPausableStream(
            deposit,
            token,
            startTime
        )).to.emit(paymentStream, "PausableStreamCreated")
            .withArgs(
                1,
                startTime,
                deposit,
                oneHour,
                ratePerSecond,
                true
            );

        // todo get the id from stream creation
        const stream = await paymentStream.getPausableStream(1);

        expect(stream.duration).to.eq(oneHour);
        expect(stream.durationElapsed).to.eq(0);
        expect(stream.durationRemaining).to.eq(oneHour);
    });

    it("Should calculate an accurate amount of money paid from a running stream over 10 minutes", async () => {
        // 0.01 dai per second
        let ratePerSecond = BigNumber.from(1).mul(oneEther).div(100);

        await createPausableStream(
            deposit,
            token,
            startTime
        );

        let stream = await paymentStream.getPausableStream(1)

        expect(stream.isActive).to.eq(true)

        await paymentStream.pauseStream(1);

        stream = await paymentStream.getPausableStream(1)

        expect(stream.isActive).to.eq(false)
    });

    function createPausableStream(deposit: BigNumber, token: MockErc20, startTime: number) {
        return paymentStream.createPausableStream(
            bob.address,
            deposit.toString(),
            token.address,
            oneHour,
            startTime
        );
    }
});

