"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/reducers/cartSlice";
import { TProduct } from "@/types/product.type";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

/* ------------------------------
   Helper: Get First Primary Item
------------------------------- */
const getFirstPrimaryItem = (product: TProduct) => {
  const primary = product.variants?.primary;
  return primary?.items?.[0] ?? null;
};

const AddToCartButton = ({ product }: { product: TProduct }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const primary = product.variants.primary;
  const firstItem = getFirstPrimaryItem(product);
  const firstStock = firstItem?.stock ?? 0;

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

  return (
    <Button
      className="w-full"
      disabled={firstStock === 0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart();
      }}
    >
      <ShoppingCart className="w-4 2xl:w-5 h-4 2xl:h-5 mr-1" />
      {firstStock === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
