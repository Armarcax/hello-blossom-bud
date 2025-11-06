// HAYQ Contract Configuration
export const CONTRACTS = {
  HAYQ: {
    // Local Hardhat
    local: {
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      chainId: 31337,
    },
    // Sepolia Testnet
    sepolia: {
      address: '0x7E5c8baC4447D8FA7010AEc8D400Face1b1BEC83',
      chainId: 11155111,
    },
  },
};

export const DIVIDEND_TRACKERS = {
  ERC20: {
    local: '', // Fill after deployment
    sepolia: '',
  },
  ETH: {
    local: '', // Fill after deployment
    sepolia: '',
  },
};

export const AUXILIARY_CONTRACTS = {
  VestingVault: {
    local: '',
    sepolia: '',
  },
  Staking: {
    local: '',
    sepolia: '',
  },
  MultiSig: {
    local: '',
    sepolia: '',
  },
  Registry: {
    local: '',
    sepolia: '',
  },
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
  throw new Error(`Unsupported chain ID: ${chainId}`);
};

export const getDividendTrackerAddress = (
  type: 'ERC20' | 'ETH',
  chainId: number
): string => {
  if (chainId === 31337) return DIVIDEND_TRACKERS[type].local;
  if (chainId === 11155111) return DIVIDEND_TRACKERS[type].sepolia;
  return '';
};
