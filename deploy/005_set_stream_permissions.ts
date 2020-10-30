import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { STREAM, STREAM_MANAGER, TREASURY } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, ethers, deployments } = hre;
  const { provider } = ethers;

  const { deployer } = await getNamedAccounts();
  const deployerSigner = provider.getSigner(deployer);

  const streamManager = await deployments.get(STREAM_MANAGER);

  const stream = await deployments.get(STREAM).then((deployment) => {
    return ethers.getContractAt(deployment.abi, deployer).then((stream) => {
      return stream.connect(deployerSigner);
    });
  });

  console.log('Setting Stream Manager as Stream Operator: ' + streamManager.address);
  await stream.setStreamOperator(streamManager.address);
};

export default func;

func.tags = [TREASURY];
