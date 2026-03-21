
const hre = require("hardhat");

async function main() {
  console.log("Deploying DataProof contract to Avalanche Fuji...");

  const Contract = await hre.ethers.getContractFactory("DataProof");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  console.log("DataProof deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
