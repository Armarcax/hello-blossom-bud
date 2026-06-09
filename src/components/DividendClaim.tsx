import { useTranslation } from "react-i18next";
import { DollarSign, Info, Coins } from "lucide-react";
import { DashboardCard } from "@/components/shared";

const DividendClaim = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard title={t("dividend")} icon={DollarSign}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10">
          <Coins className="h-4 w-4 text-accent shrink-0" />
          <p className="text-sm text-muted-foreground">
            Dividend tracking managed by ERC20 & ETH DividendTracker contracts
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Dividends distributed proportionally to HAYQ token holders
        </p>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Integration ready</span> — Add contract addresses to enable claiming
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};

export default DividendClaim;
