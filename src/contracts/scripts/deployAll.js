import { ethers, upgrades } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("🚀 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()));

    // --- 1. Deploy Mock Contracts (for testing) ---
    console.log("\n📦 Deploying Mock Contracts...");
    
    const MockERC20 = await ethers.getContractFactory("MockERC20Upgradeable");
    const mockRewardToken = await upgrades.deployProxy(MockERC20, ["Reward Token", "RWD", ethers.utils.parseEther("1000000")]);
    await mockRewardToken.deployed();
    console.log("✅ MockERC20 (Reward Token) deployed at:", mockRewardToken.address);

    const MockRouter = await ethers.getContractFactory("MockRouter");
    const mockRouter = await MockRouter.deploy();
    await mockRouter.deployed();
    console.log("✅ MockRouter deployed at:", mockRouter.address);

    const MockOracle = await ethers.getContractFactory("MockOracleV2");
    const mockOracle = await upgrades.deployProxy(MockOracle, []);
    await mockOracle.deployed();
    console.log("✅ MockOracle deployed at:", mockOracle.address);

    // --- 2. Deploy Main HAYQ Token ---
    console.log("\n📦 Deploying HAYQ Token...");
    const HAYQ = await ethers.getContractFactory("HAYQMiniMVP");
    const hayq = await upgrades.deployProxy(HAYQ, [1000000, mockRouter.address], { initializer: "initialize" });
    await hayq.deployed();
    console.log("✅ HAYQ Token deployed at:", hayq.address);

    // --- 3. Deploy Vesting Vault ---
    console.log("\n📦 Deploying Vesting Vault...");
    const VestingVault = await ethers.getContractFactory("VestingVaultUpgradeable");
    const vestingVault = await upgrades.deployProxy(VestingVault, [hayq.address, hayq.address]);
    await vestingVault.deployed();
    console.log("✅ VestingVault deployed at:", vestingVault.address);

    // Connect vesting vault to HAYQ
    await hayq.setVestingVault(vestingVault.address);
    await hayq.setVestingVaultReadable(vestingVault.address);
    console.log("✅ Vesting Vault connected to HAYQ");

    // --- 4. Deploy Dividend Trackers ---
    console.log("\n📦 Deploying Dividend Trackers...");
    
    const Erc20Tracker = await ethers.getContractFactory("Erc20DividendTrackerUpgradeable");
    const erc20Tracker = await upgrades.deployProxy(Erc20Tracker, [mockRewardToken.address, hayq.address]);
    await erc20Tracker.deployed();
    console.log("✅ ERC20 Dividend Tracker deployed at:", erc20Tracker.address);

    const EthTracker = await ethers.getContractFactory("EthDividendTrackerUpgradeable");
    const ethTracker = await upgrades.deployProxy(EthTracker, [hayq.address]);
    await ethTracker.deployed();
    console.log("✅ ETH Dividend Tracker deployed at:", ethTracker.address);

    // --- 5. Deploy Staking (Optional) ---
    console.log("\n📦 Deploying Staking Contract...");
    const Staking = await ethers.getContractFactory("HAYQStakingUpgradeable");
    const staking = await upgrades.deployProxy(Staking, [hayq.address, 10]); // 10% APY
    await staking.deployed();
    console.log("✅ Staking Contract deployed at:", staking.address);

    // --- 6. Deploy MultiSig Timelock ---
    console.log("\n📦 Deploying MultiSig Timelock...");
    const MultiSig = await ethers.getContractFactory("MultiSigTimelockUpgradeable");
    const multiSig = await upgrades.deployProxy(MultiSig, [[deployer.address], 1]);
    await multiSig.deployed();
    console.log("✅ MultiSig Timelock deployed at:", multiSig.address);

    // --- 7. Deploy Registry ---
    console.log("\n📦 Deploying Registry...");
    const Registry = await ethers.getContractFactory("RegistryUpgradeable");
    const registry = await upgrades.deployProxy(Registry, []);
    await registry.deployed();
    console.log("✅ Registry deployed at:", registry.address);

    // Register modules
    await registry.registerModule(ethers.utils.formatBytes32String("HAYQ"), hayq.address);
    await registry.registerModule(ethers.utils.formatBytes32String("VESTING"), vestingVault.address);
    await registry.registerModule(ethers.utils.formatBytes32String("ERC20_DIV"), erc20Tracker.address);
    await registry.registerModule(ethers.utils.formatBytes32String("ETH_DIV"), ethTracker.address);
    await registry.registerModule(ethers.utils.formatBytes32String("STAKING"), staking.address);
    await registry.registerModule(ethers.utils.formatBytes32String("MULTISIG"), multiSig.address);
    console.log("✅ All modules registered in Registry");

    // --- 8. Save addresses to frontend config ---
    console.log("\n📝 Saving contract addresses...");
    const addresses = {
        HAYQ: hayq.address,
        VestingVault: vestingVault.address,
        Erc20DividendTracker: erc20Tracker.address,
        EthDividendTracker: ethTracker.address,
        Staking: staking.address,
        MultiSig: multiSig.address,
        Registry: registry.address,
        MockRouter: mockRouter.address,
        MockRewardToken: mockRewardToken.address,
        MockOracle: mockOracle.address,
    };

    const configPath = path.join(__dirname, "..", "..", "config", "contracts.ts");
    const configContent = `// Auto-generated contract addresses
export const CONTRACTS = {
  HAYQ: {
    local: { address: '${hayq.address}', chainId: 31337 },
    sepolia: { address: '', chainId: 11155111 },
  },
};

export const DIVIDEND_TRACKERS = {
  ERC20: { local: '${erc20Tracker.address}', sepolia: '' },
  ETH: { local: '${ethTracker.address}', sepolia: '' },
};

export const AUXILIARY_CONTRACTS = {
  VestingVault: { local: '${vestingVault.address}', sepolia: '' },
  Staking: { local: '${staking.address}', sepolia: '' },
  MultiSig: { local: '${multiSig.address}', sepolia: '' },
  Registry: { local: '${registry.address}', sepolia: '' },
};

export const SUPPORTED_CHAINS = {
  31337: {
    name: 'Hardhat Local',
    rpc: 'http://127.0.0.1:8545',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  11155111: {
    name: 'Sepolia Testnet',
    rpc: 'https://rpc.sepolia.org',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
};

export const getContractAddress = (chainId: number): string => {
  if (chainId === 31337) return CONTRACTS.HAYQ.local.address;
  if (chainId === 11155111) return CONTRACTS.HAYQ.sepolia.address;
  throw new Error(\`Unsupported chain ID: \${chainId}\`);
};

export const getDividendTrackerAddress = (type: 'ERC20' | 'ETH', chainId: number): string => {
  if (chainId === 31337) return DIVIDEND_TRACKERS[type].local;
  if (chainId === 11155111) return DIVIDEND_TRACKERS[type].sepolia;
  return '';
};
`;

    fs.writeFileSync(configPath, configContent);
    console.log("✅ Contract addresses saved to:", configPath);

    // --- 9. Copy ABIs ---
    console.log("\n📝 Copying ABIs...");
    const abisDir = path.join(__dirname, "..", "abis");
    if (!fs.existsSync(abisDir)) fs.mkdirSync(abisDir, { recursive: true });

    const contractsToCopy = [
        { name: "HAYQMiniMVP", contract: hayq },
        { name: "VestingVaultUpgradeable", contract: vestingVault },
        { name: "Erc20DividendTrackerUpgradeable", contract: erc20Tracker },
        { name: "EthDividendTrackerUpgradeable", contract: ethTracker },
        { name: "HAYQStakingUpgradeable", contract: staking },
        { name: "MultiSigTimelockUpgradeable", contract: multiSig },
        { name: "RegistryUpgradeable", contract: registry },
    ];

    for (const c of contractsToCopy) {
        const artifact = await ethers.getContractAt(c.name, c.contract.address);
        const abiPath = path.join(abisDir, `${c.name}.json`);
        fs.writeFileSync(abiPath, JSON.stringify(artifact.interface.format(ethers.utils.FormatTypes.json), null, 2));
        console.log(`✅ ABI written for: ${c.name}`);
    }

    console.log("\n✨ All contracts deployed successfully!");
    console.log("\n📋 Summary:");
    console.log(JSON.stringify(addresses, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
