import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { EXCHANGE_ADAPTOR, ONE_INCH_ADDRESS } from './constants';

const func: DeployFunction = async function (bre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy(EXCHANGE_ADAPTOR, {
    from: deployer,
    log: true,
    args: [ONE_INCH_ADDRESS],
  });
};

export default func;

func.tags = [EXCHANGE_ADAPTOR];
