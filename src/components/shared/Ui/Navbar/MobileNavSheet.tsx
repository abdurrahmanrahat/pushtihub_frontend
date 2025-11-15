"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TCategory, TResponseUser } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NoDataFoundBySearchFilter from "../Data/NoDataFoundBySearchFilter";
import CategoryItem from "./CategoryItem";
import ThemeToggle from "./ThemeToggle";
import { navItems } from "./navbar.utils";

type TMobileNavSheetProps = {
  user: TResponseUser | null;
  categories: TCategory[];
};

export default function MobileNavSheet({
  user,
  categories,
}: TMobileNavSheetProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"menu" | "categories">("menu");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-gray-800 dark:text-gray-200 focus:outline-none">
          <Menu className="h-6 w-6 mt-1" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[80%] sm:w-[70%] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-deep-dark text-gray-900 dark:text-gray-100 p-0 overflow-hidden"
      >
        <SheetHeader className="p-4">
          <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Menu
          </SheetTitle>
        </SheetHeader>

        {/* Tabs Section */}
        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as any)}
          className="w-full -mt-4"
        >
          {/* Tab Header */}
          <TabsList className="relative grid w-full grid-cols-2 rounded-none bg-transparent h-auto p-0 border-b border-gray-200 dark:border-gray-700">
            {/* Animated underline */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`absolute bottom-0 left-0 h-[2px] w-1/2 bg-primary transition-transform duration-300 ${
                tab === "categories" ? "translate-x-full" : "translate-x-0"
              }`}
            />

            <TabsTrigger
              value="menu"
              className={`relative z-10 font-semibold py-3 transition-colors duration-300 text-gray-800 dark:text-gray-200 data-[state=active]:text-primary data-[state=active]:bg-primary/10`}
            >
              MENU
            </TabsTrigger>

            <TabsTrigger
              value="categories"
              className={`relative z-10 font-semibold py-3 transition-colors duration-300 text-gray-800 dark:text-gray-200 data-[state=active]:text-primary data-[state=active]:bg-primary/10`}
            >
              CATEGORIES
            </TabsTrigger>
          </TabsList>

          {/* Animated Content */}
          <div className="relative h-[calc(100vh-150px)] overflow-y-auto">
            <AnimatePresence mode="wait">
              {tab === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ x: "-30%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "30%", opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="px-4 py-0 mt-0"
                >
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {navItems.map((item) => (
                      <Link
                        href={item.href}
                        key={item.name}
                        className="block py-4 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {user?.role === "admin" && (
                      <Link
                        href="/dashboard/admin"
                        className="block py-4 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}

                    <ThemeToggle />
                  </div>
                </motion.div>
              )}

              {tab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ x: "30%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-30%", opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="px-4 py-0 mt-0"
                >
                  {categories?.length === 0 ? (
                    <NoDataFoundBySearchFilter
                      title="Categories not found!"
                      description="We couldn’t find any product categories right now. Please check back later for new arrivals."
                    />
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {categories.map((category) => (
                        <CategoryItem
                          key={category._id}
                          category={category}
                          onClose={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
