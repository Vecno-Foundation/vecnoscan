import React from "react";
import type { HashratePoint } from "../hooks/useHashRateHistory";
import { useHashrateHistory } from "../hooks/useHashRateHistory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";

import { format } from "date-fns";

// Dynamic hashrate formatter — matches your Hashrate component
const formatHashrate = (hashrateMh: number): string => {
  const n = hashrateMh;

  if (n < 1_000) return `${n.toFixed(2)} MH/s`;
  if (n < 1_000_000) return `${(n / 1_000).toFixed(2)} GH/s`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(2)} TH/s`;
  if (n < 1_000_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} PH/s`;
  return `${(n / 1_000_000_000_000).toFixed(2)} EH/s`;
};

// Scaled value + unit for Y-axis
const getScaledHashrate = (hashrateMh: number): { value: number; unit: string } => {
  const n = hashrateMh;

  if (n < 1_000) return { value: n, unit: "MH/s" };
  if (n < 1_000_000) return { value: n / 1_000, unit: "GH/s" };
  if (n < 1_000_000_000) return { value: n / 1_000_000, unit: "TH/s" };
  if (n < 1_000_000_000_000) return { value: n / 1_000_000_000, unit: "PH/s" };
  return { value: n / 1_000_000_000_000, unit: "EH/s" };
};

export function meta() {
  return [
    { title: "Vecno Analytics - Network Stats & Charts | Vecnoscan" },
    {
      name: "description",
      content:
        "Analyze the Vecno blockchain with real-time charts and statistics. Track block production, hash rate, difficulty, and network growth.",
    },
    {
      name: "keywords",
      content: "Vecno analytics, blockchain stats, network charts, hash rate, difficulty, block time",
    },
  ];
}

export default function Analytics() {
  const { data, isLoading, error } = useHashrateHistory();

  const chartData = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((point: HashratePoint) => ({
      time: format(new Date(point.timestamp), "MMM d, HH:mm"),
      hashrate: point.hashrate,
    }));
  }, [data?.data]);

  // Determine max hashrate for Y-axis unit
  const maxHashrate = chartData.length > 0
    ? Math.max(...chartData.map(d => d.hashrate))
    : 0;

  const { unit: yAxisUnit } = getScaledHashrate(maxHashrate);

  // Tooltip: full formatted hashrate with unit
  const formatTooltipValue: TooltipProps<number, string>["formatter"] = (value) => {
    if (typeof value !== "number") return "—";
    return formatHashrate(value);
  };

  // Y-axis ticks: clean numbers without decimals
  const formatYAxisTick = (value: number) => {
    const scaled = getScaledHashrate(value);
    return `${scaled.value.toFixed(0)}`;
  };

  return (
    <div className="flex w-full max-w-7xl flex-col items-center rounded-3xl bg-white px-8 py-20 shadow-xl lg:px-16 lg:py-32">
      <div className="mt-8 lg:mt-12" />
      <div className="mb-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
          Vecno Network Analytics
        </h1>
        <p className="mt-4 text-base text-gray-600 sm:text-lg">
          Real-time network hashrate over the last 7 days
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Updated every 10 minutes
        </p>
      </div>
      <div className="mt-12 w-full">
        {isLoading && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-lg text-gray-500">Loading hashrate data...</div>
          </div>
        )}

        {error && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-lg text-red-600">
              Error loading hashrate data. Please try again later.
            </div>
          </div>
        )}

        {chartData.length === 0 && !isLoading && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-lg text-gray-500">No hashrate data available yet.</div>
          </div>
        )}

        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={480}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 13 }}
                interval="preserveStartEnd"
                angle={-45}
                textAnchor="end"
                height={90}
                tickMargin={10}
              />
              <YAxis
                tick={{ fontSize: 13 }}
                tickFormatter={formatYAxisTick}
                label={{
                  value: `Hashrate (${yAxisUnit})`,
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 16, fontWeight: 500 },
                  offset: -10,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}
                formatter={formatTooltipValue}
              />
              <Line
                type="monotone"
                dataKey="hashrate"
                stroke="#2563eb"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 3, stroke: "#1d4ed8" }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-20 text-center text-sm text-gray-500">
        Source: Vecnoscan API
      </div>
    </div>
  );
}