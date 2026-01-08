import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Wifi, AlertCircle } from "lucide-react";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { Badge } from "@/components/ui/badge";
import { WEB3_CONFIG } from "@/config/web3";

const WalletConnect = () => {
  const { t } = useTranslation();
  const { 
    account, 
    isConnected, 
    isConnecting,
    isWrongNetwork,
    nativeBalance,
    connectWallet, 
    disconnectWallet,
    switchNetwork,
    networkName,
    shortAddress,
  } = useWeb3Context();
  const { tokenInfo } = useContract();

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          {t("walletConnect")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            {/* Account Info */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-medium">
                {shortAddress}
              </span>
              {isWrongNetwork ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Wrong Network
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  {networkName}
                </Badge>
              )}
            </div>

            {/* Native Balance */}
            {!isWrongNetwork && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  {WEB3_CONFIG.nativeCurrency.symbol} Balance
                </div>
                <div className="text-lg font-semibold">
                  {parseFloat(nativeBalance).toFixed(4)} {WEB3_CONFIG.nativeCurrency.symbol}
                </div>
              </div>
            )}

            {/* Wrong Network Warning */}
            {isWrongNetwork && (
              <Button 
                onClick={switchNetwork} 
                variant="default" 
                className="w-full"
              >
                <Wifi className="h-4 w-4 mr-2" />
                Switch to {networkName}
              </Button>
            )}

            {/* Disconnect Button */}
            <Button 
              onClick={disconnectWallet} 
              variant="outline" 
              className="w-full"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your MetaMask wallet to access HAYQ features on {networkName}.
            </p>
            <Button 
              onClick={connectWallet} 
              className="w-full"
              disabled={isConnecting}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? 'Connecting...' : t("walletConnect")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
