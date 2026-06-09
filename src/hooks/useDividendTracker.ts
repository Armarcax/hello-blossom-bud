import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

// ABI for Dividend Trackers
const ERC20_DIVIDEND_ABI = [
  'function withdrawableDividendOf(address _owner) view returns(uint256)',
  'function accumulativeDividendOf(address _owner) view returns(uint256)',
  'function withdrawnDividends(address) view returns (uint256)',
  'function totalDividendsDistributed() view returns (uint256)',
  'function withdrawDividend()',
  'event DividendWithdrawn(address indexed to, uint256 tokens)',
];

const ETH_DIVIDEND_ABI = [
  'function withdrawableDividendOf(address _owner) view returns(uint256)',
  'function accumulativeDividendOf(address _owner) view returns(uint256)',
  'function withdrawnDividends(address) view returns (uint256)',
  'function totalDividendsDistributed() view returns (uint256)',
  'function withdrawDividend()',
  'event DividendWithdrawn(address indexed to, uint256 weiAmount)',
];

export const useDividendTracker = (erc20Address?: string, ethAddress?: string) => {
  const [erc20Dividends, setErc20Dividends] = useState<string>('0');
  const [ethDividends, setEthDividends] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  
  const { provider, signer, account, isConnected } = useWeb3();

  const erc20Contract = useMemo(() => {
    if (!provider || !erc20Address) return null;
    return new ethers.Contract(erc20Address, ERC20_DIVIDEND_ABI, signer || provider);
  }, [provider, signer, erc20Address]);

  const ethContract = useMemo(() => {
    if (!provider || !ethAddress) return null;
    return new ethers.Contract(ethAddress, ETH_DIVIDEND_ABI, signer || provider);
  }, [provider, signer, ethAddress]);

  const fetchDividends = async () => {
    if (!account || !isConnected) return;

    setLoading(true);
    try {
      const promises = [];
      
      if (erc20Contract) {
        promises.push(
          erc20Contract.withdrawableDividendOf(account).then((div: any) => 
            ethers.utils.formatEther(div)
          )
        );
      } else {
        promises.push(Promise.resolve('0'));
      }

      if (ethContract) {
        promises.push(
          ethContract.withdrawableDividendOf(account).then((div: any) => 
            ethers.utils.formatEther(div)
          )
        );
      } else {
        promises.push(Promise.resolve('0'));
      }

      const [erc20Div, ethDiv] = await Promise.all(promises);
      setErc20Dividends(erc20Div);
      setEthDividends(ethDiv);
    } catch (error) {
      console.error('Error fetching dividends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDividends();
    const interval = setInterval(fetchDividends, 15000);
    return () => clearInterval(interval);
  }, [erc20Contract, ethContract, account, isConnected]);

  const claimErc20Dividend = async () => {
    if (!erc20Contract || !signer) throw new Error('Contract not ready');
    const tx = await erc20Contract.withdrawDividend();
    await tx.wait();
    await fetchDividends();
  };

  const claimEthDividend = async () => {
    if (!ethContract || !signer) throw new Error('Contract not ready');
    const tx = await ethContract.withdrawDividend();
    await tx.wait();
    await fetchDividends();
  };

  return {
    erc20Dividends,
    ethDividends,
    loading,
    claimErc20Dividend,
    claimEthDividend,
    refresh: fetchDividends,
  };
};
