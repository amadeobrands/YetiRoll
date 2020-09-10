//https://forum.openzeppelin.com/t/openzeppelin-buidler-upgrades/3580

const {ethers, upgrades} = require("@nomiclabs/buidler");

// Highly doubt this would work - just boilerplate
async function main() {
  const Stream = await ethers.getContractFactory("Stream");
  console.log("Deploying Stream...");
  const stream = await upgrades.deployProxy(Stream, [42], {
    initializer: "store",
  });
  console.log("Stream deployed to:", stream.address);
}

main();
