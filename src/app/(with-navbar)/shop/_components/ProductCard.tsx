import AddToCartButton from "@/components/common/Product/AddToCartButton";
import AddToWishlistButton from "@/components/common/Product/AddToWishlistButton";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TProduct } from "@/types/product.type";
import Link from "next/link";
import { Rating } from "../../../../components/common/Product/Rating";

export const ProductCard = ({ product }: { product: TProduct }) => {
  const discount =
    product.price > product.sellingPrice
      ? Math.round(
          ((product.price - product.sellingPrice) / product.price) * 100
        )
      : 0;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 m-0 p-0">
      <Link href={`/shop/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <MyImage
            src={product.images[0]}
            alt={product.name}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-linear"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {discount > 0 && (
              <Badge variant="destructive" className="font-semibold">
                -{discount}%
              </Badge>
            )}
          </div>
        </div>
        {/* Wishlist Button */}
        {product.stock > 0 ? (
          <AddToWishlistButton product={product} />
        ) : (
          <Badge
            variant="destructive"
            className="absolute top-16 right-0 rotate-45 origin-top-right"
          >
            Out of Stock
          </Badge>
        )}

        <CardContent className="py-3 px-3 h-[150px] md:h-[165px] flex flex-col justify-between">
          {/* Product Name */}
          <h4 className="font-medium text-xs md:text-sm 2xl:text-base line-clamp-2 mb-2 leading-[18px] 2xl:leading-5">
            {product.name}
          </h4>

          <div className="absolute bottom-4 left-3 right-3">
            {/* Rating */}
            <div className="mb-0.5">
              <Rating
                rating={product.averageRatings}
                totalReviews={product.totalReviews}
                size="md"
              />
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm md:text-base 2xl:text-lg font-semibold text-primary">
                ${product.sellingPrice.toFixed(2)}
              </span>
              {product.price > product.sellingPrice && (
                <span className="text-xs md:text-sm 2xl:text-base text-gray-600 dark:text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton product={product} />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
