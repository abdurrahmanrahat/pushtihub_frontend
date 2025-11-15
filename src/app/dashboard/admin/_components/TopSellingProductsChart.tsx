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
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TopSellingProductsChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme adaptive colors
  const colors = {
    primary: "var(--color-primary)",
    grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    axis: isDark ? "#9CA3AF" : "#6B7280",
    text: isDark ? "#E5E7EB" : "#374151",
    tooltipBg: isDark ? "var(--color-deep-dark)" : "#FFFFFF",
    tooltipBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  };

  const topProductsData = [
    { name: "iPhone 15 Pro", sales: 1245, revenue: 1493880 },
    { name: "Samsung S24", sales: 892, revenue: 801880 },
    { name: "MacBook Pro", sales: 567, revenue: 1133433 },
    { name: "AirPods Pro", sales: 1834, revenue: 456866 },
    { name: "iPad Air", sales: 723, revenue: 433077 },
    { name: "Galaxy Watch", sales: 445, revenue: 133055 },
  ];

  return (
    <Card className="transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg 2xl:text-2xl">
          Top Selling Products
        </CardTitle>
        <CardDescription>
          Best performing products by sales and revenue
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[350px] md:h-[400px] px-0 mx-0 md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProductsData}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
          >
            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />

            {/* X-Axis → Product Names */}
            <XAxis
              dataKey="name"
              tick={{ fill: colors.text, fontSize: 11 }}
              stroke={colors.axis}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />

            {/* Y-Axis → Numbers */}
            <YAxis
              tick={{ fill: colors.text, fontSize: 11 }}
              stroke={colors.axis}
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
                if (name === "sales")
                  return [`${value.toLocaleString()} units`, "Units Sold"];
                if (name === "revenue")
                  return [`$${value.toLocaleString()}`, "Revenue"];
                return [value, name];
              }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="top"
              align="right"
              className=""
              iconType="circle"
              formatter={(value) =>
                value === "sales"
                  ? "Units Sold"
                  : value === "revenue"
                  ? "Revenue Generated"
                  : value
              }
            />

            {/* Bars */}
            <Bar
              dataKey="sales"
              fill={colors.primary}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="revenue"
              fill={colors.primary}
              opacity={0.7}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopSellingProductsChart;
