import {
    BuidlerRuntimeEnvironment,
    DeployFunction,
} from "@nomiclabs/buidler/types";

import {Stream} from "../typechain/Stream";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const {deployments, getNamedAccounts, ethers} = bre;
    const {deploy} = deployments;
    const {getSigner} = ethers;

    const {deployer} = await getNamedAccounts();

    const deployedStream = await getSigner(deployer).then(async signer => {
        return (await ethers.getContract("Stream", signer)) as Stream;
    });

    await deploy("StreamManager", {
        from: deployer,
        log: true,
    });

    const streamManager = await ethers.getContract("StreamManager");

    await deployedStream.setStreamOperator(streamManager.address);
};

export default func;

func.tags = ["Stream"];