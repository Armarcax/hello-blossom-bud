import { useTranslation } from "react-i18next";
import { Coins, TrendingUp, Gift, RefreshCw, Wallet } from "lucide-react";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useBalance } from "@/hooks/useBalance";
import { useContract } from "@/hooks/useContract";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard, ConnectWalletPrompt } from "@/components/shared";
import { WEB3_CONFIG } from "@/config/web3";
import { formatDisplayNumber } from "@/utils/contractHelpers";

// Human-readable formatting - prevents scientific notation like 4e+21
const safeFormat = (value: string, decimals: number = 4) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return formatDisplayNumber(n, decimals);
};

const Balance = () => {
  const { t } = useTranslation();
  const {
    isConnected,
    isWrongNetwork,
    nativeBalance,
    networkName,
  } = useWeb3Context();

  const { tokenInfo, contractError } = useContract();

  const {
    balance,
    stakedBalance,
    rewards,
    dividends,
    loading,
    refresh,
  } = useBalance();

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

  if (isWrongNetwork) {
    return (
      <DashboardCard title={t("balance")} icon={Coins}>
        <div className="text-sm text-destructive">
          Please switch to {networkName} to view your balance.
        </div>
      </DashboardCard>
    );
  }

  if (contractError) {
    return (
      <DashboardCard title={t("balance")} icon={Coins}>
        <div className="text-sm text-destructive">{contractError}</div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title={t("balance")} icon={Coins} headerAction={RefreshButton}>
      {loading && !balance ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <div className="space-y-4">
          {/* Native Balance */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Wallet className="h-3 w-3" />
              {WEB3_CONFIG.nativeCurrency.symbol} Balance
            </div>
            <div className="text-xl font-semibold">
              {safeFormat(nativeBalance, 6)} {WEB3_CONFIG.nativeCurrency.symbol}
            </div>
          </div>

          {/* Token Balance */}
          <div>
            <div className="text-3xl font-bold">
              {safeFormat(balance, 4)} {tokenInfo.symbol}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Available Token Balance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <BalanceStat icon={TrendingUp} label="Staked" value={stakedBalance} decimals={4} />
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

const BalanceStat = ({ icon: Icon, label, value, decimals = 4 }: BalanceStatProps) => (
  <div>
    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
      <Icon className="h-3 w-3" />
      {label}
    </div>
    <div className="font-semibold text-sm">{safeFormat(value, decimals)}</div>
  </div>
);

export default Balance;
