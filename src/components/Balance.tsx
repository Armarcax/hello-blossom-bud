import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Gift, RefreshCw } from "lucide-react";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useBalance } from "@/hooks/useBalance";
import { useContract } from "@/hooks/useContract";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Balance = () => {
  const { t } = useTranslation();
  const { isConnected } = useWeb3Context();
  const { readContract } = useContract();
  const { balance, stakedBalance, rewards, dividends, loading, refresh } = useBalance();

  if (!isConnected) {
    return (
      <Card className="component">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            {t("balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Connect wallet to view balance</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            {t("balance")}
          </div>
          <Button variant="ghost" size="icon" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readContract && isConnected ? (
          <div className="text-sm text-destructive">
            HAYQ պայմանագիրը տեղադրված չէ այս ցանցում։ Խնդրում ենք միանալ Hardhat Local (Chain ID: 31337) կամ Sepolia ցանցին:
          </div>
        ) : loading && !balance ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div className="space-y-3">
            <div>
              <div className="text-3xl font-bold">{parseFloat(balance).toFixed(2)} HAYQ</div>
              <p className="text-sm text-muted-foreground mt-1">Available Balance</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="h-3 w-3" />
                  Staked
                </div>
                <div className="font-semibold">{parseFloat(stakedBalance).toFixed(2)}</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Gift className="h-3 w-3" />
                  Rewards
                </div>
                <div className="font-semibold">{parseFloat(rewards).toFixed(4)}</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Coins className="h-3 w-3" />
                  Dividends
                </div>
                <div className="font-semibold">{parseFloat(dividends).toFixed(4)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Balance;
