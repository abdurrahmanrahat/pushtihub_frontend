"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TItemProps = {
  text: string;
  href: string;
  icon: LucideIcon;
};

export const SidebarItem = ({ item }: { item: TItemProps }) => {
  const pathname = usePathname();

  const cleanHref = item.href.split("?")[0];
  const isActive = pathname === cleanHref;

  return (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:bg-primary/10",
        "group relative overflow-hidden",
        isActive && "bg-primary/10 font-medium text-accent-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <item.icon className="w-4 h-4 2xl:w-5 2xl:h-5 text-gray-700 dark:text-gray-300" />
        <span className="text-base 2xl:text-lg text-gray-900 dark:text-gray-100">
          {item.text}
        </span>
      </div>

      {/* Chevron icon (optional) */}
      {/* 
  <ChevronRight
    className={cn(
      "ml-auto h-4 w-4 text-gray-400 dark:text-gray-500",
      "transition-transform duration-300 ease-in-out",
      "group-hover:translate-x-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-200"
    )}
  /> 
  */}

      {isActive && (
        <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-full" />
      )}
    </Link>
  );
};
