import {BigNumber, Contract} from 'ethers';
import {A_DAI_ADDRESS, AAVE_ADAPTOR, DAI_ADDRESS} from '../deploy/constants';
import {Deployment} from 'hardhat-deploy/dist/types';
import DAI_ABI from './ABI/Erc20/DAI.json';
import A_TOKEN_ABI from './ABI/Aave/AToken.json';

const oneEther = BigNumber.from(1).mul(BigNumber.from(10).pow(18));

const DAI_OWNER = '0xf977814e90da44bfa03b6295a0616a897441acec';

const hre = require('hardhat');

async function main() {
  console.log('Starting...');
  const { ethers } = hre;

  console.log('Hijacking account with DAI');
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [DAI_OWNER],
  });

  console.log('Getting signer');
  let daiOwner = await hre.ethers.provider.getSigner(DAI_OWNER);

  console.log('Connecting to Aave adaptor');
  const aaveAdaptor = await hre.deployments.get(AAVE_ADAPTOR).then(async (deployment: Deployment) => {
    return await ethers.getContractAt(deployment.abi, deployment.address).then(async (contract: Contract) => {
      return contract.connect(daiOwner);
    });
  });

  console.log("Connecting to DAI");
  const dai = await hre.ethers.getContractAt(DAI_ABI, DAI_ADDRESS, daiOwner);
  const aDai = await hre.ethers.getContractAt(A_TOKEN_ABI, A_DAI_ADDRESS, daiOwner);

  console.log("Transferring 10,000 dai to exchange adaptor's address");
  await dai.transfer(aaveAdaptor.address, oneEther.mul(10000));

  console.log('Depositing 400 DAI');
  await aaveAdaptor.deposit(DAI_ADDRESS, oneEther.mul(400));

  console.log("Checking balances");
  await dai.balanceOf(aaveAdaptor.address).then((balance: BigNumber) => {
    console.log("DAI balance of Aave Adaptor is " + balance.toString());
  });

  await aDai.balanceOf(aaveAdaptor.address).then((balance: BigNumber) => {
    console.log("A Token DAI balance of Aave Adaptor is " + balance.toString());
  });


  await aDai.balanceOf(DAI_OWNER).then((balance: BigNumber) => {
    console.log("A Token DAI balance of DAI Owner is " + balance.toString())
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
