# HAYQ Smart Contracts

## Overview

This directory contains the HAYQ token smart contracts and related infrastructure.

## Contracts

### Core Contracts

- **HAYQ.sol** - Main HAYQ ERC20 token with staking and buyback functionality
- **HAYQMiniMVP.sol** - Mini MVP token for liquidity
- **Erc20DividendTrackerUpgradeable.sol** - ERC20 dividend distribution tracker

### Supporting Contracts

- **VestingVault.sol** - Token vesting functionality
- **MultiSigTimelock.sol** - Multi-signature with timelock for governance
- **MockRouter.sol** - Router for token swaps (for testing)
- **MockERC20.sol** - Mock ERC20 token (for testing)
- **MockOracle.sol** - Mock price oracle (for testing)

## Contract Features

### HAYQ Token

1. **ERC20 Standard**
   - Full ERC20 implementation with 18 decimals
   - Snapshot support for governance
   - Initial supply: 1,000,000 HAYQ

2. **Staking**
   - `stake(uint256 amount)` - Stake HAYQ tokens (burns from balance)
   - `unstake(uint256 amount)` - Unstake HAYQ tokens (mints back to balance)
   - `staked(address)` - View staked balance

3. **Buyback**
   - `buyback(uint256 tokenAmount, uint256 minOut)` - Execute buyback via DEX router (owner only)
   - Swaps HAYQ for MiniMVP tokens through configured router
   - Requires router to be set via `setRouter(address)`

4. **Admin Functions**
   - `setRouter(address)` - Set DEX router address
   - `setMiniMVP(address)` - Set MiniMVP contract address
   - `snapshot()` - Create balance snapshot for governance
   - `mintMiniTokens(address, uint256)` - Mint MiniMVP tokens (owner only)

## Prerequisites

1. **Install Hardhat locally** (outside Lovable):
```bash
mkdir hayq-contracts
cd hayq-contracts
npm init -y
npm install --save-dev hardhat @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-ethers ethers
npx hardhat init
```

2. **Copy contract files** from `src/contracts/` to your hardhat project `contracts/` folder

3. **Install OpenZeppelin contracts**:
```bash
npm install @openzeppelin/contracts-upgradeable
```

4. **Create .env file**:
```env
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key
```

## Deployment

### Local Hardhat Network

1. **Start local node**:
```bash
npx hardhat node
```

2. **Deploy contracts** using the provided script:
```bash
npx hardhat run scripts/deployAndCopy.js --network localhost
```

This will:
- Deploy HAYQMiniMVP contract
- Deploy HAYQ token contract
- Deploy ERC20 Dividend Tracker
- Connect all contracts together
- Copy ABIs to frontend

3. **Update contract addresses** in `src/config/contracts.ts`:
```typescript
local: {
  address: 'YOUR_HAYQ_PROXY_ADDRESS',
  chainId: 31337,
}
```

### Sepolia Testnet

1. **Get Sepolia ETH** from faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. **Deploy to Sepolia**:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. **Verify contract**:
```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

4. **Update address** in `src/config/contracts.ts`:
```typescript
sepolia: {
  address: 'YOUR_SEPOLIA_ADDRESS',
  chainId: 11155111,
}
```

## Contract Functions Reference

### HAYQ Token - Core ERC20
- `name()` - Returns "HAYQ Token"
- `symbol()` - Returns "HAYQ"
- `decimals()` - Returns 18
- `totalSupply()` - Get total token supply
- `balanceOf(address)` - Get token balance
- `transfer(address, amount)` - Transfer tokens
- `approve(address, amount)` - Approve spending
- `allowance(owner, spender)` - Check allowance
- `transferFrom(address, address, amount)` - Transfer from approved

### HAYQ Token - Staking
- `stake(uint256 amount)` - Stake tokens (burns from balance, adds to staked mapping)
- `unstake(uint256 amount)` - Unstake tokens (mints back to balance, removes from staked)
- `staked(address)` - Get staked balance for an address

### HAYQ Token - Buyback
- `buyback(uint256 tokenAmount, uint256 minOut)` - Execute buyback (owner only)
- `router()` - Get current DEX router address
- `miniMVP()` - Get MiniMVP token address

### HAYQ Token - Admin
- `setRouter(address)` - Set DEX router (owner only)
- `setMiniMVP(address)` - Set MiniMVP contract (owner only)
- `snapshot()` - Create balance snapshot (owner only)
- `mintMiniTokens(address, uint256)` - Mint MiniMVP tokens (owner only)

### Dividend Tracker
- `distributeDividends(uint256)` - Distribute dividends to all holders
- `withdrawDividend()` - Claim available dividends
- `withdrawableDividendOf(address)` - Check claimable dividends
- `accumulativeDividendOf(address)` - Check total accumulated dividends
- `totalDividendsDistributed()` - Total distributed to date

### MultiSigTimelock - Governance
- `submit(address, uint256, bytes)` - Submit transaction (owner only)
- `confirm(uint256)` - Confirm transaction (owner only)
- `execute(uint256)` - Execute confirmed transaction after timelock (owner only)
- `MIN_DELAY` - Returns 2 days (172800 seconds)

## Testing

```bash
# Run all tests
npx hardhat test

# Run specific test
npx hardhat test test/HAYQ.test.js

# Run with gas report
REPORT_GAS=true npx hardhat test
```

## Upgrading Contract (UUPS)

```bash
npx hardhat run scripts/upgrade.js --network sepolia
```

## Useful Commands

```bash
# Check accounts
npx hardhat accounts

# Compile contracts
npx hardhat compile

# Clean artifacts
npx hardhat clean

# Show proxies
node scripts/show-proxies.js
```

## MetaMask Setup

1. **Add Hardhat Network**:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

2. **Add Sepolia Network**:
   - Network Name: Sepolia Testnet
   - RPC URL: https://rpc.sepolia.org
   - Chain ID: 11155111
   - Currency: ETH
   - Explorer: https://sepolia.etherscan.io

## ABI Location

After deployment, copy the ABI from:
```
hayq-contracts/artifacts/contracts/HAYQ.sol/HAYQ.json
```

To:
```
lovable-project/src/contracts/abis/HAYQ.json
```

Then update `src/hooks/useContract.ts` to import the full ABI.
