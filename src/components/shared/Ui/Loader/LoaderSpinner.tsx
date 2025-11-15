"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export function LoaderSpinner({
  size = 24,
  color = "#fff",
  strokeWidth = 3,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {/* Background circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          className="fill-none stroke-secondary"
          strokeWidth={strokeWidth}
        />
        {/* Spinner arc - showing only 25% of the circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="62.83"
          strokeDashoffset="50.26"
          opacity="0.8"
        />
      </motion.svg>
    </div>
  );
}
