import { BigNumber, Contract } from 'ethers';
import { AAVE_ADAPTOR } from '../deploy/constants';
import { Deployment } from 'hardhat-deploy/dist/types';
import AAVE from './ABI/AAVE.json';
import DAI from './ABI/DAI.json';

const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

const DAI_OWNER = '0xf977814e90da44bfa03b6295a0616a897441acec';

const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';

const hre = require('hardhat');

async function main() {
  console.log('Starting...');
  const { ethers } = hre;

  console.log('Hijacking account with DAI');
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [DAI_OWNER],
  });

  let daiOwner = await hre.ethers.provider.getSigner(DAI_OWNER);

  console.log('Connecting to Aave adaptor');
  const aaveAdaptor = await hre.deployments.get(AAVE_ADAPTOR).then(async (deployment: Deployment) => {
    return await ethers.getContractAt(deployment.abi, deployment.address).then(async (contract: Contract) => {
      return contract.connect(daiOwner);
    });
  });

  const dai = await hre.ethers.getContractAt(DAI, DAI_ADDRESS, daiOwner);

  console.log("Transferring 10,000 dai to exchange adaptor's address");
  await dai.transfer(aaveAdaptor.address, oneEther.mul(10000));

  console.log('Depositing 400 DAI');
  await aaveAdaptor.deposit(DAI_ADDRESS, oneEther.mul(400));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
