import chai from "chai";
import {Stream} from "../typechain/Stream";
import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {deployErc20, deployStream, getBlockTime, getProvider, wait} from "./helpers/contract";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Payment Stream", () => {
    const oneEther = BigNumber.from(10).pow(18);

    let paymentStream: Stream;
    let token: MockErc20;
    let timestamp: number;

    beforeEach(async () => {
        token = await deployErc20(alice);

        paymentStream = await deployStream(alice);

        await token.mint(alice.address, 10000000);
        await token.approve(paymentStream.address, 10000000);

        timestamp = (await getBlockTime()) + 10;
    });

    it("Should allow creation of a stream", async () => {
        await paymentStream.createStream(
            bob.address,
            oneEther,
            token.address,
            timestamp,
            timestamp + 100
        );

        const stream = await paymentStream.getStream(1);

        expect(stream.recipient).to.eq(bob.address);
        expect(stream.deposit).to.eq(oneEther);
        expect(stream.tokenAddress).to.eq(token.address);
        expect(stream.startTime).to.eq(timestamp);
        expect(stream.stopTime).to.eq(timestamp + 100);
    });

    it("Should prevent creation of a stream with a start time in the past", async () => {
        await expect(
            paymentStream.createStream(bob.address, oneEther, token.address, 100, 200)
        ).to.be.revertedWith("Cannot start a stream in the past");
    });

    it("Should prevent creation of a stream with a rate per second of less than 1 wei", async () => {
        await expect(
            paymentStream.createStream(
                bob.address,
                1800,
                token.address,
                timestamp,
                timestamp + 3601
            )
        ).to.be.revertedWith("Rate per second must be above 0");
    });

    it("Should prevent creation of a stream an end date before the start date", async () => {
        await expect(
            paymentStream.createStream(
                bob.address,
                1800,
                token.address,
                timestamp + 3600,
                timestamp
            )
        ).to.be.revertedWith("SafeMath: subtraction overflow");
    });

    it("Should prevent creation of a stream where start and end date are the same time", async () => {
        await expect(
            paymentStream.createStream(
                bob.address,
                1800,
                token.address,
                timestamp,
                timestamp
            )
        ).to.be.revertedWith("Stream must last a least a second");
    });

    describe("Balance accruing", async () => {
        xit("Should prevent creation of a stream where start and end date are the same time", async () => {
            await paymentStream.createStream(
                bob.address,
                oneEther.mul(36),
                token.address,
                timestamp,
                timestamp + 3600
            );
        });

        await wait(1800);

        await paymentStream.withdraw(1, 100, bob.address);

        // await paymentStream.getStream(1).then(stream => {
        //     expect(stream.)
        // });


    });
});
