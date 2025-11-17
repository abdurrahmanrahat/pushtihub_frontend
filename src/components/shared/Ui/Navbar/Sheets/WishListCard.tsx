"use client";

import { QuantityStepper } from "@/components/common/Product/QuantityStepper";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/reducers/cartSlice";
import { removeFromWishlist } from "@/redux/reducers/wishlistSlice";
import { TProduct } from "@/types";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import MyImage from "../../Image/MyImage";

type TWishlistCardProps = {
  product: TProduct;
  onSheetClose: (value: boolean) => void;
};

const WishlistCard = ({ product, onSheetClose }: TWishlistCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const primary = product.variants.primary;
  const firstItem = primary.items[0];
  const firstStock = firstItem?.stock ?? 0;

  const removeWishlistItem = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = () => {
    // Check duplicate (same product + same primary variant)
    const alreadyInCart = cartItems.some(
      (item) =>
        item.product._id === product._id &&
        item.selectedVariants.length === 1 &&
        item.selectedVariants[0].type === primary.type &&
        item.selectedVariants[0].item.value === firstItem?.value
    );

    if (alreadyInCart) {
      toast.error("Already added to cart!");
      return;
    }

    if (firstStock <= 0) {
      toast.error("Out of stock!");
      return;
    }

    // Correct structure for TSelectedVariant[]
    const selectedVariants = [
      {
        type: primary.type,
        item: {
          value: firstItem?.value ?? "",
          price: firstItem?.price ?? 0,
          sellingPrice: firstItem?.sellingPrice ?? 0,
          stock: firstItem?.stock ?? 0,
        },
      },
    ];

    dispatch(
      addToCart({
        product,
        quantity: 1,
        selectedVariants,
      })
    );

    toast.success("Added to cart!");
  };

  // handle card click to navigate product details page
  const handleProductDetails = (productSlug: string) => {
    router.push(`/shop/${productSlug}`);
    onSheetClose(false);
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div
        className="col-span-3 cursor-pointer"
        onClick={() => handleProductDetails(product.slug)}
      >
        <MyImage
          src={product.images[0]}
          alt={product.name}
          width={96}
          height={96}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      <div className="col-span-9 space-y-0">
        <div className="flex justify-between gap-2">
          <h3 className="text-sm line-clamp-2">{product.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeWishlistItem(product._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-[82px] md:w-[112px]">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={firstItem.stock}
          />
        </div>
        <div className="flex justify-between items-center">
          {/* Price */}
          <div className="flex items-center gap-1">
            <span className="text-sm md:text-base 2xl:text-lg font-semibold text-primary">
              ৳{firstItem.sellingPrice}
            </span>

            {firstItem.price > firstItem.sellingPrice && (
              <span className="text-xs md:text-sm 2xl:text-base text-gray-600 line-through">
                ৳{firstItem.price}
              </span>
            )}

            <span className="text-xs text-muted-foreground">
              ({firstItem.value})
            </span>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="cursor-pointer"
            aria-label="Add to cart"
            size="sm"
          >
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
export default WishlistCard;
