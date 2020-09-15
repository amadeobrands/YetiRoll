import chai from "chai";

import {MultipleRecipientStream} from "../typechain/MultipleRecipientStream";
import {MockErc20} from "../typechain/MockErc20";

import {oneEther, oneHour} from "./helpers/numbers";
import {
    deployErc20,
    deployMultipleRecipientStream,
    deployPausableStream,
    getBlockTime,
    getProvider
} from "./helpers/contract";
import {BigNumber} from "ethers";
import {Stream} from "../typechain/Stream";

const {expect} = chai;

const [alice, bob, charlie, dennis, ethan] = getProvider().getWallets();

describe("Multiple Recipient Stream", () => {
    let multipleRecipient: MultipleRecipientStream;
    let token: MockErc20;
    let timestamp: number;

    beforeEach(async () => {
        token = await deployErc20(alice);
        multipleRecipient = await deployMultipleRecipientStream(alice);

        await token.mint(alice.address, 10000000);
        await token.approve(multipleRecipient.address, 10000000);

        timestamp = (await getBlockTime()) + 100;
    });

    it("Should accept an array of addresses and create a stream to each with splitting the deposit in an equal proportion", async () => {
        await createMultipleRecipientStream();

        await multipleRecipient.getStream(1, charlie.address).then((stream : any) => expect(stream.recipient).to.eq(charlie.address));
        await multipleRecipient.getStream(1, dennis.address).then((stream : any) => expect(stream.recipient).to.eq(dennis.address));
        await multipleRecipient.getStream(1, ethan.address).then((stream : any) => expect(stream.recipient).to.eq(ethan.address));

        const stream =  await multipleRecipient.getStream(1, bob.address);

        expect(stream.deposit).to.eq(oneEther.mul(25));
        expect(stream.recipient).to.eq(bob.address);
    });

    it("Should allow you to find the stream id using the multiple stream id & recipient address", async () => {
        await createMultipleRecipientStream();

        await multipleRecipient.getStreamId(1, bob.address)
            .then((streamId : BigNumber) => expect(streamId.toNumber()).to.eq(1));
        await multipleRecipient.getStreamId(1, charlie.address)
            .then((streamId : BigNumber) => expect(streamId.toNumber()).to.eq(2));
        await multipleRecipient.getStreamId(1, dennis.address)
            .then((streamId : BigNumber) => expect(streamId.toNumber()).to.eq(3));
        await multipleRecipient.getStreamId(1, ethan.address)
            .then((streamId : BigNumber) => expect(streamId.toNumber()).to.eq(4));
    });

    // todo implement access control first
    xit("Should allow withdrawal from each stream", async () => {
        await createMultipleRecipientStream();

        await multipleRecipient.getStreamId(1, charlie.address).then(
            (streamId:BigNumber) => {

            }
        );
    });

    async function createMultipleRecipientStream() {
        await multipleRecipient.createStream(
            Array.of(bob.address, charlie.address, dennis.address, ethan.address),
            oneEther.mul(100),
            token.address,
            timestamp,
            timestamp + oneHour
        );
    }
});
