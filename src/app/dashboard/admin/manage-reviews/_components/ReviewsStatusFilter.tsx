"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const reviewStatusOptions = [
  { label: "All Reviews", value: "all" },
  { label: "Verified", value: "true" },
  { label: "Unverified", value: "false" },
];

const ReviewsStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const existing = searchParams.get("isVerified") || "";
    setStatus(existing);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (status && status !== "all") {
      params.set("isVerified", status);
    } else {
      params.delete("isVerified");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [status, router, searchParams]);

  const handleChange = (value: string) => {
    setStatus(value === "all" ? "" : value);
  };

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger className="w-auto md:w-[180px] bg-card">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <SelectValue placeholder="Filter by Status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {reviewStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ReviewsStatusFilter;
