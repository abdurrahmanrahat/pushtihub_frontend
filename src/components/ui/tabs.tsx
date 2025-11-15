"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-full items-center justify-between rounded-md bg-gray-100 dark:bg-deep-dark border border-gray-200 dark:border-gray-700 p-[2px] shadow-inner",
        "transition-colors duration-300 ease-in-out",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={cn(
        "relative flex-1 select-none text-sm 2xl:text-base font-medium px-4 py-2 transition-all duration-300",
        "text-gray-600 dark:text-gray-300 hover:text-primary",
        "data-[state=active]:text-primary data-[state=active]:shadow-[0_0_10px_rgba(0,0,0,0.05)] font-medium cursor-pointer",

        // 🚫 Kill ALL outlines, borders, and rings on focus or click
        "focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0",
        "active:outline-none active:ring-0 active:ring-offset-0",
        "data-[state=active]:outline-none data-[state=active]:ring-0",

        // Prevent browser outline flash (Safari/Chrome)
        "[&:focus:not(:focus-visible)]:outline-none",
        "[&:focus]:shadow-none",

        // Optional smooth transitions
        "transition-colors ease-in-out",
        className
      )}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
