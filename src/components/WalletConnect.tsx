import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletConnect = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        }) as string[];
        setAccount(accounts[0]);
        toast({
          title: "Success",
          description: `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please install MetaMask",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          {t("walletConnect")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {account ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        ) : (
          <Button onClick={connectWallet} className="w-full">
            {t("walletConnect")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
