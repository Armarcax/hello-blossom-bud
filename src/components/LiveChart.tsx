import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { ethers } from "ethers";

interface ChartData {
  name: string;
  value: number;
}

const LiveChart = () => {
  const { t } = useTranslation();
  const { readContract } = useContract();
  const [chartData, setChartData] = useState<ChartData[]>([
    { name: "Jan", value: 100 },
    { name: "Feb", value: 120 },
    { name: "Mar", value: 115 },
    { name: "Apr", value: 140 },
    { name: "May", value: 155 },
    { name: "Jun", value: 180 },
  ]);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (!readContract) return;

      try {
        // Fetch current token metrics
        const [totalSupply, totalStaked] = await Promise.all([
          readContract.totalSupply(),
          readContract.getTotalStaked(),
        ]);

        const supply = parseFloat(ethers.utils.formatEther(totalSupply));
        const staked = parseFloat(ethers.utils.formatEther(totalStaked));
        
        // Calculate a simple price metric based on staking ratio
        const stakingRatio = (staked / supply) * 100;
        
        // Update chart with new data point
        setChartData(prev => {
          const now = new Date();
          const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
          
          const newData = [...prev.slice(-11), { 
            name: timeLabel, 
            value: Math.round(stakingRatio * 10) / 10 
          }];
          
          return newData;
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchTokenPrice();
    const interval = setInterval(fetchTokenPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [readContract]);

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t("liveChart")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Staking Ratio %
        </p>
      </CardContent>
    </Card>
  );
};

export default LiveChart;
