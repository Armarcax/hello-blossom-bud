import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { WEB3_CONFIG } from '@/config/web3';
import HAYQ_ABI from '@/contracts/abis/HAYQ.json';
import { formatDisplayNumber } from '@/utils/contractHelpers';

/**
 * Tokenomics data structure - single source of truth for all supply metrics
 */
export interface TokenomicsData {
  totalSupply: string;
  totalSupplyRaw: ethers.BigNumber;
  circulatingSupply: string;
  circulatingSupplyRaw: ethers.BigNumber;
  lockedSupply: string;
  lockedSupplyRaw: ethers.BigNumber;
  vestingVaultAddress: string | null;
  decimals: number;
  symbol: string;
  // Percentages for display
  circulatingPercent: number;
  lockedPercent: number;
}

/**
 * Fetches tokenomics data directly from on-chain
 * This is the SINGLE SOURCE OF TRUTH for all supply calculations
 */
const fetchTokenomics = async (): Promise<TokenomicsData> => {
  if (!WEB3_CONFIG.contractAddress || !WEB3_CONFIG.rpcUrl) {
    throw new Error('Contract not configured');
  }

  const provider = new ethers.providers.JsonRpcProvider(WEB3_CONFIG.rpcUrl);
  const contract = new ethers.Contract(
    WEB3_CONFIG.contractAddress,
    HAYQ_ABI.abi,
    provider
  );

  // Fetch all on-chain data in parallel
  const [totalSupplyRaw, decimals, symbol, vestingVaultAddress] = await Promise.all([
    contract.totalSupply() as Promise<ethers.BigNumber>,
    contract.decimals() as Promise<number>,
    contract.symbol() as Promise<string>,
    contract.vestingVault().catch(() => null) as Promise<string | null>,
  ]);

  // Calculate locked supply from vesting vault balance
  let lockedSupplyRaw = ethers.BigNumber.from(0);
  
  if (vestingVaultAddress && vestingVaultAddress !== ethers.constants.AddressZero) {
    try {
      lockedSupplyRaw = await contract.balanceOf(vestingVaultAddress);
    } catch {
      // Fallback: if we can't get vault balance, assume 999M locked
      lockedSupplyRaw = ethers.utils.parseUnits('999000000', decimals);
    }
  } else {
    // No vesting vault set - use known locked amount (999M)
    lockedSupplyRaw = ethers.utils.parseUnits('999000000', decimals);
  }

  // Circulating = Total - Locked
  const circulatingSupplyRaw = totalSupplyRaw.sub(lockedSupplyRaw);

  // Format for display
  const totalSupply = ethers.utils.formatUnits(totalSupplyRaw, decimals);
  const circulatingSupply = ethers.utils.formatUnits(circulatingSupplyRaw, decimals);
  const lockedSupply = ethers.utils.formatUnits(lockedSupplyRaw, decimals);

  // Calculate percentages
  const totalNum = parseFloat(totalSupply);
  const circulatingPercent = totalNum > 0 ? (parseFloat(circulatingSupply) / totalNum) * 100 : 0;
  const lockedPercent = totalNum > 0 ? (parseFloat(lockedSupply) / totalNum) * 100 : 0;

  return {
    totalSupply,
    totalSupplyRaw,
    circulatingSupply,
    circulatingSupplyRaw,
    lockedSupply,
    lockedSupplyRaw,
    vestingVaultAddress,
    decimals,
    symbol,
    circulatingPercent,
    lockedPercent,
  };
};

/**
 * Hook to fetch and cache tokenomics data
 * Uses React Query for efficient caching and background updates
 */
export const useTokenomics = () => {
  return useQuery({
    queryKey: ['tokenomics'],
    queryFn: fetchTokenomics,
    staleTime: 60 * 1000, // Consider fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 2,
  });
};

/**
 * Format supply number for human-readable display
 * Uses thousand separators, no scientific notation
 */
export const formatSupply = (value: string | number, maxDecimals = 0): string => {
  return formatDisplayNumber(value, maxDecimals);
};

/**
 * Format supply with abbreviation (e.g., 1B, 999M, 1M)
 */
export const formatSupplyAbbreviated = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (!isFinite(num) || isNaN(num)) return '0';
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1)}K`;
  }
  
  return formatDisplayNumber(num, 2);
};
