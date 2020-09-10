import chai from "chai";

import {deployContract} from "ethereum-waffle";

import PausableStreamArtifact from "../artifacts/PausableStream.json";
import {PausableStream} from "../typechain/PausableStream";

import {MockErc20} from "../typechain/MockErc20";
import {BigNumber} from "ethers";
import {oneEther, oneHour} from "./helpers/numbers";
import {deployErc20, getBlockTime, getProvider, wait} from "./helpers/contract";

const {expect} = chai;

const [alice, bob] = getProvider().getWallets();

describe("Multiple Recipient Stream", () => {});
