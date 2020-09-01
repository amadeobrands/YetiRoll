import chai from "chai";

import {deployContract, deployMockContract, MockProvider} from "ethereum-waffle";

import PaymentStreamArtifact from "../artifacts/PaymentStream.json";
import MockERC20Artifact from "../artifacts/MockERC20.json";
import {PaymentStream} from "../typechain/PaymentStream"
import {MockErc20} from "../typechain/MockErc20"
import {Contract} from "ethers";
import StreamCompanyArtifact from "../artifacts/StreamCompany.json";

const {expect} = chai;

const provider = new MockProvider();
const [alice, bob] = provider.getWallets();

describe("Payment Stream", () => {
    const ERC_20_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
    let paymentStream: PaymentStream;
    let token: MockErc20;

    beforeEach(async () => {
        token = await deployContract(
            alice,
            MockERC20Artifact, ["MOCK", "MOCK"]
        ) as MockErc20;
        paymentStream = await deployContract(alice, PaymentStreamArtifact) as PaymentStream;
    });

    it("Should allow creation of a stream", async () => {
        const blockId = await provider.getBlockNumber();
        const {timestamp} = await provider.getBlock(blockId)
        await token.mint(alice.address, 10000000);
        await token.approve(paymentStream.address, 10000000);

        const streamId = await paymentStream.createStream(
            bob.address,
            10000,
            token.address,
            timestamp + 100,
            timestamp + 1100
        )

        // const stream = await paymentStream.getStream(streamId)
        //
        // console.log(stream)
    });
});
