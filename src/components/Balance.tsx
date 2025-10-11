import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

const Balance = () => {
  const { t } = useTranslation();

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          {t("balance")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">1,000 HAYQ</div>
        <p className="text-sm text-muted-foreground mt-2">≈ $1,000 USD</p>
      </CardContent>
    </Card>
  );
};

export default Balance;
