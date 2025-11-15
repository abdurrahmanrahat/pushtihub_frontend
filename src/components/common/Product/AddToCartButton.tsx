"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/reducers/cartSlice";
import { TProduct } from "@/types";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const AddToCartButton = ({ product }: { product: TProduct }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleAddToCart = () => {
    const alreadyCart = cartItems.some(
      (item) => item.product._id === product._id
    );

    if (alreadyCart) {
      toast.error("Already you have added in cart!");
    } else if (product.stock === 0) {
      toast.error("Out of stock!");
    } else {
      dispatch(addToCart({ product, quantity: 1 }));

      toast.success("Add to cart success");
    }
  };

  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart();
      }}
      disabled={product.stock === 0}
    >
      <ShoppingCart className="w-4 2xl:w-5 h-4 2xl:h-5 mr-1" />
      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;
