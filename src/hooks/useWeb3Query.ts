import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useWeb3Context } from '@/contexts/Web3Context';
import { useContract } from './useContract';

// Query key factory for consistent cache keys
export const web3Keys = {
  all: ['web3'] as const,
  balances: (account: string) => [...web3Keys.all, 'balances', account] as const,
  tokenMetrics: () => [...web3Keys.all, 'tokenMetrics'] as const,
  staking: (account: string) => [...web3Keys.all, 'staking', account] as const,
  vesting: (account: string) => [...web3Keys.all, 'vesting', account] as const,
};

// Optimized balance fetching with caching
export const useBalanceQuery = () => {
  const { account, isConnected } = useWeb3Context();
  const { readContract } = useContract();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: web3Keys.balances(account),
    queryFn: async () => {
      if (!readContract || !account) {
        return { balance: '0', stakedBalance: '0', rewards: '0' };
      }

      const [balance, stakedBalance, vestingData] = await Promise.all([
        readContract.balanceOf(account).catch(() => ethers.constants.Zero),
        readContract.staked?.(account).catch(() => ethers.constants.Zero) ?? Promise.resolve(ethers.constants.Zero),
        Promise.all([
          readContract.vestingTotal?.(account).catch(() => ethers.constants.Zero) ?? Promise.resolve(ethers.constants.Zero),
          readContract.vestingReleased?.(account).catch(() => ethers.constants.Zero) ?? Promise.resolve(ethers.constants.Zero),
        ]),
      ]);

      const [vestingTotal, vestingReleased] = vestingData;
      const rewards = vestingTotal.sub(vestingReleased);

      return {
        balance: ethers.utils.formatEther(balance),
        stakedBalance: ethers.utils.formatEther(stakedBalance),
        rewards: ethers.utils.formatEther(rewards),
      };
    },
    enabled: isConnected && !!readContract && !!account,
    staleTime: 10000, // 10 seconds
    gcTime: 60000, // 1 minute cache
    refetchInterval: 15000, // Auto-refresh every 15s
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: web3Keys.balances(account) });
  };

  return {
    ...query,
    balance: query.data?.balance ?? '0',
    stakedBalance: query.data?.stakedBalance ?? '0',
    rewards: query.data?.rewards ?? '0',
    invalidate,
  };
};

// Token metrics for charts with caching
export const useTokenMetrics = () => {
  const { isConnected } = useWeb3Context();
  const { readContract } = useContract();

  return useQuery({
    queryKey: web3Keys.tokenMetrics(),
    queryFn: async () => {
      if (!readContract) {
        return { totalSupply: '0', stakingRatio: 0 };
      }

      const [totalSupply, totalStaked] = await Promise.all([
        readContract.totalSupply().catch(() => ethers.constants.Zero),
        readContract.stakedBalanceOf?.('0x0000000000000000000000000000000000000000').catch(() => ethers.constants.Zero) ?? Promise.resolve(ethers.constants.Zero),
      ]);

      const supply = parseFloat(ethers.utils.formatEther(totalSupply));
      const staked = parseFloat(ethers.utils.formatEther(totalStaked));
      const stakingRatio = supply > 0 ? (staked / supply) * 100 : 0;

      return {
        totalSupply: ethers.utils.formatEther(totalSupply),
        stakingRatio: Math.round(stakingRatio * 10) / 10,
        timestamp: Date.now(),
      };
    },
    enabled: !!readContract,
    staleTime: 30000, // 30 seconds
    gcTime: 120000, // 2 minute cache
    refetchInterval: 60000, // Auto-refresh every minute
  });
};

// Hook to invalidate all Web3 queries (useful after transactions)
export const useInvalidateWeb3Queries = () => {
  const queryClient = useQueryClient();
  const { account } = useWeb3Context();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: web3Keys.all });
    },
    invalidateBalances: () => {
      queryClient.invalidateQueries({ queryKey: web3Keys.balances(account) });
    },
    invalidateMetrics: () => {
      queryClient.invalidateQueries({ queryKey: web3Keys.tokenMetrics() });
    },
  };
};
