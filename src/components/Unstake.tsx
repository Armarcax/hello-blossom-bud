import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useBalance } from "@/hooks/useBalance";
import { parseTokenAmount, handleContractError } from "@/utils/contractHelpers";
import { DashboardCard, TokenAmountInput, ActionButton, ConnectWalletPrompt } from "@/components/shared";

const Unstake = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isConnected } = useWeb3Context();
  const { contract } = useContract();
  const { stakedBalance, refresh } = useBalance();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnstake = async () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter amount",
        variant: "destructive",
      });
      return;
    }

    if (!contract || !isConnected) {
      toast({
        title: "Error",
        description: "Please connect wallet",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const parsedAmount = parseTokenAmount(amount);
      const tx = await contract.unstake(parsedAmount);

      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();

      toast({
        title: "Success",
        description: `Unstaked ${amount} HAYQ`,
      });

      setAmount("");
      refresh();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: handleContractError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardCard title={t("unstake")} icon={TrendingDown}>
      {!isConnected ? (
        <ConnectWalletPrompt message="Connect wallet to unstake" />
      ) : (
        <div className="space-y-4">
          <TokenAmountInput
            value={amount}
            onChange={setAmount}
            maxValue={stakedBalance}
            placeholder="Amount to Unstake"
            disabled={loading}
            label="Staked"
          />
          <ActionButton
            onClick={handleUnstake}
            loading={loading}
            icon={TrendingDown}
            loadingText="Unstaking..."
            variant="secondary"
          >
            {t("unstake")}
          </ActionButton>
        </div>
      )}
    </DashboardCard>
  );
};

export default Unstake;
