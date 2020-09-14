import chai from "chai";

import {deployContract} from "ethereum-waffle";

import MultipleRecipientStreamArtifact from "../artifacts/MultipleRecipientStream.json";
import StreamArtifact from "../artifacts/Stream.json";

import {MultipleRecipientStream} from "../typechain/MultipleRecipientStream";
import {Stream} from "../typechain/Stream";
import {MockErc20} from "../typechain/MockErc20";

import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20, getBlockTime, getProvider} from "./helpers/contract";

const {expect} = chai;

const [alice, bob, charlie, dennis, ethan] = getProvider().getWallets();

describe("Multiple Recipient Stream", () => {
    let multipleRecipient: MultipleRecipientStream;
    let token: MockErc20;
    let timestamp: number;

    beforeEach(async () => {
        token = await deployErc20(alice);
        multipleRecipient = (await deployContract(
            alice,
            MultipleRecipientStreamArtifact
        )) as MultipleRecipientStream;

        await token.mint(alice.address, 10000000);
        await token.approve(multipleRecipient.address, 10000000);

        timestamp = (await getBlockTime()) + 100;
    });

    it("Should accept an array of addresses and create a stream to each with splitting the deposit in an eqaul proportion ", async () => {
        await multipleRecipient.createStream(
            Array.of(bob.address, charlie.address, dennis.address, ethan.address),
            oneEther.mul(100),
            token.address,
            timestamp,
            timestamp + oneHour
        );

        const stream =  await multipleRecipient.getStream(1, bob.address);

        expect(stream.deposit).to.eq(oneEther.mul(25));
    });
});
