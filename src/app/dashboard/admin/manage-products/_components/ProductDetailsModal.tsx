import ProductGallery from "@/components/common/Product/ProductGallery";
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
  return (
    <Dialog>
      {/* Trigger button */}
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
          {/* Image Gallery */}
          <ProductGallery images={product.images} />

          {/* Product Details */}
          <div className="space-y-3">
            <h2 className="text-lg 2xl:text-xl font-semibold">
              {product.name}
            </h2>

            {product.variants?.length > 0 ? (
              <div className="flex gap-1 items-center">
                <span className="text-lg md:text-xl 2xl:text-2xl font-semibold text-primary">
                  ৳{product.variants[0].items[0].sellingPrice}
                </span>
                <span>({product.variants[0].items[0].value})</span>
              </div>
            ) : (
              <p className="text-sm text-red-500">
                No pricing available — product has no valid variants.
              </p>
            )}

            <Separator />

            {/* Variant Overview */}
            <div className="space-y-3">
              <h4 className="text-sm 2xl:text-base font-medium text-muted-foreground">
                Available Variants
              </h4>

              {product.variants.length > 0 ? (
                <div className="space-y-4">
                  {product.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="border border-border p-3 rounded-md"
                    >
                      <p className="font-medium capitalize mb-2 text-sm">
                        {variant.type}
                      </p>

                      <div className="flex flex-col gap-2">
                        {variant.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between border border-border rounded-md px-3 py-2"
                          >
                            {/* Left Side: Variant Label */}
                            <span className="font-medium">{item.value}</span>

                            {/* Right Side: Pricing + Stock */}
                            <div className="flex items-center gap-3">
                              {/* sellingPrice */}
                              <span className="font-semibold text-primary">
                                ৳{item.sellingPrice}
                              </span>

                              {/* price (del) */}
                              {item.price !== item.sellingPrice && (
                                <del className="text-muted-foreground text-sm">
                                  ৳{item.price}
                                </del>
                              )}

                              {/* Stock */}
                              <Badge variant="outline" className="text-xs">
                                Stock: {item.stock}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm 2xl:text-base text-muted-foreground">
                  No variants found.
                </p>
              )}
            </div>

            <Separator />

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Sales</span>
                </div>
                <p className="text-lg font-semibold">
                  {product.salesCount} Sold
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">Rating</span>
                </div>
                <div className="lg:flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.averageRatings)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {product.averageRatings.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.totalReviews} reviews)
                  </span>
                </div>
              </div>

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
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
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

        {/* Description */}
        <div className="space-y-3 mt-4">
          <h3 className="text-lg xl:text-xl font-semibold">
            Product Description
          </h3>
          <div
            className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground html-content"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />
        </div>

        {/* Action Buttons */}
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
