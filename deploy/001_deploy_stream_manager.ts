import {
    BuidlerRuntimeEnvironment,
    DeployFunction,
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
    const {deployments, getNamedAccounts, ethers} = bre;
    const {deploy, get, execute} = deployments;

    const {deployer} = await getNamedAccounts();
    // console.log(deployer)
console.log(ethers)
    await ethers.getContract("Stream", deployer).then(console.log);

    // await ethers.getSigners()[deployer].then(console.log);

    // await deploy("StreamManager", {
    //     from: deployer,
    //     log: true,
    // });

    // const deployedStreamManager = await get("StreamManager");
    // const deployedStream = await get("Stream");
    //
    // const stream = await ethers.getContract(deployedStream.address, deployer);
    // console.log(stream);

};

export default func;

func.tags = ["Stream"];