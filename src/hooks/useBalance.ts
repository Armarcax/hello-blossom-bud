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
      // Always fetch ERC20 balance
      const bal = await readContract.balanceOf(account);
      setBalance(ethers.utils.formatEther(bal));

      // Try to fetch staked balance if function exists
      let stakedVal = ethers.constants.Zero as any;
      if ((readContract as any).functions?.staked) {
        try {
          stakedVal = await readContract.staked(account);
        } catch (e) {
          console.warn('Staked fetch failed (optional):', e);
        }
      }
      setStakedBalance(ethers.utils.formatEther(stakedVal));

      // Try to fetch vesting rewards if functions exist
      let rewardsVal = ethers.constants.Zero as any;
      const hasVesting = (readContract as any).functions?.vestingTotal && (readContract as any).functions?.vestingReleased;
      if (hasVesting) {
        try {
          const vestingTotal = await readContract.vestingTotal(account);
          const vestingReleased = await readContract.vestingReleased(account);
          rewardsVal = vestingTotal.sub(vestingReleased);
        } catch (e) {
          console.warn('Vesting fetch failed (optional):', e);
        }
      }
      setRewards(ethers.utils.formatEther(rewardsVal));
      
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
