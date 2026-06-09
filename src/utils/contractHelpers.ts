import { ethers } from 'ethers';
import { WEB3_CONFIG } from '@/config/web3';

export const formatTokenAmount = (amount: ethers.BigNumber | string, decimals = 18): string => {
  try {
    return ethers.utils.formatUnits(amount, decimals);
  } catch {
    return '0';
  }
};

/**
 * Format a number for human-readable display with thousand separators
 * Prevents scientific notation (e.g. 4e+21)
 */
export const formatDisplayNumber = (value: string | number, maxDecimals = 4): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (!isFinite(num) || isNaN(num)) return '0';
  
  // Handle very small numbers
  if (Math.abs(num) < 0.0001 && num !== 0) {
    return num.toFixed(8).replace(/\.?0+$/, '');
  }
  
  // Handle very large numbers - use toFixed to avoid scientific notation
  // JavaScript's toFixed can fail for extremely large numbers, so we handle manually
  if (Math.abs(num) >= 1e15) {
    // For extremely large numbers, use BigInt-style string conversion
    const str = BigInt(Math.round(num)).toString();
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  // Format with thousand separators, avoiding scientific notation
  const fixed = num.toFixed(maxDecimals);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Remove trailing zeros from decimal part
  const cleanDec = decPart?.replace(/0+$/, '');
  
  return cleanDec ? `${formattedInt}.${cleanDec}` : formattedInt;
};

export const parseTokenAmount = (amount: string, decimals = 18): ethers.BigNumber => {
  try {
    return ethers.utils.parseUnits(amount, decimals);
  } catch {
    return ethers.BigNumber.from(0);
  }
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};

export const getExplorerUrl = (chainId: number, txOrAddress: string, type: 'address' | 'tx' = 'address'): string => {
  // Use env-configured block explorer, fallback to Etherscan
  const baseUrl = WEB3_CONFIG.blockExplorer || 'https://etherscan.io';
  return `${baseUrl}/${type}/${txOrAddress}`;
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
