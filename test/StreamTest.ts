import chai from "chai";

import {deployContract, MockProvider} from "ethereum-waffle";

import PaymentStreamArtifact from "../artifacts/PaymentStream.json";
import {PaymentStream} from "../typechain/PaymentStream"

const {expect} = chai;
const provider = new MockProvider();
const [wallet, alice] = provider.getWallets();

describe("Stream Employee", () => {
    let paymentStream: PaymentStream;

    beforeEach(async () => {
        paymentStream = await deployContract(wallet, PaymentStreamArtifact) as PaymentStream;
    });

    it("Should allow creation of a stream", async () => {

    });
});
