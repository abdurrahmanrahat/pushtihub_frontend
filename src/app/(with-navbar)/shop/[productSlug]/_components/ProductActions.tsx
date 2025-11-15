"use client";

import { QuantityStepper } from "@/components/common/Product/QuantityStepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/reducers/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/reducers/wishlistSlice";
import { TProduct } from "@/types";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ProductActions = ({ product }: { product: TProduct }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // handle add to cart
  const handleAddToCart = () => {
    const alreadyCart = cartItems.some(
      (item) => item.product._id === product._id
    );

    if (alreadyCart) {
      toast.error("Already you have added in cart!");
    } else if (product.stock === 0) {
      toast.error("Out of stock!");
    } else {
      dispatch(addToCart({ product, quantity: quantity }));

      toast.success("Add to cart success");
    }
  };

  const alreadyInWishlist = wishlistItems.some(
    (item) => item._id === product._id
  );

  // handle add to wishlist
  const handleAddToWishlist = () => {
    if (alreadyInWishlist) {
      toast.warning("Already you have added in wishlist!");
    } else {
      dispatch(addToWishlist(product));

      toast.success("Add to wishlist success");
    }
  };

  // handle remove from wishlist
  const handleRemoveFromWishlist = () => {
    dispatch(removeFromWishlist(product._id));
    toast.success("Remove from wishlist success");
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={product.stock}
        />

        <div className="w-full">
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {alreadyInWishlist ? (
          <Button
            size="lg"
            onClick={handleRemoveFromWishlist}
            variant="outline"
            aria-label="Remove from wishlist"
            className="w-auto"
          >
            <Heart className={cn("h-5 w-5 fill-red-500 text-red-500")} />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleAddToWishlist}
            variant="outline"
            aria-label="Add to wishlist"
            className="w-auto"
          >
            <Heart className={cn("h-5 w-5")} />
          </Button>
        )}
      </div>

      <div className="mt-4">
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => {
            handleAddToCart();
            router.push("/checkout");
          }}
          disabled={product.stock === 0}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
