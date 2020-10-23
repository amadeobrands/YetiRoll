import {BuidlerRuntimeEnvironment, DeployFunction,} from "@nomiclabs/buidler/types";
import {EXCHANGE_ADAPTOR, STREAM, STREAM_MANAGER, TREASURY} from "./constants";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const {getNamedAccounts, ethers} = bre;
    const {getSigner, getContract} = ethers;

    const {deployer} = await getNamedAccounts();

    const streamManager = await getContract(STREAM_MANAGER);

    await getSigner(deployer).then(async signer => {
        await getContract(STREAM, signer).then(
            async (stream) => {
                console.log("Setting Stream Manager as Stream Operator: " + streamManager.address);
                await stream.setStreamOperator(streamManager.address);
            }
        )
    });
};

export default func;

func.tags = [TREASURY];