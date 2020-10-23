import MockERC20Artifact from "../../artifacts/MockERC20.json";
import {Signer} from "ethers";
import {deployContract, MockProvider} from "ethereum-waffle";
import {MockErc20} from "../../typechain/MockErc20";
import StreamArtifact from "../../artifacts/Stream.json";
import {Stream} from "../../typechain/Stream";
import PausableStreamArtifact from "../../artifacts/PausableStream.json";
import {PausableStream} from "../../typechain/PausableStream";
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
  return (await deployContract(
    signer,
    MultipleRecipientStreamArtifact
  )) as MultipleRecipientStream;
}

export async function mineBlock() {
  await getProvider().send("evm_mine", []);
}

export async function wait(secondsToWait: number) {
  // Update the clock
  await getProvider().send("evm_increaseTime", [secondsToWait]);

  // Process the block
  await mineBlock();
}

export async function getBlockTime() {
  return await getProvider()
    .getBlock(getBlockNumber())
    .then((block) => block.timestamp);
}

export async function getBlockNumber() {
  return await getProvider().getBlockNumber();
}
