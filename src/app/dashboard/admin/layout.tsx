import { Metadata } from "next";
import { ReactNode } from "react";
import AdminLayout from "./layout/AdminLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard | Pushtihub",
  description: "Eat & Live Healthy",
};

const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
};

export default AdminDashboardLayout;
