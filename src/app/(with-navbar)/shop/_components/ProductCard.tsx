import AddToCartButton from "@/components/common/Product/AddToCartButton";
import AddToWishlistButton from "@/components/common/Product/AddToWishlistButton";
import { Rating } from "@/components/common/Product/Rating";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TProduct } from "@/types/product.type";
import Link from "next/link";

/* ------------------------------
   SAFE HELPERS
------------------------------- */
const getFirstItem = (product: TProduct) => {
  const firstVariant = product.variants?.[0];
  return firstVariant?.items?.[0] || null;
};

// total stock = sum of all items in all variants
const getTotalStock = (product: TProduct) => {
  return (
    product.variants
      ?.flatMap((v) => v.items)
      ?.reduce((sum, item) => sum + item.stock, 0) || 0
  );
};

export const ProductCard = ({ product }: { product: TProduct }) => {
  const firstItem = getFirstItem(product);
  const totalStock = getTotalStock(product);

  const sellingPrice = firstItem?.sellingPrice ?? null;
  const originalPrice = firstItem?.price ?? null;

  const discountTk =
    originalPrice && sellingPrice && originalPrice > sellingPrice
      ? originalPrice - sellingPrice
      : 0;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 m-0 p-0">
      <Link href={`/shop/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <MyImage
            src={product.images[0]}
            alt={product.name}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-linear"
          />

          {/* Discount Badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {discountTk > 0 && (
              <Badge variant="destructive" className="font-semibold">
                -৳{discountTk}
              </Badge>
            )}
          </div>
        </div>

        {/* Wishlist / Stock Badge */}
        {totalStock > 0 ? (
          <AddToWishlistButton product={product} />
        ) : (
          <Badge
            variant="destructive"
            className="absolute top-16 right-0 rotate-45 origin-top-right"
          >
            Out of Stock
          </Badge>
        )}

        {/* Content */}
        <CardContent className="py-3 px-3 h-[150px] md:h-[165px] flex flex-col justify-between">
          {/* Product Name */}
          <h4 className="font-medium text-xs md:text-sm 2xl:text-base line-clamp-2 mb-2 leading-[18px] 2xl:leading-5">
            {product.name}
          </h4>

          {/* Bottom Section */}
          <div className="absolute bottom-4 left-3 right-3">
            {/* Rating */}
            <div className="mb-0.5">
              <Rating
                rating={product.averageRatings}
                totalReviews={product.totalReviews}
                size="md"
              />
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-2 mb-2">
              {sellingPrice ? (
                <>
                  {/* sellingPrice (value) */}
                  <div className="flex gap-1 items-center">
                    <span className="text-sm md:text-base 2xl:text-lg font-semibold text-primary">
                      ৳{sellingPrice}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({firstItem?.value})
                    </span>
                  </div>

                  {/* Original Price (del) */}
                  {originalPrice && originalPrice > sellingPrice && (
                    <span className="text-xs md:text-sm 2xl:text-base text-gray-600 dark:text-gray-400 line-through">
                      ৳{originalPrice}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-red-500">No price</span>
              )}
            </div>

            {/* Discount Badge */}
            {/* {discountTk > 0 && (
              <Badge variant="destructive" className="font-semibold mb-2">
                Save ৳{discountTk}
              </Badge>
            )} */}

            {/* Add to Cart */}
            <AddToCartButton product={product} />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
