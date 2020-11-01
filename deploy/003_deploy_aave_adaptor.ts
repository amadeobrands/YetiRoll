import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { AAVE_ADAPTOR, AAVE_ADDRESS, AAVE_TAKER_ADDRESS } from './constants';

const func: DeployFunction = async function (bre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy(AAVE_ADAPTOR, {
    from: deployer,
    log: true,
    args: [AAVE_ADDRESS, AAVE_TAKER_ADDRESS],
  });
};

export default func;

func.tags = [AAVE_ADAPTOR];
