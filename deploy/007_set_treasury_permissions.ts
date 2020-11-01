import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { EXCHANGE_ADAPTOR, STREAM_MANAGER, TREASURY } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  const streamManager = await deployments.get(STREAM_MANAGER);
  const exchangeAdaptor = await deployments.get(EXCHANGE_ADAPTOR);

  console.log('Setting Stream Manager as Treasury Operator: ' + streamManager.address);
  await execute(TREASURY, { from: deployer, log: true }, 'setTreasuryOperator', streamManager.address);

  console.log('Setting Exchange Adaptor: ' + exchangeAdaptor.address);
  await execute(TREASURY, { from: deployer, log: true }, 'setExchangeAdaptor', exchangeAdaptor.address);
};

export default func;

func.tags = [TREASURY];
