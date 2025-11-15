"use client";

import { Input } from "@/components/ui/input";
import useDebounced from "@/hooks/useDebounced";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const OrdersSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounced(searchTerm, 600);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL param
  useEffect(() => {
    const existingSearch = searchParams.get("searchTerm") || "";
    setSearchTerm(existingSearch);
  }, [searchParams]);

  // Update URL only after debounce delay
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm.trim()) {
      params.set("searchTerm", debouncedSearchTerm.trim());
    } else {
      params.delete("searchTerm");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    // const newUrl = params.toString() ?
    //    `/dashboard/admin/manage-products?${params.toString()}`
    //   : "/dashboard/admin/manage-products";

    router.push(newUrl, { scroll: false });
  }, [debouncedSearchTerm, router, searchParams]);

  // Optional: Handle Enter press for instant search
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.set("searchTerm", searchTerm.trim());
      }

      router.push(`?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search order..."
        value={searchTerm}
        onKeyDown={handleKeyPress}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-card"
      />
    </div>
  );
};

export default OrdersSearch;
