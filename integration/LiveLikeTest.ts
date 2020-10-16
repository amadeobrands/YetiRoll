import {BigNumber, Contract, providers} from "ethers";

import {TreasuryFactory} from "../typechain";

const provider = new providers.JsonRpcProvider("http://127.0.0.1:8546");
const alice = provider.getSigner(0);
const bob = provider.getSigner(1);
const charlie = provider.getSigner(2);
const dennis = provider.getSigner(3);
const ethan = provider.getSigner(4);
const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

import DAI from "./ABI/DAI.json";
import AUSDC from "./ABI/AUSDC.json";
import ONE_INCH from "./ABI/1Inch.json";

const DAI_OWNER = "0x9eb7f2591ed42dee9315b6e2aaf21ba85ea69f8c";

const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const AUSDC_ADDRESS = "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E";
const ONE_INCH_ADDRESS = "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E";

let dai;
let ausdc;
let oneInch: Contract;

async function main() {
  console.log("Starting...");
  const aliceAddress = await alice.getAddress();

  let daiOwner = provider.getSigner(DAI_OWNER);

  dai = new Contract(DAI_ADDRESS, DAI, daiOwner);
  let aliceDai = dai.connect(alice);
  ausdc = new Contract(AUSDC_ADDRESS, AUSDC, alice);
  oneInch = new Contract(ONE_INCH_ADDRESS, ONE_INCH, alice);

  console.log("Transferring 1 dai to Alice's address " + aliceAddress);
  await dai.transfer(aliceAddress, oneEther.mul(1));

  console.log("Approving 1inch to spend Alice's DAI");
  await aliceDai.approve(oneInch.address, oneEther.mul(1000));

  await ausdc
    .balanceOf(aliceAddress)
    .then((balance: BigNumber) =>
      console.log("Alice's AUSDC balance " + balance.toString())
    );

  await dai
    .balanceOf(aliceAddress)
    .then((balance: BigNumber) =>
      console.log("Alice's DAI balance " + balance.toString())
    );

  console.log("Checking distribution for DAI to AUSDC");
  await oneInch.callStatic
    .getExpectedReturn(DAI_ADDRESS, AUSDC_ADDRESS, 100, 1, 0)
    .then(async (quote) => {
      console.log("Swapping DAI for USDC");
      await oneInch.swap(
        DAI_ADDRESS,
        AUSDC_ADDRESS,
        100,
        quote.returnAmount,
        quote.distribution,
        0
      );
    })
    .catch((error) => {
      console.log(error);
    });

  await ausdc
    .balanceOf(aliceAddress)
    .then((balance: BigNumber) =>
      console.log("Alice's AUSDC balance " + balance.toString())
    );

  await dai
    .balanceOf(aliceAddress)
    .then((balance: BigNumber) =>
      console.log("Alice's DAI balance " + balance.toString())
    );
}

async function deployTreasury() {
  console.log("Deploying Treasury Contract");
  const treasuryFactory = new TreasuryFactory(alice);
  const treasury = await treasuryFactory.deploy();
  await treasury.deployed();

  console.log("Deployed Treasury at " + treasury.address);

  return treasury;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
