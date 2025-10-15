import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useBalance } from "@/hooks/useBalance";
import { handleContractError } from "@/utils/contractHelpers";

const DividendClaim = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isConnected } = useWeb3Context();
  const { contract } = useContract();
  const { dividends, refresh } = useBalance();
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
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
      const tx = await contract.claimDividends();
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();
      
      toast({
        title: "Success",
        description: "Dividend claimed successfully",
      });
      
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

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {t("dividend")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold">{parseFloat(dividends).toFixed(2)} HAYQ</div>
        <p className="text-sm text-muted-foreground">Available to claim</p>
        <Button 
          onClick={handleClaim} 
          className="w-full"
          disabled={!isConnected || loading || parseFloat(dividends) === 0}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t("dividend")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DividendClaim;
