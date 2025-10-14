import { useMemo } from 'react';
import { ethers } from 'ethers';
import { getContractAddress } from '@/config/contracts';
import { useWeb3 } from './useWeb3';

// Minimal ABI - will be replaced with full ABI from contract
const HAYQ_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  
  // Staking
  'function stake(uint256 amount)',
  'function unstake(uint256 amount)',
  'function getStakedBalance(address account) view returns (uint256)',
  'function getStakingRewards(address account) view returns (uint256)',
  
  // Dividends
  'function claimDividends()',
  'function getDividends(address account) view returns (uint256)',
  'function totalDividendsDistributed() view returns (uint256)',
  
  // Buyback
  'function buybackAndBurn() payable',
  'function getBuybackStats() view returns (uint256 totalBuyback, uint256 totalBurned)',
  
  // Governance
  'function createProposal(string description, uint256 duration)',
  'function vote(uint256 proposalId, bool support)',
  'function executeProposal(uint256 proposalId)',
  'function getProposal(uint256 proposalId) view returns (tuple)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Staked(address indexed user, uint256 amount)',
  'event Unstaked(address indexed user, uint256 amount)',
  'event DividendClaimed(address indexed user, uint256 amount)',
  'event BuybackExecuted(uint256 ethAmount, uint256 tokensBurned)',
  'event ProposalCreated(uint256 indexed proposalId, address indexed creator, string description)',
  'event Voted(uint256 indexed proposalId, address indexed voter, bool support)',
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
