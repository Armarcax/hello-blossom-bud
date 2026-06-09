// Example deploy script for local Hardhat network
// Copy this to your hardhat project: scripts/deploy.js

const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🚀 Deploying HAYQ contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Get contract factory
  const HAYQ = await ethers.getContractFactory("HAYQ");

  // Deploy with UUPS proxy
  console.log("Deploying proxy...");
  const hayq = await upgrades.deployProxy(
    HAYQ,
    ["HAYQ Token", "HAYQ"], // constructor args
    {
      initializer: "initialize",
      kind: "uups"
    }
  );

  await hayq.deployed();

  console.log("✅ HAYQ deployed successfully!");
  console.log("📌 Proxy address:", hayq.address);
  console.log("📌 Implementation address:", await upgrades.erc1967.getImplementationAddress(hayq.address));

  // Optional: Mint some initial tokens
  const mintAmount = ethers.utils.parseEther("1000000"); // 1M tokens
  const tx = await hayq.mint(deployer.address, mintAmount);
  await tx.wait();
  console.log("✅ Minted", ethers.utils.formatEther(mintAmount), "HAYQ to deployer");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: "hardhat",
    proxy: hayq.address,
    implementation: await upgrades.erc1967.getImplementationAddress(hayq.address),
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
