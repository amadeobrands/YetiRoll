import MockERC20Artifact from "../../artifacts/MockERC20.json";
import {Signer} from "ethers";

// @ts-ignore not sure why it complains
import {deployContract} from "ethereum-waffle";
// @ts-ignore
import {MockErc20} from "../../typechain/MockErc20";

export async function deployErc20(signer: Signer) {
    return await deployContract(
        signer,
        MockERC20Artifact, ["MOCK", "MOCK"]
    ) as MockErc20;
}

