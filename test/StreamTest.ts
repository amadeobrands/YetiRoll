import chai from "chai";

import {deployContract, MockProvider} from "ethereum-waffle";

import PaymentStreamArtifact from "../artifacts/PaymentStream.json";
import MockERC20Artifact from "../artifacts/MockERC20.json";
import {PaymentStream} from "../typechain/PaymentStream"
import {MockErc20} from "../typechain/MockErc20"
import {BigNumber} from "ethers";

const {expect} = chai;

const provider = new MockProvider();
const [alice, bob] = provider.getWallets();

describe("Payment Stream", () => {
    const oneHour = 3600;

    let paymentStream: PaymentStream;
    let token: MockErc20;
    let blockId: number;

    beforeEach(async () => {
        token = await deployContract(
            alice,
            MockERC20Artifact, ["MOCK", "MOCK"]
        ) as MockErc20;
        paymentStream = await deployContract(alice, PaymentStreamArtifact) as PaymentStream;

        blockId = await provider.getBlockNumber();
    });

    it("Should allow creation of a stream", async () => {
        const {timestamp} = await provider.getBlock(blockId)
        await token.mint(alice.address, 10000000);
        await token.approve(paymentStream.address, 10000000);

        let deposit = 10000;
        let startTime = timestamp + 100;
        let stopTime = timestamp + 1100;

        await paymentStream.createStream(
            bob.address,
            deposit,
            token.address,
            startTime,
            stopTime
        )

        // todo get the id from stream creation
        const stream = await paymentStream.getStream(1)

        expect(stream.recipient).to.eq(bob.address);
        expect(stream.deposit).to.eq(deposit);
        expect(stream.tokenAddress).to.eq(token.address);
        expect(stream.startTime).to.eq(startTime);
        expect(stream.stopTime).to.eq(stopTime);
    });

    it("Should create a pausable stream", async () => {
        const {timestamp} = await provider.getBlock(blockId)
        await token.mint(alice.address, 10000000);
        await token.approve(paymentStream.address, 10000000);

        // 10 dai
        let deposit = BigNumber.from(10).pow(18);
        let startTime = timestamp + 100;

        let ratePerSecond = BigNumber.from(277777777777777);

        await expect(paymentStream.createPausableStream(
            bob.address,
            deposit.toString(),
            token.address,
            oneHour,
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
});
