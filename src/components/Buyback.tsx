import { useTranslation } from "react-i18next";
import { ArrowDownUp, Info } from "lucide-react";
import { DashboardCard } from "@/components/shared";

const Buyback = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard title={t("buyback")} icon={ArrowDownUp}>
      <div className="space-y-3">
        <InfoItem text="Buyback mechanism implemented on-chain" />
        <InfoItem text="Swaps HAYQ for MiniMVP tokens via configured DEX router" />
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Owner-only function</span> — Contact admin to initiate buyback
          </p>
        </div>
      </div>
    </DashboardCard>
  );
};

const InfoItem = ({ text }: { text: string }) => (
  <p className="text-sm text-muted-foreground">{text}</p>
);

export default Buyback;
