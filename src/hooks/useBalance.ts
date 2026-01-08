import { useBalanceQuery, BalanceData } from './useWeb3Query';

/**
 * @deprecated Use useBalanceQuery from useWeb3Query for better caching
 * This hook is kept for backward compatibility
 */
export const useBalance = () => {
  const query = useBalanceQuery();

  return {
    balance: query.balance,
    stakedBalance: query.stakedBalance,
    rewards: query.rewards,

    // raw debug values
    rawTokenBalance: query.rawTokenBalance,
    rawStakedBalance: query.rawStakedBalance,
    rawRewards: query.rawRewards,
    decimalsUsed: query.decimalsUsed,

    dividends: '0', // Dividends come from separate dividend tracker contracts
    loading: query.isLoading,
    refresh: query.invalidate,

    // Optimistic update helpers
    optimisticStake: query.optimisticStake,
    optimisticUnstake: query.optimisticUnstake,
    rollback: query.rollback,
    getCachedData: query.getCachedData,
  };
};

export type { BalanceData };
