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

export const orderStatusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrdersStatus = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("");

  // Initialize state from URL
  useEffect(() => {
    const existingStatus = searchParams.get("status") || "";

    setStatus(existingStatus);
  }, [searchParams]);

  // Update URL whenever status changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    // const newUrl = params.toString() ?
    //    `/dashboard/admin/manage-products?${params.toString()}`
    //   : "/dashboard/admin/manage-products";

    router.push(newUrl, { scroll: false });
  }, [status, router, searchParams]);

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setStatus("");
    } else {
      setStatus(value);
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full sm:w-[180px] bg-card">
        <SelectValue placeholder="Status by" />
      </SelectTrigger>
      <SelectContent>
        {orderStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrdersStatus;
