import { Metadata } from "next";
import { ReactNode } from "react";
import UserLayout from "./layout/UserLayout";

export const metadata: Metadata = {
  title: "User Dashboard | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const UserDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <UserLayout>{children}</UserLayout>
    </div>
  );
};

export default UserDashboardLayout;
