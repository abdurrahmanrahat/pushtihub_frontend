"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPaginationPageItems } from "./getPaginationPageItems";

const MYPagination = ({
  totalData,
  dataLimit,
}: {
  totalData: number;
  dataLimit: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State derived from URL
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(dataLimit); // default limit

  const totalPages = Math.ceil(totalData / limit);

  // Sync with URL params
  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    const limitParam = Number(searchParams.get("limit")) || dataLimit;

    setCurrentPage(pageParam);
    setLimit(limitParam);
  }, [searchParams, dataLimit]);

  // Create new URL & update router
  const updateParams = (page: number, limitValue?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    if (limitValue && page !== 1) {
      params.set("limit", String(limitValue));
    } else {
      params.delete("limit");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateParams(page, limit);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const pageNumbers = getPaginationPageItems(currentPage, totalPages, isMobile);

  return (
    <Pagination>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <Button
            variant="default"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer mr-2 border-none bg-primary hover:bg-primary/90"
          >
            <span className="block md:hidden">
              <ChevronLeft />
            </span>
            <span className="hidden md:flex items-center gap-[2px]">
              <ChevronLeft />
              <span>Previous</span>
            </span>
          </Button>
        </PaginationItem>

        {/* Pages */}
        {pageNumbers.map((page: string | number, idx: number) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageChange(Number(page))}
                className={`cursor-pointer border border-gray-200 dark:border-gray-700
                      ${
                        page === currentPage
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-card text-foreground hover:bg-light-gray dark:hover:bg-deep-dark"
                      }
                        `}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <Button
            variant="default"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="cursor-pointer ml-2 border-none bg-primary hover:bg-primary/90"
          >
            <span className="block md:hidden">
              <ChevronRight />
            </span>
            <span className="hidden md:flex items-center gap-[2px]">
              <span>Next</span>
              <ChevronRight />
            </span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MYPagination;
