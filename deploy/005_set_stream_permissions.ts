import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { STREAM, STREAM_MANAGER, TREASURY } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const streamManager = await deployments.get(STREAM_MANAGER);

  console.log('Setting Stream Manager as Stream Operator: ' + streamManager.address);
  await execute(STREAM, { from: deployer, log: true }, 'setStreamOperator', streamManager.address);
};

export default func;

func.tags = [TREASURY];
