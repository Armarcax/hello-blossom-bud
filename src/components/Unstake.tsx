import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useBalance } from "@/hooks/useBalance";
import { parseTokenAmount, handleContractError } from "@/utils/contractHelpers";

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
    } catch (error) {
      toast({
        title: "Error",
        description: handleContractError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(stakedBalance);
  };

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          {t("unstake")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Staked Balance:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold">{parseFloat(stakedBalance).toFixed(2)} HAYQ</span>
            <Button 
              onClick={setMaxAmount} 
              variant="outline" 
              size="sm"
              disabled={!isConnected || loading}
            >
              Max
            </Button>
          </div>
        </div>
        <Input
          type="number"
          placeholder="Amount to Unstake"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!isConnected || loading}
        />
        <Button 
          onClick={handleUnstake} 
          variant="secondary" 
          className="w-full"
          disabled={!isConnected || loading}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t("unstake")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Unstake;
