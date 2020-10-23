import {
    BuidlerRuntimeEnvironment,
    DeployFunction,
} from "@nomiclabs/buidler/types";
import {TREASURY} from "./constants";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = bre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy(TREASURY, {
        from: deployer,
        log: true,
    });
};

export default func;

func.tags = [TREASURY];