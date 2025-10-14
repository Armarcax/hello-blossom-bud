import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { parseTokenAmount, handleContractError, shortenAddress } from "@/utils/contractHelpers";

const Transfer = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isConnected } = useWeb3Context();
  const { contract } = useContract();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!isConnected || !contract) {
      toast({
        title: "Error",
        description: "Please connect your wallet",
        variant: "destructive",
      });
      return;
    }

    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    if (!ethers.utils.isAddress(recipient)) {
      toast({
        title: "Error",
        description: "Invalid recipient address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const amountWei = parseTokenAmount(amount);
      const tx = await contract.transfer(recipient, amountWei);
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();

      toast({
        title: "Success",
        description: `Transferred ${amount} HAYQ to ${shortenAddress(recipient)}`,
      });

      setRecipient("");
      setAmount("");
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
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
          <Send className="h-5 w-5" />
          {t("transfer")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Recipient Address (0x...)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={loading || !isConnected}
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading || !isConnected}
        />
        <Button 
          onClick={handleTransfer} 
          className="w-full"
          disabled={loading || !isConnected}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Transferring...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {t("transfer")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Transfer;
