import MockERC20Artifact from "../../artifacts/MockERC20.json";
import {Signer} from "ethers";
import {deployContract, MockProvider} from "ethereum-waffle";
import {MockErc20} from "../../typechain/MockErc20";
import StreamArtifact from "../../artifacts/Stream.json";
import {Stream} from "../../typechain/Stream";
import PausableStreamArtifact from "../../artifacts/PausableStream.json";
import {PausableStream} from "../../typechain/PausableStream";
import StreamManagerArtifact from "../../artifacts/StreamManager.json";
import {StreamManager} from "../../typechain/StreamManager";
import MultipleRecipientStreamArtifact from "../../artifacts/MultipleRecipientStream.json";
import {MultipleRecipientStream} from "../../typechain/MultipleRecipientStream";

let provider: MockProvider;

export function getProvider() {
  if (provider == undefined) {
    provider = new MockProvider();
  }
  return provider;
}

export async function deployErc20(signer: Signer) {
  return (await deployContract(signer, MockERC20Artifact, [
    "MOCK",
    "MOCK",
  ])) as MockErc20;
}

export async function deployStream(signer: Signer) {
  return (await deployContract(signer, StreamArtifact)) as Stream;
}

export async function deployPausableStream(signer: Signer) {
  return (await deployContract(
      signer,
      PausableStreamArtifact
  )) as PausableStream;
}

export async function deployMultipleRecipientStream(signer: Signer) {
  return await deployContract(signer, MultipleRecipientStreamArtifact) as MultipleRecipientStream;
}

export async function deployStreamManager(signer: Signer) {
    return (await deployContract(
        signer,
        StreamManagerArtifact
    )) as StreamManager;
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
