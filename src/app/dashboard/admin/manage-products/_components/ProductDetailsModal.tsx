"use client";

import ProductGallery from "@/components/common/Product/ProductGallery";
import { Rating } from "@/components/common/Product/Rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TProduct } from "@/types/product.type";
import { slugToTitle } from "@/utils/createSlug";
import { Calendar, Eye, Pencil, Star, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";

/* ---------- Helpers ---------- */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProductDetailsModal = ({ product }: { product: TProduct }) => {
  const primary = product.variants?.primary;
  const secondary = product.variants?.secondary || {};

  const firstPrimaryItem = primary?.items?.[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="!max-w-4xl max-h-[90vh] overflow-y-auto scroll-hidden"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="hidden"></DialogTitle>

        <div className="grid gap-6 md:grid-cols-2 place-items-center">
          {/* ---------------------------------- */}
          {/* IMAGE GALLERY */}
          {/* ---------------------------------- */}
          <ProductGallery images={product.images} />

          {/* ---------------------------------- */}
          {/* PRODUCT DETAILS */}
          {/* ---------------------------------- */}
          <div className="space-y-4">
            {/* TITLE */}
            <h2 className="text-xl font-semibold">{product.name}</h2>

            {/* PRICE BLOCK */}
            {firstPrimaryItem ? (
              <div className="flex gap-2 items-center">
                <span className="text-2xl font-semibold text-primary">
                  ৳{firstPrimaryItem.sellingPrice}
                </span>

                {firstPrimaryItem.price !== firstPrimaryItem.sellingPrice && (
                  <del className="text-muted-foreground text-base">
                    ৳{firstPrimaryItem.price}
                  </del>
                )}

                <span className="text-sm text-muted-foreground">
                  ({firstPrimaryItem.value})
                </span>
              </div>
            ) : (
              <p className="text-sm text-red-500">No valid price available.</p>
            )}

            <Separator />

            {/* ---------------------------------- */}
            {/* PRIMARY VARIANT */}
            {/* ---------------------------------- */}
            {primary ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Primary Variant — {primary.type.toUpperCase()}
                </h4>

                <div className="space-y-2">
                  {primary.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border border-border px-3 py-2 rounded-md"
                    >
                      <span className="font-medium">{item.value}</span>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-primary">
                          ৳{item.sellingPrice}
                        </span>

                        {item.price !== item.sellingPrice && (
                          <del className="text-muted-foreground text-sm">
                            ৳{item.price}
                          </del>
                        )}

                        <Badge variant="outline" className="text-xs">
                          Stock: {item.stock}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No primary variant.
              </p>
            )}

            {/* ---------------------------------- */}
            {/* SECONDARY VARIANTS */}
            {/* ---------------------------------- */}
            {Object.keys(secondary).length > 0 && (
              <>
                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Secondary Variants
                  </h4>

                  <div className="space-y-3">
                    {secondary.size && secondary.size.length > 0 && (
                      <div>
                        <p className="text-xs mb-1 text-muted-foreground">
                          Size
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {secondary.size.map((s, i) => (
                            <Badge key={i} variant="secondary">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {secondary.color && secondary.color.length > 0 && (
                      <div>
                        <p className="text-xs mb-1 text-muted-foreground">
                          Color
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {secondary.color.map((c, i) => (
                            <Badge key={i} className="bg-gray-300 text-black">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {secondary.weight && secondary.weight.length > 0 && (
                      <div>
                        <p className="text-xs mb-1 text-muted-foreground">
                          Weight
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {secondary.weight.map((w, i) => (
                            <Badge key={i} variant="secondary">
                              {w}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* ---------------------------------- */}
            {/* QUICK INFO */}
            {/* ---------------------------------- */}
            <div className="grid grid-cols-2 gap-4">
              {/* Sales */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Sales</span>
                </div>
                <p className="text-lg font-semibold">
                  {product.salesCount} Sold
                </p>
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">Rating</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Rating rating={product.averageRatings} size="lg" />

                  <div className="flex items-center gap-1">
                    <span className="font-semibold">
                      {product.averageRatings.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({product.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">Category</span>
                </div>
                <p className="text-sm">{slugToTitle(product.category)}</p>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Metadata */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(product.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold">Product Description</h3>
          <div
            className="prose prose-sm max-w-none text-foreground html-content"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
          <Link
            href={`/dashboard/admin/manage-products/${product._id}`}
            className="flex-1"
          >
            <Button className="bg-primary w-full hover:bg-primary/90">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>

          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
