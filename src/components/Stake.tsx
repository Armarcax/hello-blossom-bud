import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Stake = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  const handleStake = () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter amount",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: `Staked ${amount} HAYQ`,
    });
    setAmount("");
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
        <Input
          type="number"
          placeholder="Amount to Stake"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleStake} className="w-full">
          {t("stake")}
        </Button>
        <div className="text-sm text-muted-foreground">
          Current APY: <span className="text-primary font-bold">12.5%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stake;
