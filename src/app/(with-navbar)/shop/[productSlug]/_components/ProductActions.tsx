"use client";

import { QuantityStepper } from "@/components/common/Product/QuantityStepper";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/reducers/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/reducers/wishlistSlice";
import { TProduct, TSelectedVariant } from "@/types";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ProductActions = ({
  product,
  selectedVariants,
  selectedStock,
}: {
  product: TProduct;
  selectedVariants: TSelectedVariant[];
  selectedStock: number;
}) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  /* -------- Cart Check -------- */
  const alreadyCart = cartItems.some(
    (item) =>
      item.product._id === product._id &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
  );

  /* -------- Wishlist Check -------- */
  const alreadyWishlist = wishlistItems.some(
    (item) => item._id === product._id
  );

  /* -------- Add to Cart -------- */
  const handleAddToCart = () => {
    if (alreadyCart) return toast.error("Already added in cart!");
    if (selectedStock === 0)
      return toast.error("Selected variant out of stock!");

    dispatch(
      addToCart({
        product,
        quantity,
        selectedVariants,
      })
    );

    toast.success("Added to cart!");
  };

  return (
    <div className="">
      <div className="flex items-center gap-4">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={selectedStock}
        />

        <div className="w-full">
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={selectedStock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {selectedStock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {alreadyWishlist ? (
          <Button
            size="lg"
            variant="outline"
            // className="w-full"
            onClick={() => {
              dispatch(removeFromWishlist(product._id));
              toast.success("Removed from wishlist");
            }}
          >
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            // className="w-full"
            onClick={() => {
              dispatch(addToWishlist(product));
              toast.success("Added to wishlist");
            }}
          >
            <Heart className="h-5 w-5" />
          </Button>
        )}
      </div>

      <Button
        size="lg"
        variant="outline"
        className="w-full mt-4"
        onClick={() => {
          handleAddToCart();
          router.push("/checkout");
        }}
        disabled={selectedStock === 0}
      >
        Buy Now
      </Button>
    </div>
  );
};

export default ProductActions;
