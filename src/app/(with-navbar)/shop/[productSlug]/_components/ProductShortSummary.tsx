"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TProduct, TSelectedVariant } from "@/types";
import { slugToTitle } from "@/utils/createSlug";
import { Tag } from "lucide-react";
import { useMemo, useState } from "react";
import ProductActions from "./ProductActions";

/* ------------------------------
   Helpers
------------------------------- */
const getDefaultSelected = (product: TProduct): TSelectedVariant[] => {
  const selections: TSelectedVariant[] = [];

  // PRIMARY — full variant item
  if (product.variants.primary) {
    selections.push({
      type: product.variants.primary.type,
      item: product.variants.primary.items[0],
    });
  }

  // SECONDARY — only value exists → pad the missing fields
  const sec = product.variants.secondary;
  if (sec) {
    Object.entries(sec).forEach(([key, values]) => {
      if (values.length > 0) {
        selections.push({
          type: key as any,
          item: {
            value: values[0],
            price: 0,
            sellingPrice: 0,
            stock: Number.MAX_SAFE_INTEGER, // unlimited stock
          },
        });
      }
    });
  }

  return selections;
};

const ProductShortSummary = ({ product }: { product: TProduct }) => {
  /* -------------------------------------------------------
     DEFAULT SELECTED VARIANTS
  -------------------------------------------------------- */
  const [selectedVariants, setSelectedVariants] = useState<TSelectedVariant[]>(
    getDefaultSelected(product)
  );

  const primary = product.variants.primary;
  const secondary = product.variants.secondary;

  /* ------------------------------
     Calculate Pricing + Stock
------------------------------- */
  const summary = useMemo(() => {
    const selectedPrimary = selectedVariants.find(
      (v) => v.type === primary.type
    );

    const selectedItem = selectedPrimary?.item;

    const sellingPrice = selectedItem?.sellingPrice ?? 0;
    const originalPrice = selectedItem?.price ?? 0;
    const totalStock = selectedItem?.stock ?? 0;

    return {
      sellingPrice,
      originalPrice,
      totalStock,
      discountTk:
        originalPrice > sellingPrice ? originalPrice - sellingPrice : 0,
    };
  }, [selectedVariants, primary.type]);

  /* ------------------------------
      Update variant (primary/secondary)
------------------------------- */
  const updateVariant = (type: string, valueOrIndex: number | string) => {
    setSelectedVariants((prev) =>
      prev.map((v) =>
        v.type === type
          ? {
              type,
              item:
                type === primary.type
                  ? primary.items[valueOrIndex as number] // PRIMARY FULL ITEM
                  : {
                      value: valueOrIndex as string,
                      price: 0,
                      sellingPrice: 0,
                      stock: Number.MAX_SAFE_INTEGER,
                    },
            }
          : v
      )
    );
  };

  return (
    <div>
      {/* PRICE */}
      <div className="flex items-baseline gap-3">
        <span className="text-lg md:text-2xl font-semibold text-primary">
          ৳{summary.sellingPrice}
        </span>

        {summary.originalPrice > summary.sellingPrice && (
          <span className="text-base md:text-lg font-medium text-gray-600 line-through">
            ৳{summary.originalPrice}
          </span>
        )}
      </div>

      {/* STOCK */}
      <div className="flex items-center gap-2 mt-1">
        {summary.totalStock > 0 ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            In Stock ({summary.totalStock})
          </Badge>
        ) : (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
      </div>

      {/* VARIANT PICKERS */}
      <div className="mt-4 space-y-4">
        {/* PRIMARY PICKER */}
        <div>
          <p className="text-sm font-semibold capitalize mb-1">
            Select {primary.type}
          </p>

          <div className="flex flex-wrap gap-2">
            {primary.items.map((item, i) => {
              const active =
                selectedVariants.find((sv) => sv.type === primary.type)?.item
                  .value === item.value;

              return (
                <Button
                  key={i}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateVariant(primary.type, i)}
                  className="border border-primary"
                >
                  {item.value} — ৳{item.sellingPrice}
                </Button>
              );
            })}
          </div>
        </div>

        {/* SECONDARY PICKERS */}
        {secondary &&
          Object.entries(secondary).map(([key, values]) => {
            if (values.length === 0) return null;

            return (
              <div key={key}>
                <p className="text-sm font-semibold capitalize mb-1">
                  Select {key}
                </p>

                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const active =
                      selectedVariants.find((sv) => sv.type === key)?.item
                        ?.value === value;

                    return (
                      <Button
                        key={value}
                        variant={active ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateVariant(key, value)}
                        className="border border-primary"
                      >
                        {value}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* DISCOUNT */}
      {summary.discountTk > 0 && (
        <Badge className="mt-2 bg-destructive text-white">
          Save ৳{summary.discountTk}
        </Badge>
      )}

      {/* CATEGORY */}
      <p className="text-sm font-medium text-muted-foreground mt-2">
        Category:{" "}
        <span className="font-semibold text-foreground">
          {slugToTitle(product.category)}
        </span>
      </p>

      {/* TAGS */}
      <div className="flex items-center gap-2 mt-2">
        <Tag className="h-4 w-4 text-primary" />
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="w-full mt-6">
        <ProductActions
          product={product}
          selectedVariants={selectedVariants}
          selectedStock={summary.totalStock}
        />
      </div>
    </div>
  );
};

export default ProductShortSummary;
