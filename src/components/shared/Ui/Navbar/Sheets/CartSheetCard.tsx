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

const CartSheetCard = ({ item }: { item: TCartItem }) => {
  const dispatch = useAppDispatch();

  /* ----------------------------------
     PRIMARY VARIANT (ALWAYS index 0)
  ----------------------------------- */
  const primary = item.selectedVariants[0].item;

  const primaryStock = primary.stock ?? 0;
  const primaryPrice = primary.sellingPrice ?? 0;

  /* ----------------------------------
     SECONDARY VARIANTS
  ----------------------------------- */
  const secondaryVariants = item.selectedVariants.slice(1);

  const variantLabel = [
    `weight: ${primary.value}`, // always present
    ...secondaryVariants.map((sv) => `${sv.type}: ${sv.item.value}`),
  ].join(" | ");

  /* ----------------------------------
     UPDATE QUANTITY
  ----------------------------------- */
  const handleUpdateQuantity = (qty: number) => {
    if (qty < 1) return toast.error("Minimum quantity is 1!");
    if (qty > primaryStock) return toast.error("Insufficient stock!");

    dispatch(
      updateQuantity({
        productId: item.product._id,
        selectedVariants: item.selectedVariants,
        quantity: qty,
      })
    );
  };

  /* ----------------------------------
     REMOVE ITEM
  ----------------------------------- */
  const handleRemove = () => {
    dispatch(
      removeFromCart({
        productId: item.product._id,
        selectedVariants: item.selectedVariants,
      })
    );
    toast.success("Item removed from cart");
  };

  /* ----------------------------------
     TOTAL PRICE
  ----------------------------------- */
  const totalPrice = primaryPrice * item.quantity;

  return (
    <Card className="p-2">
      <div className="flex gap-2">
        {/* IMAGE */}
        <Link href={`/product/${item.product.slug}`}>
          <MyImage
            src={item.product.images[0]}
            alt={item.product.name}
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>

        {/* CONTENT */}
        <div className="flex-1 space-y-2">
          <Link href={`/product/${item.product.slug}`}>
            <h3 className="text-sm xl:text-base 2xl:text-lg font-medium hover:text-primary transition-colors line-clamp-2">
              {item.product.name}
            </h3>
          </Link>

          {/* VARIANTS */}
          <p className="text-xs 2xl:text-base text-muted-foreground">
            <span className="font-medium">{variantLabel}</span>
          </p>

          {/* PRICE */}
          <p className="font-semibold text-sm">৳{primaryPrice}</p>

          {/* QUANTITY + REMOVE */}
          <div className="flex items-center gap-3">
            <QuantityStepper
              value={item.quantity}
              onChange={handleUpdateQuantity}
              max={primaryStock}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* TOTAL */}
        <div className="text-right">
          <p className="font-semibold">৳{totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};

export default CartSheetCard;
