import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { STREAM_MANAGER } from './constants';

const func: DeployFunction = async function (bre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy(STREAM_MANAGER, {
    from: deployer,
    log: true,
  });
};

export default func;

func.tags = [STREAM_MANAGER];
