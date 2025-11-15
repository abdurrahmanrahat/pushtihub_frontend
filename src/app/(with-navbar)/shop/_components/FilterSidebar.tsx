"use client";

import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TCategory } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FilterSidebar = ({ categories }: { categories: TCategory[] }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPrice = 2000;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const [localMin, setLocalMin] = useState(0);
  const [localMax, setLocalMax] = useState(maxPrice);

  // 🧩 Toggle parent category (only toggles itself)
  const handleCategoryToggle = (
    slug: string,
    checked: boolean,
    categoryId?: string
  ) => {
    setSelectedCategories((prev) =>
      checked ? [...new Set([...prev, slug])] : prev.filter((x) => x !== slug)
    );

    // auto-open accordion if category has subcategories
    if (checked && categoryId && !openItems.includes(categoryId)) {
      setOpenItems((prev) => [...prev, categoryId]);
    }
  };

  // Initialize state from URL
  useEffect(() => {
    const existingCategory = searchParams.get("category") || "";
    const existingMinPrice = searchParams.get("minPrice") || 0;
    const existingMaxPrice = searchParams.get("maxPrice") || maxPrice;

    setSelectedCategories(existingCategory ? existingCategory.split(",") : []);
    setLocalMin(existingMinPrice ? Number(existingMinPrice) : 0);
    setLocalMax(existingMaxPrice ? Number(existingMaxPrice) : maxPrice);
    setPriceRange([
      existingMinPrice ? Number(existingMinPrice) : 0,
      existingMaxPrice ? Number(existingMaxPrice) : maxPrice,
    ]);
  }, [searchParams]);

  // category filter
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [selectedCategories, router, searchParams]);

  // Price input validation
  const handlePriceInputChange = () => {
    const min = Math.max(0, Number(localMin));
    const max = Math.min(maxPrice, Number(localMax));
    if (min <= max) {
      setPriceRange([min, max]);
    }
  };

  useEffect(() => {
    setLocalMin(priceRange[0]);
    setLocalMax(priceRange[1]);
  }, [priceRange]);

  // apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceRange[0] > 0) {
      params.set("minPrice", String(priceRange[0]));
    } else {
      params.delete("minPrice");
    }

    if (priceRange[1] < maxPrice) {
      params.set("maxPrice", String(priceRange[1]));
    } else {
      params.delete("maxPrice");
    }

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    router.push(newUrl, { scroll: false });
  };

  // 🧩 Clear filters
  const handleClearAll = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setLocalMin(0);
    setLocalMax(maxPrice);

    router.push(window.location.pathname, { scroll: false });
  };

  const isPriceChanged = priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg 2xl:text-xl">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="2xl:text-lg font-medium mb-3">Categories</h4>
        <Accordion
          type="multiple"
          className="w-full "
          value={openItems}
          onValueChange={setOpenItems}
        >
          {!categories || categories?.length === 0 ? (
            <NoDataFoundBySearchFilter
              title="Categories not found!"
              description="Try searching for something else or clear all filters to explore available collections."
            />
          ) : (
            <>
              {categories.map((category) => (
                <AccordionItem
                  key={category._id}
                  value={category._id}
                  className="py-2 text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Checkbox
                        id={`category-${category._id}`}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={(checked) =>
                          handleCategoryToggle(
                            category.slug,
                            checked as boolean,
                            category._id
                          )
                        }
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`category-${category._id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {category.name}
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        ({category?.productsCount || 0})
                      </span>
                    </div>
                    {category.subCategories?.length > 0 && (
                      <AccordionTrigger className="ml-2 cursor-pointer" />
                    )}
                  </div>

                  {category.subCategories?.length ? (
                    <AccordionContent>
                      <div className="pl-6 space-y-2">
                        {category.subCategories.map((sub) => (
                          <div
                            key={sub._id}
                            className="flex items-center justify-between py-1"
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`sub-${sub._id}`}
                                checked={selectedCategories.includes(sub.slug)}
                                onCheckedChange={(checked) =>
                                  handleCategoryToggle(
                                    sub.slug,
                                    checked as boolean
                                  )
                                }
                                className="cursor-pointer"
                              />
                              <Label
                                htmlFor={`sub-${sub._id}`}
                                className="cursor-pointer text-sm"
                              >
                                {sub.name}
                              </Label>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({sub?.productsCount || 0})
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  ) : null}
                </AccordionItem>
              ))}
            </>
          )}
        </Accordion>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="2xl:text-lg font-medium mb-3">Price Range</h4>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            step={10}
            className="w-full"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="text-xs">
                Min
              </Label>
              <Input
                id="min-price"
                type="number"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.valueAsNumber || 0)}
                onBlur={handlePriceInputChange}
                min={0}
                max={maxPrice}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs">
                Max
              </Label>
              <Input
                id="max-price"
                type="number"
                value={localMax}
                onChange={(e) =>
                  setLocalMax(e.target.valueAsNumber || maxPrice)
                }
                onBlur={handlePriceInputChange}
                min={0}
                max={maxPrice}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <Button
        className="w-full"
        onClick={applyFilters}
        disabled={!isPriceChanged}
      >
        Apply Filters
      </Button>
    </div>
  );
};
