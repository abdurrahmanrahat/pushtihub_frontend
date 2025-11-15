"use client";

import { cn } from "@/lib/utils";
import "@/styles/loader.css";
import { LoaderSpinner } from "./LoaderSpinner";

interface LoaderProps {
  className?: string;
  text?: string;
}

export function MyLoader({ className, text = "Loading..." }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 min-h-screen p-4",
        className
      )}
    >
      <LoaderSpinner strokeWidth={2} size={60} />

      {text && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
