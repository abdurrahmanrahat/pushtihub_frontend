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

const ratingOptions = [
  { label: "All Ratings", value: "all" },
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  { label: "3 Stars", value: "3" },
  { label: "2 Stars", value: "2" },
  { label: "1 Star", value: "1" },
];

const ReviewRatingFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rating, setRating] = useState("");

  useEffect(() => {
    const existing = searchParams.get("rating") || "";
    setRating(existing);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (rating && rating !== "all") {
      params.set("rating", rating);
    } else {
      params.delete("rating");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [rating, router, searchParams]);

  const handleChange = (value: string) => {
    setRating(value === "all" ? "" : value);
  };

  return (
    <Select value={rating} onValueChange={handleChange}>
      <SelectTrigger className="w-auto md:w-[180px] bg-card">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <SelectValue placeholder="Filter by Rating" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {ratingOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ReviewRatingFilter;
