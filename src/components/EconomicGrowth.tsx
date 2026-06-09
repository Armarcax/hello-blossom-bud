import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { DashboardCard } from "@/components/shared";

const GROWTH_DATA = [
  { name: "Q1", growth: 10 },
  { name: "Q2", growth: 15 },
  { name: "Q3", growth: 20 },
  { name: "Q4", growth: 25 },
];

const EconomicGrowth = () => {
  const { t } = useTranslation();

  return (
    <DashboardCard title={t("growth")} icon={TrendingUp}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={GROWTH_DATA}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" className="text-muted-foreground" />
          <YAxis className="text-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey="growth" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-muted-foreground mt-4">
        Annual growth rate: <span className="font-bold text-primary">25%</span>
      </p>
    </DashboardCard>
  );
};

export default EconomicGrowth;
