"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TProduct, TSelectedVariant } from "@/types";
import { slugToTitle } from "@/utils/createSlug";
import { Tag } from "lucide-react";
import { useMemo, useState } from "react";
import ProductActions from "./ProductActions";

const ProductShortSummary = ({ product }: { product: TProduct }) => {
  /* -------------------------------------------------------
     DEFAULT SELECTED VARIANTS (first option of each variant)
  -------------------------------------------------------- */
  const [selectedVariants, setSelectedVariants] = useState<TSelectedVariant[]>(
    product.variants.map((v) => ({
      type: v.type,
      item: v.items[0], // FIRST ITEM DEFAULT
    }))
  );

  /* ------------------------------
     Derived: selected item summary
  ------------------------------- */
  const selectedSummary = useMemo(() => {
    let sellingPrice = 0;
    let originalPrice = 0;
    let totalStock = Infinity; // restrict by lowest stock

    selectedVariants.forEach((sv) => {
      sellingPrice += sv.item.sellingPrice;
      originalPrice += sv.item.price;
      totalStock = Math.min(totalStock, sv.item.stock);
    });

    const discountTk =
      originalPrice > sellingPrice ? originalPrice - sellingPrice : 0;

    return { sellingPrice, originalPrice, discountTk, totalStock };
  }, [selectedVariants]);

  /* ------------------------------
      Update variant selection
  ------------------------------- */
  const updateVariant = (type: string, itemIndex: number) => {
    setSelectedVariants((prev) =>
      prev.map((v) =>
        v.type === type
          ? {
              type,
              item: product.variants.find((x) => x.type === type)!.items[
                itemIndex
              ],
            }
          : v
      )
    );
  };

  return (
    <div>
      {/* FINAL PRICE */}
      <div className="flex items-baseline gap-3">
        <span className="text-lg md:text-2xl font-semibold text-primary">
          ৳{selectedSummary.sellingPrice}
        </span>

        {selectedSummary.originalPrice > selectedSummary.sellingPrice && (
          <span className="text-base md:text-lg font-medium text-gray-600 line-through">
            ৳{selectedSummary.originalPrice}
          </span>
        )}
      </div>

      {/* STOCK */}
      <div className="flex items-center gap-2 mt-1">
        {selectedSummary.totalStock > 0 ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            In Stock ({selectedSummary.totalStock})
          </Badge>
        ) : (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
      </div>

      {/* VARIANT PICKERS */}
      <div className="mt-4 space-y-4">
        {product.variants.map((variant) => (
          <div key={variant.type}>
            <p className="text-sm font-semibold capitalize mb-1">
              Select {variant.type}
            </p>

            <div className="flex flex-wrap gap-2">
              {variant.items.map((item, i) => {
                const active =
                  selectedVariants.find((sv) => sv.type === variant.type)?.item
                    .value === item.value;

                return (
                  <Button
                    key={i}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateVariant(variant.type, i)}
                    className="border border-primary"
                  >
                    {item.value} — ৳{item.sellingPrice}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* DISCOUNT */}
      {selectedSummary.discountTk > 0 && (
        <Badge className="mt-2 bg-destructive text-white">
          Save ৳{selectedSummary.discountTk}
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

      {/* Actions (Cart/Wishlist) */}
      <div className="mt-6">
        <ProductActions
          product={product}
          selectedVariants={selectedVariants}
          selectedStock={selectedSummary.totalStock}
        />
      </div>
    </div>
  );
};

export default ProductShortSummary;
