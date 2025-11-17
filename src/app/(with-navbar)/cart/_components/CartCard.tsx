"use client";

import { QuantityStepper } from "@/components/common/Product/QuantityStepper";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/redux/hooks";
import { removeFromCart, updateQuantity } from "@/redux/reducers/cartSlice";
import { TCartItem } from "@/types";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CartCard = ({ item }: { item: TCartItem }) => {
  const dispatch = useAppDispatch();

  // always primary selected variant
  const primary = item.selectedVariants[0].item;

  const handleUpdateQuantity = (newQty: number) => {
    if (newQty < 1) {
      toast.error("You must select at least 1 quantity!");
      return;
    }

    if (newQty > primary.stock) {
      toast.error("Insufficient stock!");
      return;
    }

    dispatch(
      updateQuantity({
        productId: item.product._id,
        selectedVariants: item.selectedVariants,
        quantity: newQty,
      })
    );
  };

  const handleRemove = () => {
    dispatch(
      removeFromCart({
        productId: item.product._id,
        selectedVariants: item.selectedVariants,
      })
    );
    toast.success("Item removed from cart");
  };

  const totalPrice = primary.sellingPrice * item.quantity;

  return (
    <Card className="p-2 md:p-4">
      <div className="flex gap-2 md:gap-4">
        <Link href={`/product/${item.product.slug}`}>
          <MyImage
            src={item.product.images[0]}
            alt={item.product.name}
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <Link href={`/product/${item.product.slug}`}>
            <h3 className="text-sm md:text-base 2xl:text-lg font-medium hover:text-primary transition-colors line-clamp-2">
              {item.product.name}
            </h3>
          </Link>

          {/* Selected Variant */}
          <p className="text-xs text-muted-foreground">
            Variant: <span className="font-medium">{primary.value}</span>
          </p>

          {/* Price */}
          <p className="font-semibold text-sm md:text-base 2xl:text-lg">
            ৳{primary.sellingPrice}
          </p>

          {/* Quantity + Remove */}
          <div className="flex items-center gap-3 md:gap-4">
            <QuantityStepper
              value={item.quantity}
              onChange={handleUpdateQuantity}
              max={primary.stock}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 2xl:h-5 w-4 2xl:w-5" />
            </Button>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="font-semibold md:text-lg 2xl:text-xl">
            ৳{totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CartCard;
