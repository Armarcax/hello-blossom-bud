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
  nativeBalance: string; // formatted (ETH/BNB/MATIC)
  nativeBalanceWei: string; // raw
}

const STORAGE_KEY = 'hayq_wallet_connected';
const TARGET_CHAIN_ID = WEB3_CONFIG.chainId;

type NativeBalance = { wei: string; formatted: string };

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
    nativeBalanceWei: '0',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initRef = useRef(false);

  const getInjectedProvider = useCallback(() => {
    if (!window.ethereum) return null;
    return new ethers.providers.Web3Provider(window.ethereum);
  }, []);

  const fetchNativeBalance = useCallback(
    async (provider: ethers.providers.Web3Provider, account: string): Promise<NativeBalance> => {
      try {
        const wei = await provider.getBalance(account);
        return { wei: wei.toString(), formatted: ethers.utils.formatEther(wei) };
      } catch (e) {
        console.error('[web3] getBalance failed', e);
        return { wei: '0', formatted: '0' };
      }
    },
    []
  );

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: getChainIdHex() }],
      });
      return true;
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError?.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [getNetworkConfig()],
          });
          return true;
        } catch (addError) {
          console.error('[web3] Failed to add network:', addError);
          toast({
            title: 'Network Error',
            description: `Please add ${WEB3_CONFIG.networkName} to MetaMask manually`,
            variant: 'destructive',
          });
          return false;
        }
      }

      console.error('[web3] Failed to switch network:', switchError);
      return false;
    }
  }, [toast]);

  const hydrateFromExistingSession = useCallback(async () => {
    if (!window.ethereum || initRef.current) return;
    initRef.current = true;

    const provider = getInjectedProvider();
    if (!provider) return;

    const wasConnected = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!wasConnected) return;

    try {
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) return;

      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const isWrongNetwork = network.chainId !== TARGET_CHAIN_ID;
      const nb = await fetchNativeBalance(provider, accounts[0]);

      console.info('[web3] hydrated', {
        connectedChainId: network.chainId,
        expectedChainId: TARGET_CHAIN_ID,
        account: accounts[0],
      });

      setState({
        provider,
        signer,
        account: accounts[0],
        chainId: network.chainId,
        isConnected: true,
        isConnecting: false,
        isWrongNetwork,
        nativeBalance: nb.formatted,
        nativeBalanceWei: nb.wei,
      });
    } catch (e) {
      console.error('[web3] hydrate failed', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [fetchNativeBalance, getInjectedProvider]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask to use this application',
        variant: 'destructive',
      });
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true }));

    try {
      const provider = getInjectedProvider();
      if (!provider) throw new Error('MetaMask provider not available');

      const accounts = (await provider.send('eth_requestAccounts', [])) as string[];
      const account = accounts[0];
      const networkBefore = await provider.getNetwork();

      console.info('[web3] connect', {
        connectedChainId: networkBefore.chainId,
        expectedChainId: TARGET_CHAIN_ID,
        account,
      });

      // Force network switch
      if (networkBefore.chainId !== TARGET_CHAIN_ID) {
        const switched = await switchNetwork();

        if (!switched) {
          // Keep connection but mark wrong network
          const nb = await fetchNativeBalance(provider, account);
          const signer = provider.getSigner();
          setState((prev) => ({
            ...prev,
            provider,
            signer,
            account,
            chainId: networkBefore.chainId,
            isConnected: true,
            isConnecting: false,
            isWrongNetwork: true,
            nativeBalance: nb.formatted,
            nativeBalanceWei: nb.wei,
          }));
          toast({
            title: 'Wrong Network',
            description: `Please switch to ${WEB3_CONFIG.networkName}`,
            variant: 'destructive',
          });
          return;
        }

        // Re-create provider after switch to avoid stale network state
        await new Promise((resolve) => setTimeout(resolve, 400));
        const newProvider = getInjectedProvider();
        if (!newProvider) throw new Error('MetaMask provider not available after network switch');

        const networkAfter = await newProvider.getNetwork();
        const signer = newProvider.getSigner();
        const nb = await fetchNativeBalance(newProvider, account);

        console.info('[web3] switched', {
          connectedChainId: networkAfter.chainId,
          expectedChainId: TARGET_CHAIN_ID,
          account,
          nativeBalanceWei: nb.wei,
        });

        setState({
          provider: newProvider,
          signer,
          account,
          chainId: networkAfter.chainId,
          isConnected: true,
          isConnecting: false,
          isWrongNetwork: networkAfter.chainId !== TARGET_CHAIN_ID,
          nativeBalance: nb.formatted,
          nativeBalanceWei: nb.wei,
        });
      } else {
        const signer = provider.getSigner();
        const nb = await fetchNativeBalance(provider, account);

        setState({
          provider,
          signer,
          account,
          chainId: networkBefore.chainId,
          isConnected: true,
          isConnecting: false,
          isWrongNetwork: false,
          nativeBalance: nb.formatted,
          nativeBalanceWei: nb.wei,
        });
      }

      localStorage.setItem(STORAGE_KEY, 'true');
      queryClient.invalidateQueries({ queryKey: ['web3'] });

      toast({
        title: 'Wallet Connected',
        description: `Connected to ${account.slice(0, 6)}...${account.slice(-4)}`,
      });
    } catch (error: any) {
      console.error('[web3] connect failed', error);
      setState((prev) => ({ ...prev, isConnecting: false }));
      toast({
        title: 'Connection Failed',
        description: error?.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  }, [fetchNativeBalance, getInjectedProvider, queryClient, switchNetwork, toast]);

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
      nativeBalanceWei: '0',
    });

    localStorage.removeItem(STORAGE_KEY);
    queryClient.removeQueries({ queryKey: ['web3'] });

    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  }, [queryClient, toast]);

  const refreshNativeBalance = useCallback(async () => {
    if (!state.provider || !state.account) return;
    const nb = await fetchNativeBalance(state.provider, state.account);
    setState((prev) => ({ ...prev, nativeBalance: nb.formatted, nativeBalanceWei: nb.wei }));
  }, [fetchNativeBalance, state.account, state.provider]);

  useEffect(() => {
    hydrateFromExistingSession();

    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
        return;
      }

      const account = accounts[0];
      const provider = getInjectedProvider();
      if (!provider) return;

      const signer = provider.getSigner();
      const nb = await fetchNativeBalance(provider, account);

      console.info('[web3] accountsChanged', { account, nativeBalanceWei: nb.wei });

      setState((prev) => ({
        ...prev,
        provider,
        signer,
        account,
        nativeBalance: nb.formatted,
        nativeBalanceWei: nb.wei,
      }));

      queryClient.invalidateQueries({ queryKey: ['web3'] });
    };

    const handleChainChanged = async (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      const isWrongNetwork = newChainId !== TARGET_CHAIN_ID;

      const provider = getInjectedProvider();
      if (!provider) {
        setState((prev) => ({ ...prev, chainId: newChainId, isWrongNetwork }));
        queryClient.invalidateQueries({ queryKey: ['web3'] });
        return;
      }

      const signer = provider.getSigner();
      const nb = state.account ? await fetchNativeBalance(provider, state.account) : { wei: '0', formatted: '0' };

      console.info('[web3] chainChanged', {
        connectedChainId: newChainId,
        expectedChainId: TARGET_CHAIN_ID,
        account: state.account,
      });

      setState((prev) => ({
        ...prev,
        provider,
        signer,
        chainId: newChainId,
        isWrongNetwork,
        nativeBalance: nb.formatted,
        nativeBalanceWei: nb.wei,
      }));

      queryClient.invalidateQueries({ queryKey: ['web3'] });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [
    disconnectWallet,
    fetchNativeBalance,
    getInjectedProvider,
    hydrateFromExistingSession,
    queryClient,
    state.account,
  ]);

  useEffect(() => {
    if (state.isConnected && !state.isWrongNetwork) {
      refreshNativeBalance();
      const interval = setInterval(refreshNativeBalance, 15000);
      return () => clearInterval(interval);
    }
  }, [refreshNativeBalance, state.isConnected, state.isWrongNetwork]);

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
