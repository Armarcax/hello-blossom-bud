import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, RefreshCw } from "lucide-react";
import { useChartData } from "@/hooks/useChartData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const LiveChart = () => {
  const { t } = useTranslation();
  const { chartData, isLoading, stakingRatio, clearHistory } = useChartData();

  return (
    <Card className="component">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t("liveChart")}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearHistory}
          className="h-8 w-8"
          title="Clear history"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Staking Ratio %
          </p>
          {stakingRatio > 0 && (
            <p className="text-xs font-medium text-primary">
              Current: {stakingRatio}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChart;
