import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useBalance } from "@/hooks/useBalance";
import { parseTokenAmount, handleContractError } from "@/utils/contractHelpers";
import { DashboardCard, TokenAmountInput, ActionButton, ConnectWalletPrompt } from "@/components/shared";

const Stake = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isConnected } = useWeb3Context();
  const { contract } = useContract();
  const { balance, refresh } = useBalance();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    if (!isConnected || !contract) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const amountWei = parseTokenAmount(amount);
      const tx = await contract.stake(amountWei);

      toast({
        title: "Transaction Sent",
        description: "Staking in progress...",
      });

      await tx.wait();

      toast({
        title: "Success",
        description: `Staked ${amount} HAYQ successfully`,
      });

      setAmount("");
      refresh();
    } catch (error: unknown) {
      toast({
        title: "Staking Failed",
        description: handleContractError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardCard title={t("stake")} icon={TrendingUp}>
      {!isConnected ? (
        <ConnectWalletPrompt message="Connect wallet to stake" />
      ) : (
        <div className="space-y-4">
          <TokenAmountInput
            value={amount}
            onChange={setAmount}
            maxValue={balance}
            placeholder="Amount to Stake"
            disabled={loading}
          />
          
          <ActionButton
            onClick={handleStake}
            loading={loading}
            disabled={!isConnected}
            icon={TrendingUp}
            loadingText="Staking..."
          >
            {t("stake")}
          </ActionButton>

          <div className="text-sm text-muted-foreground">
            Current APY: <span className="text-primary font-bold">12.5%</span>
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

export default Stake;
