"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/reducers/cartSlice";
import { TProduct } from "@/types/product.type";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

/* ------------------------------
   Helper: Get First Variant Item
------------------------------- */
const getFirstItem = (product: TProduct) => {
  const firstVariant = product.variants?.[0];
  return firstVariant?.items?.[0] || null;
};

const AddToCartButton = ({ product }: { product: TProduct }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const firstItem = getFirstItem(product);
  const firstStock = firstItem?.stock ?? 0; // fallback 0 if undefined

  const handleAddToCart = () => {
    const alreadyCart = cartItems.some(
      (item) => item.product._id === product._id
    );

    if (alreadyCart) {
      toast.error("Already added to cart!");
      return;
    }

    if (firstStock === 0) {
      toast.error("Out of stock!");
      return;
    }

    // Add product with first variant info
    dispatch(
      addToCart({
        product,
        quantity: 1,
        selectedVariants: [
          {
            type: product.variants[0].type,
            item: {
              value: firstItem?.value || "",
              price: firstItem?.price || 0,
              sellingPrice: firstItem?.sellingPrice || 0,
              stock: firstItem?.stock || 0,
            },
          },
        ],
      })
    );

    toast.success("Added to cart!");
  };

  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart();
      }}
      disabled={firstStock === 0}
    >
      <ShoppingCart className="w-4 2xl:w-5 h-4 2xl:h-5 mr-1" />
      {firstStock === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
