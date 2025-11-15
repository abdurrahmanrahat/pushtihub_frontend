"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardAnalyticsCharts = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    primary: "var(--color-primary)",
    grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    axis: isDark ? "#9CA3AF" : "#6B7280",
    text: isDark ? "#E5E7EB" : "#374151",
    tooltipBg: isDark ? "var(--color-deep-dark)" : "#FFFFFF",
    tooltipBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  };

  return (
    <TabsContent
      value="analytics"
      className="space-y-4 transition-colors duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Funnel</CardTitle>
            <CardDescription>
              Customer journey from visit to purchase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { stage: "Visitors", count: 15420, percentage: 100 },
                  { stage: "Product Views", count: 8234, percentage: 53.4 },
                  { stage: "Add to Cart", count: 3521, percentage: 22.8 },
                  { stage: "Checkout", count: 1876, percentage: 12.2 },
                  { stage: "Purchase", count: 1523, percentage: 9.9 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="stage"
                  stroke={colors.axis}
                  tick={{ fill: colors.text, fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke={colors.axis}
                  tick={{ fill: colors.text, fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: "8px",
                    color: colors.text,
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toLocaleString()} (${props.payload.percentage}%)`,
                    "Count",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill={colors.primary}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Sources</CardTitle>
            <CardDescription>Where your customers come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { source: "Direct", visits: 4850, conversion: 12.3 },
                  { source: "Organic Search", visits: 6720, conversion: 15.8 },
                  { source: "Social Media", visits: 2340, conversion: 8.9 },
                  { source: "Email", visits: 1890, conversion: 18.5 },
                  { source: "Referral", visits: 1620, conversion: 10.2 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="source"
                  stroke={colors.axis}
                  tick={{ fill: colors.text, fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke={colors.axis}
                  tick={{ fill: colors.text, fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: "8px",
                    color: colors.text,
                  }}
                  formatter={(value: number, name: string) =>
                    name === "visits"
                      ? [`${value.toLocaleString()} visits`, "Visits"]
                      : [`${value}%`, "Conversion Rate"]
                  }
                />
                <Bar
                  dataKey="visits"
                  fill={colors.primary}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Category</CardTitle>
            <CardDescription>
              Sales performance across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  {
                    month: "Jul",
                    smartphones: 12400,
                    laptops: 18200,
                    accessories: 5600,
                    tablets: 8900,
                  },
                  {
                    month: "Aug",
                    smartphones: 15800,
                    laptops: 21500,
                    accessories: 6800,
                    tablets: 9500,
                  },
                  {
                    month: "Sep",
                    smartphones: 13200,
                    laptops: 19800,
                    accessories: 7200,
                    tablets: 10200,
                  },
                  {
                    month: "Oct",
                    smartphones: 18600,
                    laptops: 24300,
                    accessories: 8100,
                    tablets: 11800,
                  },
                  {
                    month: "Nov",
                    smartphones: 21500,
                    laptops: 28900,
                    accessories: 9500,
                    tablets: 13200,
                  },
                  {
                    month: "Dec",
                    smartphones: 25300,
                    laptops: 32100,
                    accessories: 11200,
                    tablets: 15600,
                  },
                  {
                    month: "Jan",
                    smartphones: 19800,
                    laptops: 26700,
                    accessories: 8900,
                    tablets: 12400,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="month"
                  stroke={colors.axis}
                  tick={{ fill: colors.text }}
                />
                <YAxis
                  stroke={colors.axis}
                  tick={{ fill: colors.text }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: "8px",
                    color: colors.text,
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="smartphones"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="laptops"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="accessories"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="tablets"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Insights</CardTitle>
            <CardDescription>
              Customer behavior and value metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold text-foreground">$289.50</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      +12.5%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Customer Lifetime Value
                  </p>
                  <p className="text-2xl font-bold text-foreground">$1,247</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      +8.3%
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Distribution Chart */}
              <ResponsiveContainer width="100%" height={150}>
                <BarChart
                  data={[
                    { type: "New Customers", count: 542 },
                    { type: "Returning", count: 1289 },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis type="number" stroke={colors.axis} />
                  <YAxis
                    type="category"
                    dataKey="type"
                    stroke={colors.axis}
                    tick={{ fill: colors.text }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.tooltipBg,
                      border: `1px solid ${colors.tooltipBorder}`,
                      borderRadius: "8px",
                      color: colors.text,
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={colors.primary}
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default DashboardAnalyticsCharts;
