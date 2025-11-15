import { Metadata } from "next";
import DashboardCharts from "./_components/DashboardCharts";
import DashboardHeaderBanner from "./_components/DashboardHeaderBanner";
import DashboardStats from "./_components/DashboardStats";
import PendingOrdersTable from "./_components/PendingOrdersTable";

export const metadata: Metadata = {
  title: "Dashboard | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const AdminDashboardHomePage = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Header Banner */}
      <DashboardHeaderBanner />

      <main className="py-6 md:py-8">
        {/* Stats Grid */}
        <DashboardStats />

        {/* Charts Section */}
        <DashboardCharts />

        {/* Pending Orders Table */}
        <PendingOrdersTable />
      </main>
    </div>
  );
};

export default AdminDashboardHomePage;
