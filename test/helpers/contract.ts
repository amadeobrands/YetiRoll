import MockERC20Artifact from "../../artifacts/contracts/mock/Erc20Mock.sol/MockERC20.json";
import {deployContract, MockProvider} from "ethereum-waffle";
import StreamArtifact from "../../artifacts/contracts/streams/Stream.sol/Stream.json";
import PausableStreamArtifact from "../../artifacts/contracts/streams/PausableStream.sol/PausableStream.json";
import MultipleRecipientStreamArtifact from "../../artifacts/contracts/streams/MultipleRecipientStream.sol/MultipleRecipientStream.json";
import FundManagerArtifact from "../../artifacts/contracts/FundManager.sol/FundManager.json";

import {
  FundManager,
  MockErc20,
  MultipleRecipientStream,
  PausableStream,
  Stream,
} from "../../typechain";

import {Signer} from "ethers";
import {ethers} from "hardhat";
const { waffle } = require("hardhat");


let provider: MockProvider;

export function getProvider() {
  if (provider == undefined) {
    provider = new MockProvider();
  }
  return provider;
}

export async function getAccounts() {
  return await ethers.getSigners();
}

export async function deployErc20(signer: Signer) {
  return (await deployContract(signer, MockERC20Artifact, [
    "MOCK",
    "MOCK",
  ])) as MockErc20;
}

export async function deployFundManager(signer: Signer) {
  return (await deployContract(signer, FundManagerArtifact)) as FundManager;
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
