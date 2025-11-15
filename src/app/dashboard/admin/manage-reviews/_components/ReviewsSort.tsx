"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const sortOptions = [
  { label: "Default", value: "all" },
  { label: "Highest Rating", value: "highest_rating" },
  { label: "Lowest Rating", value: "lowest_rating" },
];

const ReviewsSort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("");

  // Load from URL query on mount
  useEffect(() => {
    const existing = searchParams.get("sort") || "";
    setSort(existing);
  }, [searchParams]);

  // Update URL on change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (sort && sort !== "all") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [sort, router, searchParams]);

  const handleChange = (value: string) => {
    setSort(value === "all" ? "" : value);
  };

  return (
    <Select value={sort} onValueChange={handleChange}>
      <SelectTrigger className="w-auto md:w-[180px] bg-card">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ReviewsSort;
