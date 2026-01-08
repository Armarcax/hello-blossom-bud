import { useMemo, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WEB3_CONFIG } from '@/config/web3';
import { useWeb3Context } from '@/contexts/Web3Context';

// ERC20 + HAYQ Extended ABI
const HAYQ_ABI = [
  // ERC20 Standard
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  
  // Staking
  'function stake(uint256 amount)',
  'function unstake(uint256 amount)',
  'function staked(address account) view returns (uint256)',
  'function stakedBalanceOf(address user) view returns (uint256)',
  
  // Snapshot
  'function snapshot()',
  
  // Buyback
  'function buyback(uint256 tokenAmount, uint256 minOut)',
  
  // Vesting
  'function setVestingVault(address _vault)',
  'function setVestingVaultReadable(address _vault)',
  'function createTeamVesting(address beneficiary, uint256 amount, uint64 start, uint64 duration)',
  'function vestingTotal(address user) view returns (uint256)',
  'function vestingReleased(address user) view returns (uint256)',
  
  // Router & MiniMVP
  'function router() view returns (address)',
  'function miniMVP() view returns (address)',
  'function setRouter(address _router)',
  'function setMiniMVP(address _mini)',
  'function vestingVault() view returns (address)',
  'function allowanceToRouter(address user) view returns (uint256)',
  
  // Mint
  'function mint(address to, uint256 amount)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Staked(address indexed user, uint256 amount)',
  'event Unstaked(address indexed user, uint256 amount)',
  'event Buyback(uint256 tokens, uint256 minOut)',
  'event TeamVestingCreated(address indexed beneficiary, uint256 amount, uint64 start, uint64 duration)',
];

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export const useContract = () => {
  const { provider, signer, chainId, isConnected, isWrongNetwork, targetChainId } = useWeb3Context();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ name: '', symbol: 'HAYQ', decimals: 18 });
  const [contractError, setContractError] = useState<string | null>(null);

  const contractAddress = WEB3_CONFIG.contractAddress;

  const contract = useMemo(() => {
    if (!provider || !contractAddress || isWrongNetwork) return null;

    try {
      return new ethers.Contract(
        contractAddress,
        HAYQ_ABI,
        signer || provider
      );
    } catch (error) {
      console.error('Contract initialization error:', error);
      setContractError('Failed to initialize contract');
      return null;
    }
  }, [provider, signer, contractAddress, isWrongNetwork]);

  const readContract = useMemo(() => {
    if (!provider || !contractAddress || isWrongNetwork) return null;

    try {
      return new ethers.Contract(contractAddress, HAYQ_ABI, provider);
    } catch (error) {
      console.error('Read contract initialization error:', error);
      return null;
    }
  }, [provider, contractAddress, isWrongNetwork]);

  // Fetch token info (name, symbol, decimals) dynamically
  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!readContract) return;

      try {
        const [name, symbol, decimals] = await Promise.all([
          readContract.name().catch(() => 'HAYQ Token'),
          readContract.symbol().catch(() => 'HAYQ'),
          readContract.decimals().catch(() => 18),
        ]);
        setTokenInfo({ name, symbol, decimals });
        setContractError(null);
      } catch (error) {
        console.error('Failed to fetch token info:', error);
        setContractError('Contract not found on this network');
      }
    };

    fetchTokenInfo();
  }, [readContract]);

  return {
    contract,
    readContract,
    isReady: isConnected && !isWrongNetwork && !!contract && !contractError,
    contractAddress,
    tokenInfo,
    contractError,
    targetChainId,
  };
};
