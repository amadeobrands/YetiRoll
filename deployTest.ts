import {providers} from "ethers";

import {StreamCompanyFactory} from "./typechain"

async function main() {
    const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const factory = new StreamCompanyFactory(provider.getSigner());
    console.log(factory);
    const contract = await factory.deploy()
    await contract.deployed()


    console.log(contract.address)
    await contract.topUp({value: 100})


    // We get the contract to deploy
    //
    // await greeter.deployed();
    //
    // console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });