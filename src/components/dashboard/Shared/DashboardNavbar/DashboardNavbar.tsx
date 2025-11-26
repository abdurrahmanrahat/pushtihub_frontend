"use client";

import MyLogo from "@/components/shared/Ui/MyLogo";
import { TUser } from "@/types";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { SidebarItem } from "../Sidebar/Sidebar.helpers";
import { adminSidebarItems, userSidebarItems } from "../Sidebar/sidebar.utils";
import SidebarProfile from "../Sidebar/SidebarProfile";

export default function DashboardNavbar({
  role,
  user,
  children,
}: {
  role: "user" | "admin";
  user: TUser;
  children: ReactNode;
}) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const pathname = usePathname();

  // Toggle function to handle the navbar's display
  const handleNavToggle = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  // Function to handle clicks outside of the navbar
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const navbar = document.getElementById("navbar");
  //     if (isOpenMenu && navbar && !navbar.contains(event.target as Node)) {
  //       setIsOpenMenu(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpenMenu]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpenMenu(false);
  }, [pathname]);

  return (
    <div>
      {/* Header */}
      <div className="w-full border-b border-gray-200 dark:border-gray-700 lg:border-none">
        <div className="lg:hidden">
          <div className="w-[92%] mx-auto flex justify-between items-center ">
            <div>
              <Link href={`/`}>
                <MyLogo width={160} height={100} />
              </Link>
            </div>

            <div
              onClick={handleNavToggle}
              className="block lg:hidden text-gray-900 dark:text-gray-100"
            >
              {isOpenMenu ? <X /> : <Menu />}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="navbar"
          className={`fixed lg:hidden top-0 left-0 bg-white dark:bg-deep-dark w-[70%] md:w-[50%] border-r border-gray-300 dark:border-gray-700 h-screen ease-in-out duration-700 z-[10] p-[20px] ${
            isOpenMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full relative">
            {/* Logo */}
            <div className=" flex justify-center items-center">
              <Link href={`/`}>
                <MyLogo width={160} height={100} />
              </Link>
            </div>

            {/* Mobile nav items */}
            <nav className="mt-4">
              <div className="space-y-[6px]">
                {role === "user" &&
                  userSidebarItems.map((item, index) => (
                    <SidebarItem key={index} item={item} />
                  ))}

                {role === "admin" &&
                  adminSidebarItems.map((item, index) => (
                    <SidebarItem key={index} item={item} />
                  ))}
              </div>
            </nav>

            <div className="absolute bottom-2 left-0 w-full z-[20]">
              <SidebarProfile user={user} />
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="w-[90%] max-w-[1280px] mx-auto my-8 text-gray-900 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
}
