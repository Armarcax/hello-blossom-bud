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
    local: '',
    sepolia: '0x2837077b63f8C2681b1eb0D5a776E638BA028e58',
  },
  ETH: {
    local: '',
    sepolia: '0x6e28b827C29e574389ad6021Da8af91B0eDE134E',
  },
};

export const AUXILIARY_CONTRACTS = {
  VestingVault: {
    local: '',
    sepolia: '0x45615F3D52262ba7F16d7E0182893492F1752baB',
  },
  Staking: {
    local: '',
    sepolia: '0x054f0CD967656df38853b61E3804Ba4fa7783bA8',
  },
  MultiSig: {
    local: '',
    sepolia: '0x88B60b88B1F1667C13926d9F97E081069E3e65bD',
  },
  Registry: {
    local: '',
    sepolia: '0xe0E4126c92De0C69bc69FEd3BeeE5072528E8661',
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
