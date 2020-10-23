import {BuidlerRuntimeEnvironment, DeployFunction,} from "@nomiclabs/buidler/types";
import {EXCHANGE_ADAPTOR, STREAM_MANAGER, TREASURY} from "./constants";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const {getNamedAccounts, ethers} = bre;
    const {getSigner, getContract} = ethers;

    const {deployer} = await getNamedAccounts();

    const streamManager = await getContract(STREAM_MANAGER);
    const exchangeAdaptor = await getContract(EXCHANGE_ADAPTOR);

    await getSigner(deployer).then(async signer => {
        await getContract(TREASURY, signer).then(
            async (treasury) => {
                console.log("Setting Stream Manager as Treasury Operator: " + streamManager.address);
                await treasury.setTreasuryOperator(streamManager.address);

                console.log("Setting Exchange Adaptor: " + exchangeAdaptor.address);
                await treasury.setExchangeAdaptor(exchangeAdaptor.address);
            }
        )
    });
};

export default func;

func.tags = [TREASURY];