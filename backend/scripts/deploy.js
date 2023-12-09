const { ethers, network } = require("hardhat");

async function main() {
  console.log("[Deployement]");
  const contract = await ethers.deployContract("MeltingPotesFactory");
  await contract.waitForDeployment();
  const { hash, blockNumber } = contract.deploymentTransaction();

  console.log(`MeltingPotesFactory deployed on ${network.name}`);
  console.log("Contract Address :",contract.target);
  console.log("Transaction Hash :",hash);
  console.log("Block number :",blockNumber);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
