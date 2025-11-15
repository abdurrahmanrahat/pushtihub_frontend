import RevenueTrendChart from "./RevenueTrendChart";
import TopSellingProductsChart from "./TopSellingProductsChart";

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8 overflow-auto">
      {/* Revenue Trend Chart */}
      <RevenueTrendChart />

      {/* Top Selling Products Chart */}
      <TopSellingProductsChart />
    </div>
  );
};

export default DashboardCharts;
