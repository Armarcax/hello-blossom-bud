import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Buyback = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleBuyback = () => {
    toast({
      title: "Success",
      description: "Buyback initiated",
    });
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
          Next buyback: <span className="font-bold">7 days</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Total bought back: <span className="font-bold">10,000 HAYQ</span>
        </div>
        <Button onClick={handleBuyback} className="w-full">
          Participate in Buyback
        </Button>
      </CardContent>
    </Card>
  );
};

export default Buyback;
