const { ethers, network } = require("hardhat");

async function main() {
  console.log("[Deployement]");
  const contract = await ethers.deployContract("MeltingPotesFactory");
  await contract.waitForDeployment();
  const { hash, blockNumber } = contract.deploymentTransaction()

  console.log(`MeltingPotesFactory deployed on ${network.name}`);
  console.log("Contract Address :",contract.target);
  console.log("Transaction Hash :",hash);
  console.log("Block number :",blockNumber);

  //create new instances
  const [owner, par1, part2] = await ethers.getSigners();
  await contract.createMeltingPotesContracts("first instance", 5000000000, 1703074776, "Lary");
  await contract.createMeltingPotesContracts("second instance", 6000000000, 1706074776, "Arnaud");
  const firstInstanceAddress = await contract.getUserInstanceAddress(owner.address, 0);
  const secondInstanceAddress = await contract.getUserInstanceAddress(owner.address, 1);

  console.log("first instance address: ",firstInstanceAddress);
  console.log("second instance address: ",secondInstanceAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});