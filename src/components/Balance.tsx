import { useTranslation } from "react-i18next";
import { Coins, TrendingUp, Gift, RefreshCw } from "lucide-react";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useBalance } from "@/hooks/useBalance";
import { useContract } from "@/hooks/useContract";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard, ConnectWalletPrompt } from "@/components/shared";

const Balance = () => {
  const { t } = useTranslation();
  const { isConnected } = useWeb3Context();
  const { readContract } = useContract();
  const { balance, stakedBalance, rewards, dividends, loading, refresh } = useBalance();

  const RefreshButton = (
    <Button variant="ghost" size="icon" onClick={refresh} disabled={loading}>
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
    </Button>
  );

  if (!isConnected) {
    return (
      <DashboardCard title={t("balance")} icon={Coins}>
        <ConnectWalletPrompt message="Connect wallet to view balance" />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title={t("balance")} icon={Coins} headerAction={RefreshButton}>
      {!readContract && isConnected ? (
        <div className="text-sm text-destructive">
          HAYQ contract is not deployed on this network. Please connect to Hardhat Local (Chain ID: 31337) or Sepolia.
        </div>
      ) : loading && !balance ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold">
              {parseFloat(balance).toFixed(2)} HAYQ
            </div>
            <p className="text-sm text-muted-foreground mt-1">Available Balance</p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <BalanceStat icon={TrendingUp} label="Staked" value={stakedBalance} decimals={2} />
            <BalanceStat icon={Gift} label="Rewards" value={rewards} decimals={4} />
            <BalanceStat icon={Coins} label="Dividends" value={dividends} decimals={4} />
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

interface BalanceStatProps {
  icon: typeof Coins;
  label: string;
  value: string;
  decimals?: number;
}

const BalanceStat = ({ icon: Icon, label, value, decimals = 2 }: BalanceStatProps) => (
  <div>
    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
      <Icon className="h-3 w-3" />
      {label}
    </div>
    <div className="font-semibold">{parseFloat(value).toFixed(decimals)}</div>
  </div>
);

export default Balance;
