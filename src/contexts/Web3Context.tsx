import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { ethers } from 'ethers';

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  isWrongNetwork: boolean;
  nativeBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<boolean>;
  refreshNativeBalance: () => Promise<void>;
  shortAddress: string;
  targetChainId: number;
  networkName: string;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const web3 = useWeb3();

  const contextValue = useMemo(() => ({
    ...web3,
    shortAddress: web3.account 
      ? `${web3.account.slice(0, 6)}...${web3.account.slice(-4)}`
      : '',
  }), [web3]);

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within Web3Provider');
  }
  return context;
};
