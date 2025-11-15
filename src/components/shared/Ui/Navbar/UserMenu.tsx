"use client";

import { removeTokensFromCookies } from "@/app/actions/token";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutUser } from "@/hooks/useLogoutUser";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter();
  const logoutUser = useLogoutUser();

  const handleLogout = async () => {
    await removeTokensFromCookies();
    logoutUser();

    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <User className="h-5 2xl:h-6 w-5 2xl:w-6 text-gray-700 dark:text-gray-300" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-white dark:bg-deep-dark border border-gray-200 dark:border-gray-800 shadow-md rounded-md"
      >
        <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
          {user?.name || "My Account"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary cursor-pointer"
          >
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
