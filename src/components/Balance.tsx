import { useTranslation } from "react-i18next";
import { Coins, TrendingUp, Gift, RefreshCw, Wallet } from "lucide-react";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useBalance } from "@/hooks/useBalance";
import { useContract } from "@/hooks/useContract";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard, ConnectWalletPrompt } from "@/components/shared";
import { WEB3_CONFIG } from "@/config/web3";

const safeFixed = (value: string, decimals: number) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return (0).toFixed(decimals);
  return n.toFixed(decimals);
};

const Balance = () => {
  const { t } = useTranslation();
  const {
    isConnected,
    isWrongNetwork,
    nativeBalance,
    nativeBalanceWei,
    networkName,
    chainId,
    targetChainId,
  } = useWeb3Context();

  const { tokenInfo, contractError, contractAddress, contractCode } = useContract();

  const {
    balance,
    stakedBalance,
    rewards,
    dividends,
    rawTokenBalance,
    rawStakedBalance,
    rawRewards,
    decimalsUsed,
    loading,
    refresh,
  } = useBalance();

  const chainMismatch = chainId !== null && chainId !== targetChainId;
  const nativeIsZero = nativeBalanceWei === '0';
  const contractHasNoCode = contractCode === '0x' || contractCode === null;

  const RefreshButton = (
    <Button variant="ghost" size="icon" onClick={refresh} disabled={loading}>
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
    </Button>
  );

  const DebugPanel = (
    <div className="pt-4 border-t text-xs space-y-2">
      <div className="font-medium">Web3 Debug</div>
      <div className="grid grid-cols-1 gap-1 text-muted-foreground">
        <div>
          Network: <span className="text-foreground">{networkName}</span>
        </div>
        <div>
          Connected chainId:{" "}
          <span className={chainMismatch ? "text-destructive" : "text-foreground"}>
            {chainId ?? "(unknown)"}
          </span>
        </div>
        <div>
          Expected chainId (env): <span className="text-foreground">{targetChainId}</span>
        </div>
        <div>
          Contract address (env):{" "}
          <span className="text-foreground font-mono break-all">{contractAddress || "(missing)"}</span>
        </div>
        <div>
          Token decimals used: <span className="text-foreground">{decimalsUsed}</span>
        </div>
        <div>
          Native balance (wei): <span className="text-foreground font-mono break-all">{nativeBalanceWei}</span>
        </div>
        <div>
          Token balanceOf raw: <span className="text-foreground font-mono break-all">{rawTokenBalance}</span>
        </div>
        <div>
          Staked raw: <span className="text-foreground font-mono break-all">{rawStakedBalance}</span>
        </div>
        <div>
          Rewards raw: <span className="text-foreground font-mono break-all">{rawRewards}</span>
        </div>
      </div>

      {nativeIsZero && (
        <div className="text-destructive">
          Native balance returned 0 (provider.getBalance). If you expect funds, you are likely on the wrong network.
        </div>
      )}

      {contractAddress && contractHasNoCode && !isWrongNetwork && (
        <div className="text-destructive">
          No contract bytecode detected at the configured address on this connected chain. This usually means the contract is not deployed on this network.
        </div>
      )}

      {contractError && (
        <div className="text-destructive">Contract error: {contractError}</div>
      )}
    </div>
  );

  if (!isConnected) {
    return (
      <DashboardCard title={t("balance")} icon={Coins}>
        <ConnectWalletPrompt message="Connect wallet to view balance" />
        {DebugPanel}
      </DashboardCard>
    );
  }

  if (isWrongNetwork) {
    return (
      <DashboardCard title={t("balance")} icon={Coins}>
        <div className="text-sm text-destructive">
          Please switch to {networkName} to view your balance.
        </div>
        {DebugPanel}
      </DashboardCard>
    );
  }

  if (contractError) {
    return (
      <DashboardCard title={t("balance")} icon={Coins}>
        <div className="text-sm text-destructive">{contractError}</div>
        {DebugPanel}
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
              {safeFixed(nativeBalance, 4)} {WEB3_CONFIG.nativeCurrency.symbol}
            </div>
          </div>

          {/* Token Balance */}
          <div>
            <div className="text-3xl font-bold">
              {safeFixed(balance, 2)} {tokenInfo.symbol}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Available Token Balance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <BalanceStat icon={TrendingUp} label="Staked" value={stakedBalance} decimals={2} symbol={tokenInfo.symbol} />
            <BalanceStat icon={Gift} label="Rewards" value={rewards} decimals={4} symbol={tokenInfo.symbol} />
            <BalanceStat icon={Coins} label="Dividends" value={dividends} decimals={4} symbol={tokenInfo.symbol} />
          </div>

          {DebugPanel}
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
  symbol?: string;
}

const BalanceStat = ({ icon: Icon, label, value, decimals = 2 }: BalanceStatProps) => (
  <div>
    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
      <Icon className="h-3 w-3" />
      {label}
    </div>
    <div className="font-semibold text-sm">{safeFixed(value, decimals)}</div>
  </div>
);

export default Balance;
