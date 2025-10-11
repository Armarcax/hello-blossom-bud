import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "Q1", growth: 10 },
  { name: "Q2", growth: 15 },
  { name: "Q3", growth: 20 },
  { name: "Q4", growth: 25 },
];

const EconomicGrowth = () => {
  const { t } = useTranslation();

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t("growth")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="growth" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">
          Annual growth rate: <span className="font-bold text-primary">25%</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default EconomicGrowth;
