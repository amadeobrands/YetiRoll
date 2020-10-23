import {BuidlerRuntimeEnvironment, DeployFunction,} from "@nomiclabs/buidler/types";
import {EXCHANGE_ADAPTOR, STREAM, STREAM_MANAGER, TREASURY} from "./constants";
import {id} from "ethers/lib/utils";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const {getNamedAccounts, ethers} = bre;
    const {getSigner, getContract} = ethers;

    const {deployer} = await getNamedAccounts();

    const stream = await getContract(STREAM);
    const treasury = await getContract(TREASURY);

    await getSigner(deployer).then(async signer => {
        await getContract(STREAM_MANAGER, signer).then(
            async (streamManager) => {
                console.log("Setting Stream: " + stream.address);
                await streamManager.setStream(stream.address);

                console.log("Setting Treasury: " + treasury.address);
                await streamManager.setTreasury(treasury.address);
            }
        )
    });
};

export default func;

func.tags = [TREASURY];