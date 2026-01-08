import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useWeb3Context } from '@/contexts/Web3Context';
import { useContract } from './useContract';

export interface BalanceData {
  // formatted
  balance: string;
  stakedBalance: string;
  rewards: string;

  // raw
  rawTokenBalance: string;
  rawStakedBalance: string;
  rawRewards: string;

  decimalsUsed: number;
}

export const web3Keys = {
  all: ['web3'] as const,
  balances: (account: string) => [...web3Keys.all, 'balances', account] as const,
  tokenMetrics: () => [...web3Keys.all, 'tokenMetrics'] as const,
  staking: (account: string) => [...web3Keys.all, 'staking', account] as const,
  vesting: (account: string) => [...web3Keys.all, 'vesting', account] as const,
};

export const useBalanceQuery = () => {
  const { account, isConnected, isWrongNetwork } = useWeb3Context();
  const { readContract, tokenInfo } = useContract();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: web3Keys.balances(account),
    queryFn: async (): Promise<BalanceData> => {
      if (!readContract || !account) {
        return {
          balance: '0',
          stakedBalance: '0',
          rewards: '0',
          rawTokenBalance: '0',
          rawStakedBalance: '0',
          rawRewards: '0',
          decimalsUsed: tokenInfo.decimals ?? 18,
        };
      }

      try {
        const [tokenBal, stakedBal, vestingData] = await Promise.all([
          readContract.balanceOf(account),
          (readContract.staked?.(account).catch(() => ethers.constants.Zero) ?? Promise.resolve(ethers.constants.Zero)) as Promise<ethers.BigNumber>,
          Promise.all([
            (readContract.vestingTotal?.(account).catch(() => ethers.constants.Zero) ?? Promise.resolve(ethers.constants.Zero)) as Promise<ethers.BigNumber>,
            (readContract.vestingReleased?.(account).catch(() => ethers.constants.Zero) ?? Promise.resolve(ethers.constants.Zero)) as Promise<ethers.BigNumber>,
          ]),
        ]);

        const [vestingTotal, vestingReleased] = vestingData;
        const rewards = vestingTotal.sub(vestingReleased);

        const decimals = tokenInfo.decimals ?? 18;
        const formatValue = (val: ethers.BigNumber) => ethers.utils.formatUnits(val, decimals);

        return {
          balance: formatValue(tokenBal),
          stakedBalance: formatValue(stakedBal),
          rewards: formatValue(rewards),
          rawTokenBalance: tokenBal.toString(),
          rawStakedBalance: stakedBal.toString(),
          rawRewards: rewards.toString(),
          decimalsUsed: decimals,
        };
      } catch (error) {
        console.error('[web3] Failed to fetch balances:', error);
        return {
          balance: '0',
          stakedBalance: '0',
          rewards: '0',
          rawTokenBalance: '0',
          rawStakedBalance: '0',
          rawRewards: '0',
          decimalsUsed: tokenInfo.decimals ?? 18,
        };
      }
    },
    enabled: isConnected && !isWrongNetwork && !!readContract && !!account,
    staleTime: 10_000,
    gcTime: 60_000,
    refetchInterval: 15_000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: web3Keys.balances(account) });
  }, [queryClient, account]);

  const optimisticStake = useCallback(
    (amount: string) => {
      const amountNum = parseFloat(amount);
      queryClient.setQueryData<BalanceData>(web3Keys.balances(account), (old) => {
        if (!old) return old;
        return {
          ...old,
          balance: Math.max(0, parseFloat(old.balance) - amountNum).toString(),
          stakedBalance: (parseFloat(old.stakedBalance) + amountNum).toString(),
        };
      });
    },
    [queryClient, account]
  );

  const optimisticUnstake = useCallback(
    (amount: string) => {
      const amountNum = parseFloat(amount);
      queryClient.setQueryData<BalanceData>(web3Keys.balances(account), (old) => {
        if (!old) return old;
        return {
          ...old,
          balance: (parseFloat(old.balance) + amountNum).toString(),
          stakedBalance: Math.max(0, parseFloat(old.stakedBalance) - amountNum).toString(),
        };
      });
    },
    [queryClient, account]
  );

  const rollback = useCallback(
    (previousData: BalanceData | undefined) => {
      if (previousData) {
        queryClient.setQueryData(web3Keys.balances(account), previousData);
      }
    },
    [queryClient, account]
  );

  const getCachedData = useCallback((): BalanceData | undefined => {
    return queryClient.getQueryData<BalanceData>(web3Keys.balances(account));
  }, [queryClient, account]);

  return {
    ...query,
    balance: query.data?.balance ?? '0',
    stakedBalance: query.data?.stakedBalance ?? '0',
    rewards: query.data?.rewards ?? '0',

    rawTokenBalance: query.data?.rawTokenBalance ?? '0',
    rawStakedBalance: query.data?.rawStakedBalance ?? '0',
    rawRewards: query.data?.rawRewards ?? '0',
    decimalsUsed: query.data?.decimalsUsed ?? (tokenInfo.decimals ?? 18),

    invalidate,
    optimisticStake,
    optimisticUnstake,
    rollback,
    getCachedData,
  };
};

export const useTokenMetrics = () => {
  const { isConnected, isWrongNetwork } = useWeb3Context();
  const { readContract, tokenInfo } = useContract();

  return useQuery({
    queryKey: web3Keys.tokenMetrics(),
    queryFn: async () => {
      if (!readContract) {
        return { totalSupply: '0', stakingRatio: 0, timestamp: Date.now() };
      }

      try {
        const [totalSupply, totalStaked] = await Promise.all([
          readContract.totalSupply().catch(() => ethers.constants.Zero),
          (readContract.stakedBalanceOf?.('0x0000000000000000000000000000000000000000').catch(() => ethers.constants.Zero) ??
            Promise.resolve(ethers.constants.Zero)) as Promise<ethers.BigNumber>,
        ]);

        const decimals = tokenInfo.decimals ?? 18;
        const supply = parseFloat(ethers.utils.formatUnits(totalSupply, decimals));
        const staked = parseFloat(ethers.utils.formatUnits(totalStaked, decimals));
        const stakingRatio = supply > 0 ? (staked / supply) * 100 : 0;

        return {
          totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
          stakingRatio: Math.round(stakingRatio * 10) / 10,
          timestamp: Date.now(),
        };
      } catch (error) {
        console.error('[web3] Failed to fetch token metrics:', error);
        return { totalSupply: '0', stakingRatio: 0, timestamp: Date.now() };
      }
    },
    enabled: isConnected && !isWrongNetwork && !!readContract,
    staleTime: 30_000,
    gcTime: 120_000,
    refetchInterval: 60_000,
  });
};

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
