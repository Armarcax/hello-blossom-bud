import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Unstake = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  const handleUnstake = () => {
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
      description: `Unstaked ${amount} HAYQ`,
    });
    setAmount("");
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
        <Input
          type="number"
          placeholder="Amount to Unstake"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleUnstake} variant="secondary" className="w-full">
          {t("unstake")}
        </Button>
        <div className="text-sm text-muted-foreground">
          Staked: <span className="font-bold">500 HAYQ</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Unstake;
