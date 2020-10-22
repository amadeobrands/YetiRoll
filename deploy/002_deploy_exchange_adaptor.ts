import {
    BuidlerRuntimeEnvironment,
    DeployFunction,
} from "@nomiclabs/buidler/types";
import {EXCHANGE_ADAPTOR} from "./constants";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = bre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy(EXCHANGE_ADAPTOR, {
        from: deployer,
        log: true,
    });
};

export default func;

func.tags = [EXCHANGE_ADAPTOR];