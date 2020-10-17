import {BigNumber, Contract, providers} from "ethers";

import {ExchangeAdaptorFactory} from "../typechain";
import DAI from "./ABI/DAI.json";
import AUSDC from "./ABI/AUSDC.json";
import ONE_INCH from "./ABI/1Inch.json";

const provider = new providers.JsonRpcProvider("http://127.0.0.1:8546");
const alice = provider.getSigner(0);
const bob = provider.getSigner(1);
const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

const DAI_OWNER = "0x9eb7f2591ed42dee9315b6e2aaf21ba85ea69f8c";

const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const AUSDC_ADDRESS = "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E";

const ONE_INCH_ADDRESS = "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E";
const ONE_INCH_TOKEN_TAKER_ADDRESS =
  "0xe4c9194962532feb467dce8b3d42419641c6ed2e";

let dai;
let ausdc;

async function main() {
  console.log("Starting...");
  const aliceAddress = await alice.getAddress();
  const oneInch = new Contract(ONE_INCH_ADDRESS, ONE_INCH, alice);
  const exchangeAdaptor = await deployExchangeAdaptor();

  await exchangeAdaptor.setOneInch(
    ONE_INCH_ADDRESS,
    ONE_INCH_TOKEN_TAKER_ADDRESS
  );

  let daiOwner = provider.getSigner(DAI_OWNER);

  dai = new Contract(DAI_ADDRESS, DAI, daiOwner);
  ausdc = new Contract(AUSDC_ADDRESS, AUSDC, alice);

  console.log("Transferring 1 dai to exchange adaptor's address");
  await dai.transfer(exchangeAdaptor.address, oneEther.mul(10000));

  await dai
    .balanceOf(exchangeAdaptor.address)
    .then((balance: BigNumber) =>
      console.log("Exchange adaptor's DAI balance " + balance.toString())
    );

  await ausdc
    .balanceOf(exchangeAdaptor.address)
    .then((balance: BigNumber) =>
      console.log("Exchange adaptor's AUSDC balance " + balance.toString())
    );

  console.log("Checking distribution for DAI to AUSDC");
  await oneInch.callStatic
    .getExpectedReturn(DAI_ADDRESS, AUSDC_ADDRESS, oneEther.mul(1000), 10, 0)
    .then(async (quote) => {
      console.log("Swapping DAI for USDC");

      await exchangeAdaptor.callStatic
        .swap(
          DAI_ADDRESS,
          AUSDC_ADDRESS,
          oneEther.mul(1000),
          1,
          quote.distribution,
          aliceAddress
        )
        .then(console.log);

      // const s = await exchangeAdaptor.callStatic.exchange(
      //   DAI_ADDRESS,
      //   AUSDC_ADDRESS,
      //   oneEther.mul(1),
      //   quote.returnAmount,
      //   quote.distribution,
      //   aliceAddress
      // );
      // console.log(s);
    })
    .catch((error) => {
      console.log(error);
    });

  await dai
    .balanceOf(aliceAddress)
    .then((balance: BigNumber) =>
      console.log("Alice's DAI balance " + balance.toString())
    );

  await ausdc
    .balanceOf(aliceAddress)
    .then((balance: BigNumber) =>
      console.log("Alice's AUSDC balance " + balance.toString())
    );

  await dai
    .allowance(exchangeAdaptor.address, ONE_INCH_TOKEN_TAKER_ADDRESS)
    .then((balance: BigNumber) => {
      console.log("ExchangeAdaptor allowance " + balance.toString());
    });

  await dai
    .balanceOf(exchangeAdaptor.address)
    .then((balance: BigNumber) =>
      console.log("Exchange adaptor's DAI balance " + balance.toString())
    );

  await ausdc
    .balanceOf(exchangeAdaptor.address)
    .then((balance: BigNumber) =>
      console.log("Exchange adaptor's AUSDC balance " + balance.toString())
    );

  // await dai
  //   .balanceOf(exchangeAdaptor.address)
  //   .then((balance: BigNumber) =>
  //     console.log("Exchange adaptor's DAI balance " + balance.toString())
  //   );
  //
  // await ausdc
  //   .balanceOf(exchangeAdaptor.address)
  //   .then((balance: BigNumber) =>
  //     console.log("Exchange adaptor's AUSDC balance " + balance.toString())
  //   );
  //
  // await ausdc
  //   .balanceOf(aliceAddress)
  //   .then((balance: BigNumber) =>
  //     console.log("Alice's AUSDC balance " + balance.toString())
  //   );
  //
  // await dai
  //   .balanceOf(aliceAddress)
  //   .then((balance: BigNumber) =>
  //     console.log("Alice's DAI balance " + balance.toString())
  //   );
  //
  // await ausdc
  //   .balanceOf(bobAddress)
  //   .then((balance: BigNumber) =>
  //     console.log("Bob's AUSDC balance " + balance.toString())
  //   );
  //
  // await dai
  //   .balanceOf(bobAddress)
  //   .then((balance: BigNumber) =>
  //     console.log("Bob's DAI balance " + balance.toString())
  //   );
}

async function deployExchangeAdaptor() {
  console.log("Deploying Exchange Adaptor Contract");
  const exchangeAdaptorFactory = new ExchangeAdaptorFactory(alice);
  const exchangeAdaptor = await exchangeAdaptorFactory.deploy();
  await exchangeAdaptor.deployed();

  console.log("Deployed Exchange Adaptor at " + exchangeAdaptor.address);

  return exchangeAdaptor;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
