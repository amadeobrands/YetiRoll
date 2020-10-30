import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { EXCHANGE_ADAPTOR, STREAM, STREAM_MANAGER, TREASURY } from './constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, ethers, deployments } = hre;
  const { provider } = ethers;

  const { deployer } = await getNamedAccounts();
  const deployerSigner = provider.getSigner(deployer);

  const stream = await deployments.get(STREAM);
  const treasury = await deployments.get(TREASURY);

  const streamManager = await deployments.get(STREAM_MANAGER).then((deployment) => {
    return ethers.getContractAt(deployment.abi, deployer).then((streamManager) => {
      return streamManager.connect(deployerSigner);
    });
  });

  console.log('Setting Stream: ' + stream.address);
  await streamManager.setStream(stream.address);

  console.log('Setting Treasury: ' + treasury.address);
  await streamManager.setTreasury(treasury.address);
};

export default func;

func.tags = [TREASURY];
