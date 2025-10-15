import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { handleContractError } from "@/utils/contractHelpers";
import { ethers } from "ethers";

const Buyback = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isConnected } = useWeb3Context();
  const { readContract, contract } = useContract();
  const [loading, setLoading] = useState(false);
  const [nextBuyback, setNextBuyback] = useState<number>(0);
  const [totalBoughtBack, setTotalBoughtBack] = useState<string>("0");

  useEffect(() => {
    const fetchBuybackInfo = async () => {
      if (!readContract) return;

      try {
        const [next, total] = await Promise.all([
          readContract.getNextBuybackTime(),
          readContract.getTotalBuyback(),
        ]);

        setNextBuyback(next.toNumber());
        setTotalBoughtBack(ethers.utils.formatEther(total));
      } catch (error) {
        console.error('Error fetching buyback info:', error);
      }
    };

    fetchBuybackInfo();
    const interval = setInterval(fetchBuybackInfo, 30000);
    return () => clearInterval(interval);
  }, [readContract]);

  const handleBuyback = async () => {
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
      const tx = await contract.executeBuyback();
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();
      
      toast({
        title: "Success",
        description: "Buyback initiated",
      });
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

  const getDaysUntilBuyback = () => {
    const now = Math.floor(Date.now() / 1000);
    const diff = nextBuyback - now;
    return Math.max(0, Math.ceil(diff / 86400));
  };

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownUp className="h-5 w-5" />
          {t("buyback")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Next buyback: <span className="font-bold">{getDaysUntilBuyback()} days</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Total bought back: <span className="font-bold">{parseFloat(totalBoughtBack).toFixed(2)} HAYQ</span>
        </div>
        <Button 
          onClick={handleBuyback} 
          className="w-full"
          disabled={!isConnected || loading}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Participate in Buyback
        </Button>
      </CardContent>
    </Card>
  );
};

export default Buyback;
