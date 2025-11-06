import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWeb3Context } from '@/contexts/Web3Context';

export const useBalance = () => {
  const [balance, setBalance] = useState<string>('0');
  const [stakedBalance, setStakedBalance] = useState<string>('0');
  const [rewards, setRewards] = useState<string>('0');
  const [dividends, setDividends] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  
  const { readContract } = useContract();
  const { account, isConnected } = useWeb3Context();

  const fetchBalances = async () => {
    if (!isConnected || !account) {
      setBalance('0');
      setStakedBalance('0');
      setRewards('0');
      setDividends('0');
      return;
    }

    if (!readContract) {
      console.error('Contract not available on this network');
      setBalance('0');
      setStakedBalance('0');
      setRewards('0');
      setDividends('0');
      return;
    }

    setLoading(true);
    try {
      const [bal, staked, vestingTotal, vestingReleased] = await Promise.all([
        readContract.balanceOf(account),
        readContract.staked(account),
        readContract.vestingTotal(account),
        readContract.vestingReleased(account),
      ]);

      setBalance(ethers.utils.formatEther(bal));
      setStakedBalance(ethers.utils.formatEther(staked));
      
      // Calculate vesting rewards (total - released)
      const vestingReward = vestingTotal.sub(vestingReleased);
      setRewards(ethers.utils.formatEther(vestingReward));
      
      // Dividends come from separate dividend tracker contracts
      setDividends('0');
    } catch (error) {
      console.error('Error fetching balances:', error);
      setBalance('0');
      setStakedBalance('0');
      setRewards('0');
      setDividends('0');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
    
    const interval = setInterval(fetchBalances, 15000); // Update every 15s
    return () => clearInterval(interval);
  }, [readContract, account, isConnected]);

  return {
    balance,
    stakedBalance,
    rewards,
    dividends,
    loading,
    refresh: fetchBalances,
  };
};
