import { useWeb3Context } from '@/contexts/Web3Context';
import { useContract } from '@/hooks/useContract';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { WEB3_CONFIG } from '@/config/web3';

interface NetworkGuardProps {
  children: React.ReactNode;
}

const NetworkGuard = ({ children }: NetworkGuardProps) => {
  const { isConnected, isWrongNetwork, switchNetwork, networkName } = useWeb3Context();
  const { contractError, isReady } = useContract();

  // Not connected - show connect prompt (handled by individual components)
  if (!isConnected) {
    return <>{children}</>;
  }

  // Wrong network - block UI and show switch prompt
  if (isWrongNetwork) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Wrong Network</h2>
            <p className="text-muted-foreground">
              Please switch to <span className="font-semibold text-foreground">{networkName}</span> to continue using HAYQ.
            </p>
          </div>
          <Button onClick={switchNetwork} size="lg" className="w-full">
            <Wifi className="mr-2 h-4 w-4" />
            Switch to {networkName}
          </Button>
          <p className="text-xs text-muted-foreground">
            Chain ID: {WEB3_CONFIG.chainId}
          </p>
        </div>
      </div>
    );
  }

  // Contract error - show error state
  if (contractError && !WEB3_CONFIG.contractAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Configuration Error</h2>
            <p className="text-muted-foreground">
              Contract address is not configured. Please set <code className="bg-muted px-1 py-0.5 rounded text-sm">VITE_CONTRACT_ADDRESS</code> in your environment.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkGuard;
