const { ethers, network } = require("hardhat");

async function main() {
  console.log("[Deployement]");

  const [owner, part1, part2, authAddr4] = await ethers.getSigners();
  const constructorArgs = [owner.address,"Good try", 5000000000, 1703074776, "Lary"]
  const contract = await ethers.deployContract("MeltingPotes", constructorArgs);
  await contract.waitForDeployment();
  const { hash, blockNumber } = contract.deploymentTransaction();

  console.log(`MeltingPotes deployed on ${network.name}`);
  console.log("Contract Address :",contract.target);
  console.log("Transaction Hash :",hash);
  console.log("Block number :",blockNumber);

    // Add two participants
    await contract.addParticipant(part1, "Marilou", true)
    await contract.addParticipant(part2, "Matthieu", true)
  
    // add authorizedAddress
    await contract.addAuthorizedAddress(authAddr4, "Booking.com");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
