import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { WEB3_CONFIG, getChainIdHex, getNetworkConfig } from '@/config/web3';

export interface Web3State {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  isWrongNetwork: boolean;
  nativeBalance: string;
}

const STORAGE_KEY = 'hayq_wallet_connected';
const TARGET_CHAIN_ID = WEB3_CONFIG.chainId;

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    account: '',
    chainId: null,
    isConnected: false,
    isConnecting: false,
    isWrongNetwork: false,
    nativeBalance: '0',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initRef = useRef(false);

  // Fetch native balance
  const fetchNativeBalance = useCallback(async (provider: ethers.providers.Web3Provider, account: string) => {
    try {
      const balance = await provider.getBalance(account);
      return ethers.utils.formatEther(balance);
    } catch {
      return '0';
    }
  }, []);

  // Switch to the correct network
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: getChainIdHex() }],
      });
      return true;
    } catch (switchError: any) {
      // Chain not added to MetaMask - try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [getNetworkConfig()],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          toast({
            title: 'Network Error',
            description: `Please add ${WEB3_CONFIG.networkName} to MetaMask manually`,
            variant: 'destructive',
          });
          return false;
        }
      }
      console.error('Failed to switch network:', switchError);
      return false;
    }
  }, [toast]);

  // Initialize provider and check for existing connection
  const initializeProvider = useCallback(async () => {
    if (!window.ethereum || initRef.current) return;
    initRef.current = true;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const wasConnected = localStorage.getItem(STORAGE_KEY) === 'true';
    
    if (wasConnected) {
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const network = await provider.getNetwork();
          const isWrongNetwork = network.chainId !== TARGET_CHAIN_ID;
          const nativeBalance = await fetchNativeBalance(provider, accounts[0]);

          setState({
            provider,
            signer,
            account: accounts[0],
            chainId: network.chainId,
            isConnected: true,
            isConnecting: false,
            isWrongNetwork,
            nativeBalance,
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [fetchNativeBalance]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask to use this application',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true }));

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      // Force switch to correct network
      if (network.chainId !== TARGET_CHAIN_ID) {
        const switched = await switchNetwork();
        if (!switched) {
          setState(prev => ({ 
            ...prev, 
            isConnecting: false,
            isWrongNetwork: true,
            account: accounts[0],
            chainId: network.chainId,
            provider,
            isConnected: true,
          }));
          toast({
            title: 'Wrong Network',
            description: `Please switch to ${WEB3_CONFIG.networkName}`,
            variant: 'destructive',
          });
          return;
        }
        // Re-initialize after network switch
        await new Promise(resolve => setTimeout(resolve, 500));
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newNetwork = await newProvider.getNetwork();
        const signer = newProvider.getSigner();
        const nativeBalance = await fetchNativeBalance(newProvider, accounts[0]);

        setState({
          provider: newProvider,
          signer,
          account: accounts[0],
          chainId: newNetwork.chainId,
          isConnected: true,
          isConnecting: false,
          isWrongNetwork: false,
          nativeBalance,
        });
      } else {
        const signer = provider.getSigner();
        const nativeBalance = await fetchNativeBalance(provider, accounts[0]);

        setState({
          provider,
          signer,
          account: accounts[0],
          chainId: network.chainId,
          isConnected: true,
          isConnecting: false,
          isWrongNetwork: false,
          nativeBalance,
        });
      }

      localStorage.setItem(STORAGE_KEY, 'true');
      queryClient.invalidateQueries({ queryKey: ['web3'] });

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error: any) {
      setState(prev => ({ ...prev, isConnecting: false }));
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  }, [toast, queryClient, switchNetwork, fetchNativeBalance]);

  const disconnectWallet = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      account: '',
      chainId: null,
      isConnected: false,
      isConnecting: false,
      isWrongNetwork: false,
      nativeBalance: '0',
    });

    localStorage.removeItem(STORAGE_KEY);
    queryClient.removeQueries({ queryKey: ['web3'] });

    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [toast, queryClient]);

  // Refresh native balance
  const refreshNativeBalance = useCallback(async () => {
    if (state.provider && state.account) {
      const balance = await fetchNativeBalance(state.provider, state.account);
      setState(prev => ({ ...prev, nativeBalance: balance }));
    }
  }, [state.provider, state.account, fetchNativeBalance]);

  // Handle account and chain changes
  useEffect(() => {
    initializeProvider();

    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== state.account) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const nativeBalance = await fetchNativeBalance(provider, accounts[0]);
        setState(prev => ({ 
          ...prev, 
          account: accounts[0],
          nativeBalance,
        }));
        queryClient.invalidateQueries({ queryKey: ['web3'] });
      }
    };

    const handleChainChanged = async (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      const isWrongNetwork = newChainId !== TARGET_CHAIN_ID;
      
      if (state.provider && state.account) {
        const nativeBalance = await fetchNativeBalance(state.provider, state.account);
        setState(prev => ({ 
          ...prev, 
          chainId: newChainId,
          isWrongNetwork,
          nativeBalance,
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          chainId: newChainId,
          isWrongNetwork,
        }));
      }
      queryClient.invalidateQueries({ queryKey: ['web3'] });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [initializeProvider, disconnectWallet, state.account, state.provider, queryClient, fetchNativeBalance]);

  // Refresh balance periodically
  useEffect(() => {
    if (state.isConnected && !state.isWrongNetwork) {
      refreshNativeBalance();
      const interval = setInterval(refreshNativeBalance, 15000);
      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.isWrongNetwork, refreshNativeBalance]);

  return { 
    ...state, 
    connectWallet, 
    disconnectWallet,
    switchNetwork,
    refreshNativeBalance,
    targetChainId: TARGET_CHAIN_ID,
    networkName: WEB3_CONFIG.networkName,
  };
};
