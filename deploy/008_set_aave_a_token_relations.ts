import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { A_DAI_ADDRESS, AAVE_ADAPTOR, DAI_ADDRESS, TREASURY } from './constants';

const setATokenPair = 'setATokenPair';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`Setting DAI/aDAI pair: ${DAI_ADDRESS} / ${A_DAI_ADDRESS}`);
  await execute(AAVE_ADAPTOR, { from: deployer, log: true }, setATokenPair, DAI_ADDRESS, A_DAI_ADDRESS);
};

export default func;

func.tags = [TREASURY];
func.runAtTheEnd = true;
