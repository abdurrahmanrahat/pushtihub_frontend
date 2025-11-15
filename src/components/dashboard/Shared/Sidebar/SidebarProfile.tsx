"use client";

import { removeTokensFromCookies } from "@/app/actions/token";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutUser } from "@/hooks/useLogoutUser";
import { TUser } from "@/types";
import { ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SidebarProfile = ({ user }: { user: TUser }) => {
  const router = useRouter();
  const logoutUser = useLogoutUser();

  const handleLogout = async () => {
    await removeTokensFromCookies();
    logoutUser();

    toast.success("Logged out successfully!");
    router.push("/");
  };

  const userNameInArray = user?.name?.split(" ");
  const fullname = `${userNameInArray[0]}${
    userNameInArray[1] ? ` ${userNameInArray[1]}` : ""
  }`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus:outline-none focus-visible:outline-none"
      >
        <button
          className="flex items-center gap-1 w-full rounded-lg py-2 px-5 
                     hover:bg-black/5 dark:hover:bg-white/5 
                     transition-colors group cursor-pointer"
        >
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
            <Image
              src={user?.photoUrl || "/images/shared/user-avater.svg"}
              alt={fullname || "Anonymous"}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>

          {/* Name + role */}
          <div className="flex-1 text-left leading-tight">
            <h4 className="text-sm 2xl:text-base font-medium text-gray-900 dark:text-gray-100">
              {fullname || "Anonymous"}
            </h4>
            <p className="text-xs 2xl:text-sm capitalize text-gray-600 dark:text-gray-300">
              {user.role}
            </p>
          </div>

          {/* Icon */}
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown content – auto positions based on viewport */}
      <DropdownMenuContent
        side="bottom"
        align="center"
        className="w-60 xl:w-48 mx-auto rounded-md bg-white dark:bg-deep-dark 
                   border border-gray-200 dark:border-white/10 
                   shadow-lg dark:shadow-[0px_0px_20px_rgba(255,255,255,0.05)]"
      >
        <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400">
          {fullname || "Anonymous"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-primary transition-all duration-300"
          >
            <User className="w-4 h-4" /> My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 dark:text-red-400 focus:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarProfile;
