"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  insideDhakaShippingCost,
  outsideDhakaShippingCost,
} from "@/constants/shippingKey";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateShippingOption } from "@/redux/reducers/cartSlice";
import { shippingOptions } from "@/utils/shippingOptions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CartCard from "./CartCard";
import NotFoundCartItems from "./NotFoundCartItems";

const CartLists = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);
  const storedOption = useAppSelector((state) => state.cart.shippingOption);

  const [shippingOption, setShippingOption] = useState<"dhaka" | "outside">(
    storedOption || "dhaka"
  );

  if (cartItems.length === 0) return <NotFoundCartItems />;

  // SUBTOTAL => sum of item.selectedVariants[0].item.sellingPrice × quantity
  const subtotal = cartItems.reduce((total, item) => {
    const primary = item.selectedVariants[0]?.item;
    return total + (primary.sellingPrice as number) * item.quantity;
  }, 0);

  const shippingCost =
    shippingOption === "dhaka"
      ? insideDhakaShippingCost
      : outsideDhakaShippingCost;

  const total = subtotal + Number(shippingCost);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    dispatch(updateShippingOption(shippingOption));
    router.push("/checkout");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 mt-6">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <CartCard
            key={`${item.product._id}-${JSON.stringify(item.selectedVariants)}`}
            item={item}
          />
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between text-sm md:text-base 2xl:text-lg">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">৳{subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping Options */}
            <div>
              <h3 className="font-medium mb-3 2xl:text-lg">Shipping</h3>
              <RadioGroup
                value={shippingOption}
                onValueChange={(v) =>
                  setShippingOption(v as "dhaka" | "outside")
                }
                className="space-y-0"
              >
                {shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label
                        htmlFor={option.id}
                        className="text-sm cursor-pointer"
                      >
                        {option.name}
                      </Label>
                    </div>

                    <span className="text-sm 2xl:text-base font-medium">
                      ৳{option.price}
                    </span>
                  </div>
                ))}
              </RadioGroup>

              <p className="text-xs 2xl:text-sm text-muted-foreground mt-2">
                Shipping options will be updated during checkout.
              </p>
            </div>

            <Separator />

            {/* TOTAL */}
            <div className="flex justify-between text-base 2xl:text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">৳{total.toFixed(2)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to checkout
            </Button>

            <Link href="/shop">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartLists;
