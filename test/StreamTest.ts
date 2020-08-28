import chai from "chai";

import {deployContract, deployMockContract, MockProvider} from "ethereum-waffle";

import IERC20 from "../artifacts/IERC20.json";
import PaymentStreamArtifact from "../artifacts/PaymentStream.json";
import {} from "../artifacts/Types.json";
import {PaymentStream} from "../typechain/PaymentStream"

const {expect} = chai;

const provider = new MockProvider();
const [wallet, alice] = provider.getWallets();

describe("Stream Employee", () => {
    const ERC_20_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
    let paymentStream: PaymentStream;

    async function setup() {
        const mockErc20 = await deployMockContract(wallet, IERC20.abi);
        await mockErc20.mock.address.returns(ERC_20_ADDRESS);

        console.log(mockErc20)
        return {mockErc20}

        // const {mockErc20} = await setup();

    }


    beforeEach(async () => {
        paymentStream = await deployContract(wallet, PaymentStreamArtifact) as PaymentStream;
    });

    it("Should allow creation of a stream", async () => {
        await paymentStream.createPausableStream(
            alice.address,
            100000,
            600,
            ERC_20_ADDRESS
        );

        const stream = await paymentStream.pausableStreams(alice.address, 0)

        console.log(stream)
    });
});
