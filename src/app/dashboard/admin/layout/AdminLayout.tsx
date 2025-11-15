import { getMeFromDB } from "@/app/actions/users";
import DashboardNavbar from "@/components/dashboard/Shared/DashboardNavbar/DashboardNavbar";
import Sidebar from "@/components/dashboard/Shared/Sidebar/Sidebar";
import { ReactNode } from "react";

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getMeFromDB();

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-2 hidden lg:block">
        <Sidebar role="admin" user={user?.data?.user} />
      </div>
      <div className="col-span-12 lg:col-span-10">
        <DashboardNavbar role="admin" user={user?.data?.user}>
          {children}
        </DashboardNavbar>
      </div>
    </div>
  );
};

export default AdminLayout;
