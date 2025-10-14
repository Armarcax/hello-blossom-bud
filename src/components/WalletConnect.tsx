import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useWeb3Context } from "@/contexts/Web3Context";
import { shortenAddress } from "@/utils/contractHelpers";
import { Badge } from "@/components/ui/badge";

const WalletConnect = () => {
  const { t } = useTranslation();
  const { account, chainId, isConnected, connectWallet, disconnectWallet } = useWeb3Context();

  const getChainName = (id: number | null) => {
    if (!id) return '';
    const chains: Record<number, string> = {
      31337: 'Hardhat',
      11155111: 'Sepolia',
      1: 'Ethereum',
    };
    return chains[id] || `Chain ${id}`;
  };

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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {shortenAddress(account)}
              </span>
              <Badge variant="secondary">{getChainName(chainId)}</Badge>
            </div>
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
          <Button onClick={connectWallet} className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            {t("walletConnect")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
