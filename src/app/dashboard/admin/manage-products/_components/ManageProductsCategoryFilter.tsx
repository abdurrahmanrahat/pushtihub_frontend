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

type TManageProductsCategoryFilterProps = {
  categories: { value: string; label: string }[];
};

const ManageProductsCategoryFilter = ({
  categories,
}: TManageProductsCategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load existing category from URL on mount
  useEffect(() => {
    const existingCategory = searchParams.get("category") || "all";
    setSelectedCategory(existingCategory);
  }, [searchParams]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [selectedCategory, router, searchParams]);

  return (
    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
      <SelectTrigger className="w-full sm:w-[180px] bg-card">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>

        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ManageProductsCategoryFilter;
