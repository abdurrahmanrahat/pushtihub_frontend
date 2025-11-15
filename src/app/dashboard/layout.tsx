import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard | Pushtihub",
  description: "Eat & Live Healthy",
};

const DashboardMainLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default DashboardMainLayout;
