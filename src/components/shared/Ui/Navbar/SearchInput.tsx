"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounced from "@/hooks/useDebounced";
import { cn } from "@/lib/utils";
import { TProduct } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoaderSpinner } from "../Loader/LoaderSpinner";
import SearchProductCard from "./SearchProductCard";

const SearchInput = () => {
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [query, setQuery] = useState("");
  // const [readOnly, setReadOnly] = useState(true);

  const [results, setResults] = useState<TProduct[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const debounced = useDebounced(query, 600);

  // fetch products
  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKED_URL}/products?searchTerm=${debounced}`,
          {
            signal: controller.signal,
          }
        );

        const data = await res.json();

        setResults(data?.data?.data || []);
      } catch (err) {
        if ((err as any).name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [debounced]);

  // detect typing (for instant loading state)
  useEffect(() => {
    setIsTyping(query !== debounced);
  }, [query, debounced]);

  const handleCardClick = (slug: string) => {
    router.push(`/shop/${slug}`);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    // inputRef.current?.focus();
  };

  const isLoading = loading || isTyping;

  return (
    <div className="relative w-full md:max-w-sm lg:max-w-md">
      {/* Search Icon */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4"
        strokeWidth={2}
      />

      {/* Clear icon */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 2xl:h-5 w-4 2xl:w-5" />
        </button>
      )}

      {/* Input Field */}
      <Input
        ref={inputRef}
        type="text"
        // readOnly={readOnly}
        value={query}
        placeholder="Search products..."
        // onClick={() => setReadOnly(false)}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "pl-9 pr-8 py-[10px] 2xl:py-5 text-sm rounded-md border border-gray-200 dark:border-gray-700",
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none",
          "transition-all duration-300 ease-in-out"
        )}
      />

      {/* Search Results */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-11 left-0 w-full bg-white dark:bg-gray-900 shadow-lg rounded-md z-50 max-h-[320px] overflow-auto border border-gray-200 dark:border-gray-800 p-3"
          >
            {isLoading ? (
              <div className="text-center py-8">
                <LoaderSpinner />
                <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400 mt-2 animate-pulse">
                  Searching...
                </p>
              </div>
            ) : results.length > 0 ? (
              <div>
                {results.slice(0, 8).map((product, i) => (
                  <div key={product._id}>
                    <SearchProductCard
                      product={product}
                      onCardClick={handleCardClick}
                    />
                    {i < results.length - 1 && (
                      <hr className="my-3 border border-gray-100 dark:border-gray-800" />
                    )}
                  </div>
                ))}
                {results.length > 8 && (
                  <div className="mt-4 flex justify-center items-center">
                    <Link href="/shop">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border border-primary dark:border-primary text-primary"
                      >
                        View More
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 md:py-4 text-center">
                {/* Icon */}
                <div className="p-3 rounded-full bg-gray-100 dark:bg-deep-dark mb-3">
                  <PackageSearch className="w-7 2xl:w-9 h-7 2xl:h-9 text-gray-500 dark:text-gray-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg 2xl:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Products not found!
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-sm 2xl:text-base max-w-md">
                  Try searching for something else to explore available
                  collections.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;
