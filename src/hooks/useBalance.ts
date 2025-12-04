import { useBalanceQuery } from './useWeb3Query';

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
    dividends: '0', // Dividends come from separate dividend tracker contracts
    loading: query.isLoading,
    refresh: query.invalidate,
  };
};
