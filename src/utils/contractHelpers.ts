import { ethers } from 'ethers';

export const formatTokenAmount = (amount: ethers.BigNumber | string, decimals = 18): string => {
  try {
    return ethers.utils.formatUnits(amount, decimals);
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

export const parseTokenAmount = (amount: string, decimals = 18): ethers.BigNumber => {
  try {
    return ethers.utils.parseUnits(amount, decimals);
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return ethers.BigNumber.from(0);
  }
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};

export const getExplorerUrl = (chainId: number, address: string, type: 'address' | 'tx' = 'address'): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    31337: 'http://localhost:8545', // Hardhat local
  };

  const baseUrl = explorers[chainId] || explorers[1];
  return `${baseUrl}/${type}/${address}`;
};

export const waitForTransaction = async (
  tx: ethers.ContractTransaction,
  confirmations = 1
): Promise<ethers.ContractReceipt> => {
  return await tx.wait(confirmations);
};

export const handleContractError = (error: any): string => {
  if (error.code === 'ACTION_REJECTED') {
    return 'Transaction was rejected by user';
  }
  
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for transaction';
  }
  
  if (error.message) {
    // Try to extract revert reason
    const reason = error.message.match(/reason="(.+?)"/)?.[1];
    if (reason) return reason;
    
    // Return first part of error message
    return error.message.split('\n')[0];
  }
  
  return 'Transaction failed. Please try again.';
};
