"use client";

import MyLogo from "@/components/shared/Ui/MyLogo";
import { TUser } from "@/types";
import Link from "next/link";
import { SidebarItem } from "./Sidebar.helpers";
import { adminSidebarItems, userSidebarItems } from "./sidebar.utils";
import SidebarProfile from "./SidebarProfile";

const Sidebar = ({ role, user }: { role: "user" | "admin"; user: TUser }) => {
  return (
    <div className="h-screen fixed border-r border-gray-200 dark:border-gray-700 ">
      <div className="relative h-full w-full py-10 px-3 2xl:px-4">
        {/* logo section */}
        <div className="flex justify-center items-center">
          <Link href={`/`}>
            <MyLogo width={160} height={100} />
          </Link>
        </div>

        {/* Nav items section */}
        <div className="hidden md:flex flex-col mt-8">
          {role === "user" &&
            userSidebarItems.map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}

          {role === "admin" &&
            adminSidebarItems.map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
        </div>

        <div className="absolute bottom-4 left-0 w-full">
          <SidebarProfile user={user} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
