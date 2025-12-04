import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface Web3State {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

const STORAGE_KEY = 'hayq_wallet_connected';

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    account: '',
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initRef = useRef(false);

  // Initialize provider and check for existing connection
  const initializeProvider = useCallback(async () => {
    if (!window.ethereum || initRef.current) return;
    initRef.current = true;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Check if already connected
    const wasConnected = localStorage.getItem(STORAGE_KEY) === 'true';
    if (wasConnected) {
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const network = await provider.getNetwork();
          setState({
            provider,
            signer,
            account: accounts[0],
            chainId: network.chainId,
            isConnected: true,
            isConnecting: false,
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask not found',
        description: 'Please install MetaMask to use this app',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true }));

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      setState({
        provider,
        signer,
        account: accounts[0],
        chainId: network.chainId,
        isConnected: true,
        isConnecting: false,
      });

      localStorage.setItem(STORAGE_KEY, 'true');

      // Invalidate all queries to refresh data with new account
      queryClient.invalidateQueries({ queryKey: ['web3'] });

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error: any) {
      setState(prev => ({ ...prev, isConnecting: false }));
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast, queryClient]);

  const disconnectWallet = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      account: '',
      chainId: null,
      isConnected: false,
      isConnecting: false,
    });

    localStorage.removeItem(STORAGE_KEY);
    
    // Clear all cached Web3 data
    queryClient.removeQueries({ queryKey: ['web3'] });

    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [toast, queryClient]);

  // Handle account and chain changes
  useEffect(() => {
    initializeProvider();

    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== state.account) {
        setState(prev => ({ ...prev, account: accounts[0] }));
        queryClient.invalidateQueries({ queryKey: ['web3'] });
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setState(prev => ({ ...prev, chainId: newChainId }));
      queryClient.invalidateQueries({ queryKey: ['web3'] });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [initializeProvider, disconnectWallet, state.account, queryClient]);

  return { ...state, connectWallet, disconnectWallet };
};
