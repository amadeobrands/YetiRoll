import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { STREAM, STREAM_MANAGER, TREASURY } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const stream = await deployments.get(STREAM);
  const treasury = await deployments.get(TREASURY);

  console.log('Setting Stream: ' + stream.address);
  await execute(STREAM_MANAGER, { from: deployer, log: true }, 'setStream', stream.address);

  console.log('Setting Treasury: ' + treasury.address);
  await execute(STREAM_MANAGER, { from: deployer, log: true }, 'setTreasury', treasury.address);
};

export default func;

func.tags = [TREASURY];
