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
  { label: "Price: Low to High", value: "price:low_to_high" },
  { label: "Price: High to Low", value: "price:high_to_low" },
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best_selling" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Ascending (A–Z)", value: "ascending" },
  { label: "Descending (Z–A)", value: "descending" },
];

const ProductsSort = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("");

  // Initialize state from URL
  useEffect(() => {
    const existingSort = searchParams.get("sort") || "";

    setSort(existingSort);
  }, [searchParams]);

  // Update URL whenever sort changes
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
    // const newUrl = params.toString() ?
    //    `/dashboard/admin/manage-products?${params.toString()}`
    //   : "/dashboard/admin/manage-products";

    router.push(newUrl, { scroll: false });
  }, [sort, router, searchParams]);

  const handleSortChange = (value: string) => {
    if (value === "all") {
      setSort("");
    } else {
      setSort(value);
    }
  };

  return (
    <Select value={sort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-auto sm:w-[180px] bg-card">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProductsSort;
