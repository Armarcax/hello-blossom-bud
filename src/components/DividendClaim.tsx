import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DividendClaim = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleClaim = () => {
    toast({
      title: "Success",
      description: "Dividend claimed successfully",
    });
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
        <div className="text-2xl font-bold">125 HAYQ</div>
        <p className="text-sm text-muted-foreground">Available to claim</p>
        <Button onClick={handleClaim} className="w-full">
          {t("dividend")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DividendClaim;
