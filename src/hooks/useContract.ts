import { useMemo } from 'react';
import { ethers } from 'ethers';
import { getContractAddress } from '@/config/contracts';
import { useWeb3 } from './useWeb3';

// ABI for HAYQ Token (HAYQMiniMVP Contract)
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

export const useContract = () => {
  const { provider, signer, chainId, isConnected } = useWeb3();

  const contract = useMemo(() => {
    if (!provider || !chainId) return null;

    try {
      const address = getContractAddress(chainId);
      return new ethers.Contract(
        address,
        HAYQ_ABI,
        signer || provider
      );
    } catch (error) {
      console.error('Contract initialization error:', error);
      return null;
    }
  }, [provider, signer, chainId]);

  const readContract = useMemo(() => {
    if (!provider || !chainId) return null;

    try {
      const address = getContractAddress(chainId);
      return new ethers.Contract(address, HAYQ_ABI, provider);
    } catch (error) {
      console.error('Read contract initialization error:', error);
      return null;
    }
  }, [provider, chainId]);

  return {
    contract,
    readContract,
    isReady: isConnected && !!contract,
  };
};
