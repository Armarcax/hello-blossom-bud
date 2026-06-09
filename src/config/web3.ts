/**
 * Production Web3 Configuration
 * All values MUST be set via environment variables for mainnet deployment.
 * No fallbacks to testnet or localhost — env vars are required.
 */

export const WEB3_CONFIG = {
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '1', 10), // Default to Ethereum Mainnet
  rpcUrl: import.meta.env.VITE_RPC_URL || '',
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  networkName: import.meta.env.VITE_NETWORK_NAME || 'Ethereum Mainnet',
  nativeCurrency: {
    name: import.meta.env.VITE_NATIVE_CURRENCY_NAME || 'ETH',
    symbol: import.meta.env.VITE_NATIVE_CURRENCY_SYMBOL || 'ETH',
    decimals: 18,
  },
  blockExplorer: import.meta.env.VITE_BLOCK_EXPLORER || 'https://etherscan.io',
};

// Hex chain ID for MetaMask
export const getChainIdHex = () => `0x${WEB3_CONFIG.chainId.toString(16)}`;

// Network config for wallet_addEthereumChain
export const getNetworkConfig = () => ({
  chainId: getChainIdHex(),
  chainName: WEB3_CONFIG.networkName,
  nativeCurrency: WEB3_CONFIG.nativeCurrency,
  rpcUrls: WEB3_CONFIG.rpcUrl ? [WEB3_CONFIG.rpcUrl] : [],
  blockExplorerUrls: [WEB3_CONFIG.blockExplorer],
});

// Validate configuration — all critical env vars must be present
export const isConfigValid = () => {
  return !!WEB3_CONFIG.contractAddress && !!WEB3_CONFIG.chainId && !!WEB3_CONFIG.rpcUrl;
};
