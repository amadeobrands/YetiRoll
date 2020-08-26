import {ethers, providers} from "ethers";

import {StreamCompanyFactory} from "./typechain"

async function main() {
    const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const factory = new StreamCompanyFactory(provider.getSigner());
    const contract = await factory.deploy()
    await contract.deployed()
    await contract.topUp({value: 100})

    await provider.getBalance(contract.address).then(console.log);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });