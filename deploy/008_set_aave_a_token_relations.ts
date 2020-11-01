import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { A_DAI, AAVE_ADAPTOR, DAI, TREASURY } from './constants';

const setATokenPair = 'setATokenPair';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`Setting DAI/aDAI pair: ${DAI} / ${A_DAI}`);
  await execute(AAVE_ADAPTOR, { from: deployer, log: true }, setATokenPair, DAI, A_DAI);
};

export default func;

func.tags = [TREASURY];
func.runAtTheEnd = true;
