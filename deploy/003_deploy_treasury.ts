import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { TREASURY } from './constants';

const func: DeployFunction = async function (bre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy(TREASURY, {
    from: deployer,
    log: true,
  });
};

export default func;

func.tags = [TREASURY];
