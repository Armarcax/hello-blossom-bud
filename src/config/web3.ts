// Production Web3 Configuration
// All values are read from environment variables - no localhost fallbacks

export const WEB3_CONFIG = {
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111', 10),
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia.org',
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  networkName: import.meta.env.VITE_NETWORK_NAME || 'Sepolia Testnet',
  nativeCurrency: {
    name: import.meta.env.VITE_NATIVE_CURRENCY_NAME || 'ETH',
    symbol: import.meta.env.VITE_NATIVE_CURRENCY_SYMBOL || 'ETH',
    decimals: 18,
  },
  blockExplorer: import.meta.env.VITE_BLOCK_EXPLORER || 'https://sepolia.etherscan.io',
};

// Hex chain ID for MetaMask
export const getChainIdHex = () => `0x${WEB3_CONFIG.chainId.toString(16)}`;

// Network config for wallet_addEthereumChain
export const getNetworkConfig = () => ({
  chainId: getChainIdHex(),
  chainName: WEB3_CONFIG.networkName,
  nativeCurrency: WEB3_CONFIG.nativeCurrency,
  rpcUrls: [WEB3_CONFIG.rpcUrl],
  blockExplorerUrls: [WEB3_CONFIG.blockExplorer],
});

// Validate configuration
export const isConfigValid = () => {
  return !!WEB3_CONFIG.contractAddress && !!WEB3_CONFIG.chainId;
};
