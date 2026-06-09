import { useTranslation } from "react-i18next";
import { Vote, Info, Shield } from "lucide-react";
import { useBalance } from "@/hooks/useBalance";
import { DashboardCard } from "@/components/shared";

const Voting = () => {
  const { t } = useTranslation();
  const { stakedBalance } = useBalance();

  return (
    <DashboardCard title={t("voting")} icon={Vote}>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Governance managed via MultiSigTimelock contract
        </p>
        <p className="text-sm text-muted-foreground">
          Multi-signature with 2-day timelock for secure decision-making
        </p>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
          <Shield className="h-4 w-4 text-primary shrink-0" />
          <div className="text-sm">
            <span className="text-muted-foreground">Voting power: </span>
            <span className="font-bold text-foreground">
              {parseFloat(stakedBalance).toFixed(2)} HAYQ
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Integration pending</span> — MultiSigTimelock address needed
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};

export default Voting;
