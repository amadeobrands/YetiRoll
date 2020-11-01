import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { EXCHANGE_ADAPTOR, STREAM_MANAGER, TREASURY } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, ethers, deployments } = hre;
  const { provider } = ethers;

  const { deployer } = await getNamedAccounts();
  const deployerSigner = provider.getSigner(deployer);

  const streamManager = await deployments.get(STREAM_MANAGER);
  const exchangeAdaptor = await deployments.get(EXCHANGE_ADAPTOR);

  const treasury = await deployments.get(TREASURY).then((deployment) => {
    return ethers.getContractAt(deployment.abi, deployer).then((treasury) => {
      return treasury.connect(deployerSigner);
    });
  });

  console.log('Setting Stream Manager as Treasury Operator: ' + streamManager.address);
  await treasury.setTreasuryOperator(streamManager.address);

  console.log('Setting Exchange Adaptor: ' + exchangeAdaptor.address);
  await treasury.setExchangeAdaptor(exchangeAdaptor.address);
};

export default func;

func.tags = [TREASURY];
