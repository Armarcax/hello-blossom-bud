# HAYQ Smart Contract Setup

## Prerequisites

1. **Install Hardhat locally** (outside Lovable):
```bash
mkdir hayq-contracts
cd hayq-contracts
npm init -y
npm install --save-dev hardhat @openzeppelin/hardhat-upgrades @nomiclabs/hardhat-ethers ethers
npx hardhat init
```

2. **Copy your HAYQ.sol contract** to `contracts/HAYQ.sol`

3. **Create .env file**:
```env
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key
```

## Deployment Steps

### Local Hardhat Network

1. **Start local node**:
```bash
npx hardhat node
```

2. **Deploy to local**:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. **Copy ABI**:
```bash
node scripts/copy-abi.js
```

4. **Update contract address** in `src/config/contracts.ts`:
```typescript
local: {
  address: 'YOUR_DEPLOYED_ADDRESS_HERE',
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

## Contract Functions Available

### Core ERC20
- `balanceOf(address)` - Get token balance
- `transfer(address, amount)` - Transfer tokens
- `approve(address, amount)` - Approve spending
- `allowance(owner, spender)` - Check allowance

### Staking
- `stake(amount)` - Stake tokens
- `unstake(amount)` - Unstake tokens
- `getStakedBalance(address)` - Get staked balance
- `getStakingRewards(address)` - Get pending rewards

### Dividends
- `claimDividends()` - Claim pending dividends
- `getDividends(address)` - Check pending dividends
- `totalDividendsDistributed()` - Total distributed

### Buyback
- `buybackAndBurn()` - Execute buyback (owner only)
- `getBuybackStats()` - Get buyback statistics

### Governance
- `createProposal(description, duration)` - Create vote
- `vote(proposalId, support)` - Cast vote
- `executeProposal(proposalId)` - Execute proposal
- `getProposal(proposalId)` - Get proposal details

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
