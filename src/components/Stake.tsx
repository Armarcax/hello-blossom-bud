import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useBalance } from "@/hooks/useBalance";
import { parseTokenAmount, handleContractError } from "@/utils/contractHelpers";

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
    } catch (error: any) {
      toast({
        title: "Staking Failed",
        description: handleContractError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(balance);
  };

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t("stake")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Available: {parseFloat(balance).toFixed(2)} HAYQ</span>
            <Button variant="link" size="sm" onClick={setMaxAmount} className="h-auto p-0">
              Max
            </Button>
          </div>
          <Input
            type="number"
            placeholder="Amount to Stake"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading || !isConnected}
          />
        </div>
        <Button 
          onClick={handleStake} 
          className="w-full"
          disabled={loading || !isConnected}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Staking...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              {t("stake")}
            </>
          )}
        </Button>
        <div className="text-sm text-muted-foreground">
          Current APY: <span className="text-primary font-bold">12.5%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stake;
