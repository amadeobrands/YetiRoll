import { BigNumber, Contract } from 'ethers';
import DAI from './ABI/Erc20/DAI.json';
import ONE_INCH from './ABI/1Inch.json';
import { EXCHANGE_ADAPTOR } from '../deploy/constants';
import { Deployment } from 'hardhat-deploy/dist/types';

const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

const DAI_OWNER = '0xf977814e90da44bfa03b6295a0616a897441acec';

const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
const AUSDC_ADDRESS = '0x9bA00D6856a4eDF4665BcA2C2309936572473B7E';

const ONE_INCH_ADDRESS = '0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E';

const hre = require('hardhat');

async function main() {
  console.log('Starting...');
  const { ethers } = hre;

  let alice, bob;

  [alice] = await hre.ethers.getSigners();

  let aliceAddress = await alice.getAddress();

  console.log('Hijacking account with DAI');
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [DAI_OWNER],
  });

  let daiOwner = await hre.ethers.provider.getSigner(DAI_OWNER);

  console.log('Connecting to exchange adaptor');
  const exchangeAdaptor = await hre.deployments.get(EXCHANGE_ADAPTOR).then(async (deployment: Deployment) => {
    return await ethers.getContractAt(deployment.abi, deployment.address).then(async (contract: Contract) => {
      return contract.connect(daiOwner);
    });
  });

  console.log('Connecting to one inch');
  const oneInch = await hre.ethers.getContractAt(ONE_INCH, ONE_INCH_ADDRESS, alice);
  await oneInch.connect(alice);

  const dai = await hre.ethers.getContractAt(DAI, DAI_ADDRESS, daiOwner);

  console.log("Transferring 10,000 dai to exchange adaptor's address");
  await dai.transfer(exchangeAdaptor.address, oneEther.mul(10000));

  console.log('Checking distribution for DAI to AUSDC');
  await oneInch.callStatic
    .getExpectedReturn(DAI_ADDRESS, AUSDC_ADDRESS, oneEther.mul(1000), 10, 0)
    .then(async (quote: any) => {
      console.log('Swapping DAI for USDC');

      await exchangeAdaptor
        .exchange(DAI_ADDRESS, AUSDC_ADDRESS, oneEther.mul(1000), 1, quote.distribution, aliceAddress)
        .then(console.log);
    })
    .catch((error: any) => {
      console.log(error);
    });
}

// async function deployExchangeAdaptor(signer: SignerWithAddress) {
//   console.log('Deploying Exchange Adaptor Contract');
//   const exchangeAdaptorFactory = new ExchangeAdaptorFactory(signer);
//   const exchangeAdaptor = await exchangeAdaptorFactory.deploy();
//   await exchangeAdaptor.deployed();
//
//   console.log('Deployed Exchange Adaptor at ' + exchangeAdaptor.address);
//
//   return exchangeAdaptor;
// }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
