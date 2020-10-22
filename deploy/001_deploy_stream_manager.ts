import {
    BuidlerRuntimeEnvironment,
    DeployFunction,
} from "@nomiclabs/buidler/types";

import {Stream} from "../typechain/Stream";
import {id} from "ethers/lib/utils";
import {STREAM, STREAM_MANAGER} from "./constants";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const {deployments, getNamedAccounts, ethers} = bre;
    const {deploy} = deployments;
    const {getSigner} = ethers;

    const {deployer} = await getNamedAccounts();

    const deployedStream = await getSigner(deployer).then(async signer => {
        return (await ethers.getContract(STREAM, signer)) as Stream;
    });

    await deploy(STREAM_MANAGER, {
        from: deployer,
        log: true,
    });

    const streamManager = await ethers.getContract(STREAM_MANAGER);

    await deployedStream.setStreamOperator(streamManager.address);

     await deployedStream.hasRole(id("STREAM_OPERATOR"), streamManager.address).then(hasOperatorRole => {
         if(!hasOperatorRole) {
            throw new Error("Unable to set Operator Role");
         }
    });
};

export default func;

func.tags = [STREAM_MANAGER];