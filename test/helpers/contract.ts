import MockERC20Artifact from "../../artifacts/MockERC20.json";
import {Signer} from "ethers";
// @ts-ignore not sure why it complains
import {deployContract, MockProvider} from "ethereum-waffle";
// @ts-ignore
import {MockErc20} from "../../typechain/MockErc20";

let provider: MockProvider;

export function getProvider() {
  if (provider == undefined) {
    provider = new MockProvider();
  }
  return provider;
}

export function resetProvider() {
  provider = new MockProvider();
}

export async function deployErc20(signer: Signer) {
  return (await deployContract(signer, MockERC20Artifact, [
    "MOCK",
    "MOCK",
  ])) as MockErc20;
}

export async function wait(amountOfTimeToWait: number) {
  // Update the clock
  await getProvider().send("evm_increaseTime", [amountOfTimeToWait]);

  // Process the block
  await getProvider().send("evm_mine", []);
}

// Get time and add 1 to prevent timestamp issues
export async function getBlockTime() {
  return await getProvider()
    .getBlock(getBlockNumber())
    .then((block) => block.timestamp);
}

export async function getBlockNumber() {
  return await getProvider().getBlockNumber();
}
