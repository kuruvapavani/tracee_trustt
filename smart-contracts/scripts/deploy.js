const hre = require("hardhat");

async function main() {
  const ProductTraceability = await hre.ethers.getContractFactory("ProductTraceability");
  const contract = await ProductTraceability.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
