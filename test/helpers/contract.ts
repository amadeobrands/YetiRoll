import MockERC20Artifact from "../../artifacts/MockERC20.json";
import {Signer} from "ethers";
// @ts-ignore not sure why it complains
import {deployContract, MockProvider} from "ethereum-waffle";
// @ts-ignore
import {MockErc20} from "../../typechain/MockErc20";

// export function getProvider() {
//   return;
// }

export async function deployErc20(signer: Signer) {
  return (await deployContract(signer, MockERC20Artifact, [
    "MOCK",
    "MOCK",
  ])) as MockErc20;
}

// todo best if provider is wrapped up in here
export async function wait(amountOfTimeToWait: number, provider: MockProvider) {
  // Update the clock
  await provider.send("evm_increaseTime", [amountOfTimeToWait]);

  // Process the block
  await provider.send("evm_mine", []);
}
