// Copy this to your hardhat project: scripts/copy-abi.js
// This copies the compiled ABI to your React project

const fs = require("fs");
const path = require("path");

async function main() {
  // Source: Hardhat artifacts
  const artifactPath = path.join(
    __dirname,
    "../../artifacts/contracts/HAYQ.sol/HAYQ.json"
  );

  // Destination: Lovable React project
  // Adjust this path based on your project structure
  const destDir = path.join(__dirname, "../../../src/contracts/abis");
  const destPath = path.join(destDir, "HAYQ.json");

  if (!fs.existsSync(artifactPath)) {
    console.error("❌ Contract artifact not found. Please compile first:");
    console.error("   npx hardhat compile");
    process.exit(1);
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Read the full artifact
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Extract just the ABI
  const abiOnly = {
    contractName: artifact.contractName,
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    deployedBytecode: artifact.deployedBytecode
  };

  // Write to destination
  fs.writeFileSync(destPath, JSON.stringify(abiOnly, null, 2));

  console.log("✅ ABI copied successfully!");
  console.log("📁 From:", artifactPath);
  console.log("📁 To:", destPath);
  console.log("📊 ABI has", artifact.abi.length, "functions/events");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
