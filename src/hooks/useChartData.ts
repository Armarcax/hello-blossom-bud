import { useState, useEffect, useCallback, useRef } from 'react';
import { useTokenMetrics } from './useWeb3Query';

interface ChartDataPoint {
  name: string;
  value: number;
  timestamp: number;
}

const MAX_DATA_POINTS = 12;
const STORAGE_KEY = 'hayq_chart_data';

// Load cached chart data from localStorage
const loadCachedData = (): ChartDataPoint[] => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const data = JSON.parse(cached) as ChartDataPoint[];
      // Filter out data older than 1 hour
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      return data.filter(point => point.timestamp > oneHourAgo);
    }
  } catch {
    // Ignore parse errors
  }
  return [];
};

// Save chart data to localStorage
const saveCachedData = (data: ChartDataPoint[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.slice(-MAX_DATA_POINTS)));
  } catch {
    // Ignore storage errors
  }
};

// Default data when no real data is available
const getDefaultData = (): ChartDataPoint[] => {
  const now = Date.now();
  return [
    { name: 'Jan', value: 100, timestamp: now - 300000 },
    { name: 'Feb', value: 120, timestamp: now - 240000 },
    { name: 'Mar', value: 115, timestamp: now - 180000 },
    { name: 'Apr', value: 140, timestamp: now - 120000 },
    { name: 'May', value: 155, timestamp: now - 60000 },
    { name: 'Jun', value: 180, timestamp: now },
  ];
};

export const useChartData = () => {
  const { data: metrics, isLoading, isError } = useTokenMetrics();
  const [chartData, setChartData] = useState<ChartDataPoint[]>(() => {
    const cached = loadCachedData();
    return cached.length > 0 ? cached : getDefaultData();
  });
  const lastUpdateRef = useRef<number>(0);

  // Update chart data when metrics change
  useEffect(() => {
    if (!metrics?.timestamp || metrics.timestamp <= lastUpdateRef.current) {
      return;
    }

    lastUpdateRef.current = metrics.timestamp;

    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    setChartData(prev => {
      const newPoint: ChartDataPoint = {
        name: timeLabel,
        value: metrics.stakingRatio,
        timestamp: metrics.timestamp,
      };

      // Avoid duplicate entries
      if (prev.length > 0 && prev[prev.length - 1].timestamp === metrics.timestamp) {
        return prev;
      }

      const newData = [...prev.slice(-(MAX_DATA_POINTS - 1)), newPoint];
      saveCachedData(newData);
      return newData;
    });
  }, [metrics?.timestamp, metrics?.stakingRatio]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChartData(getDefaultData());
    lastUpdateRef.current = 0;
  }, []);

  return {
    chartData,
    isLoading,
    isError,
    stakingRatio: metrics?.stakingRatio ?? 0,
    totalSupply: metrics?.totalSupply ?? '0',
    clearHistory,
  };
};
