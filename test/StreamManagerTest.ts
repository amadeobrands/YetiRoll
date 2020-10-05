import chai from "chai";

const {expect} = chai;
import {BigNumber} from "ethers";

import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20, deployStream, deployStreamManager, getBlockTime, getProvider, wait} from "./helpers/contract";
import {Stream} from "../typechain/Stream";
import {MockErc20} from "../typechain/MockErc20";
import {StreamManager} from "../typechain/StreamManager";

const [alice, bob] = getProvider().getWallets();

describe("The stream manager", () => {
    let stream: Stream;
    let streamManager: StreamManager;
    let token: MockErc20;
    let timestamp: number;

    let deposit = BigNumber.from(36).mul(oneEther);

    beforeEach(async () => {
        token = await deployErc20(alice);

        stream = await deployStream(alice);
        streamManager = await deployStreamManager(alice, stream);

        await stream.grantStreamManager(streamManager.address);

        await token.mint(alice.address, deposit);
        await token.approve(streamManager.address, oneEther.mul(9999));

        timestamp = (await getBlockTime()) + 1;
    });

    describe("Fixed duration Stream Interaction", () => {
        it("Should allow creation of a stream through its interface", async () => {
            await streamManager.createStream(
                bob.address,
                oneEther,
                token.address,
                timestamp + 1,
                timestamp + oneHour
            );

            const stream = await streamManager.getStream(1);

            expect(stream.deposit).to.eq(oneEther);

            await token
                .balanceOf(alice.address)
                .then((balance) => expect(balance).to.eq(oneEther.mul(35)));

            await token
                .balanceOf(streamManager.address)
                .then((balance) => expect(balance).to.eq(oneEther));

        });
    });

    xdescribe("Pausable Stream Interaction", () => {

        it("Should allow creation of a stream through its interface", async () => {
            await streamManager.createPausableStream(
                bob.address,
                oneEther,
                token.address,
                oneHour,
                timestamp
            );

            const stream = await streamManager.getPausableStream(1);

            expect(stream.deposit).to.eq(oneEther);

            await token
                .balanceOf(alice.address)
                .then((balance) => expect(balance).to.eq(oneEther.mul(35)));

            await token
                .balanceOf(streamManager.address)
                .then((balance) => expect(balance).to.eq(oneEther));
        });

        it("Should allow withdrawal of funds after balance has accrued", async () => {
            await streamManager.createPausableStream(
                bob.address,
                oneEther.mul(36),
                token.address,
                oneHour,
                timestamp
            );

            // Check balance matches deposit and no funds have been paid out
            let stream = await streamManager.getPausableStream(1);
            expect(stream.balanceAccrued).to.eq(0);
            expect(stream.deposit).to.eq(oneEther.mul(36));

            // Set the clock forward 30 minutes
            await wait(1800);

            // Should see 18 Dai have been paid out (Out of 36 deposit)
            stream = await streamManager.getPausableStream(1);

            expect(
                stream.balanceAccrued.div(oneEther).toNumber()
            ).to.be.approximately(18, 1);

            // 1 should represent PausableStream
            // Withdraw funds from stream
            await streamManager.withdrawFromStream(
                1,
                oneEther.mul(9),
                bob.address,
                1
            );

            await token
                .balanceOf(streamManager.address)
                .then((balance) => expect(balance).to.eq(oneEther.mul(27)));

            await token
                .balanceOf(bob.address)
                .then((balance) => expect(balance).to.eq(oneEther.mul(9)));
        });

        it("Should allow withdrawal of all funds after stream has ended", async () => {
            await streamManager.createPausableStream(
                bob.address,
                oneEther.mul(36),
                token.address,
                oneHour,
                timestamp
            );

            // Set the clock forward 2 hours
            await wait(7200);

            let stream = await streamManager.getPausableStream(1);

            expect(stream.balanceAccrued).to.eq(stream.deposit);
            await streamManager.withdrawFromStream(
                1,
                oneEther.mul(36),
                bob.address,
                1
            );

            await token
                .balanceOf(streamManager.address)
                .then((balance) => expect(balance).to.eq(oneEther.mul(0)));

            await token
                .balanceOf(bob.address)
                .then((balance) => expect(balance).to.eq(oneEther.mul(36)));
        });
    });
});
