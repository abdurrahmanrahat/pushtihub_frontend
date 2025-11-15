"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RevenueTrendChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Adaptive colors (based on your global CSS)
  const colors = {
    primary: "var(--color-primary)",
    grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    axis: isDark ? "#9CA3AF" : "#6B7280",
    text: isDark ? "#E5E7EB" : "#374151",
    tooltipBg: isDark ? "var(--color-deep-dark)" : "#FFFFFF",
    tooltipBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    prevRevenue: isDark ? "#64748B" : "#94A3B8",
  };

  const revenueData = [
    { date: "Jan 09", revenue: 3240, orders: 18, prevRevenue: 2890 },
    { date: "Jan 10", revenue: 4180, orders: 24, prevRevenue: 3650 },
    { date: "Jan 11", revenue: 2950, orders: 16, prevRevenue: 3120 },
    { date: "Jan 12", revenue: 5320, orders: 29, prevRevenue: 4280 },
    { date: "Jan 13", revenue: 4890, orders: 26, prevRevenue: 4150 },
    { date: "Jan 14", revenue: 6210, orders: 34, prevRevenue: 5320 },
    { date: "Jan 15", revenue: 7450, orders: 41, prevRevenue: 6180 },
  ];

  return (
    <Card className="transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg 2xl:text-2xl">Revenue Overview</CardTitle>
        <CardDescription>
          Daily revenue and order trends (Last 7 days)
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 mx-0 md:p-4">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            {/* Gradients */}
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.primary}
                  stopOpacity={0.35}
                />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.prevRevenue}
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor={colors.prevRevenue}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* Grid & Axes */}
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="date"
              stroke={colors.axis}
              tick={{ fill: colors.text, fontSize: 12 }}
            />
            <YAxis
              stroke={colors.axis}
              tick={{ fill: colors.text, fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                color: colors.text,
              }}
              formatter={(value: number, name: string) => {
                if (name === "revenue" || name === "prevRevenue") {
                  return [
                    `$${value.toLocaleString()}`,
                    name === "revenue" ? "Current Revenue" : "Previous Period",
                  ];
                }
                return [value, name === "orders" ? "Orders" : name];
              }}
            />

            {/* Legend */}
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) =>
                value === "revenue"
                  ? "Current Revenue"
                  : value === "prevRevenue"
                  ? "Previous Period"
                  : "Orders"
              }
            />

            {/* Previous Period (dashed) */}
            <Area
              type="monotone"
              dataKey="prevRevenue"
              stroke={colors.prevRevenue}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrevRevenue)"
              strokeDasharray="5 5"
            />

            {/* Current Revenue (solid) */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={colors.primary}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;
