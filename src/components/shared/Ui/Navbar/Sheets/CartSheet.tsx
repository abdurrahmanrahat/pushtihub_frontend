"use client";

import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Separator } from "@/components/ui/separator";
import {
  insideDhakaShippingCost,
  outsideDhakaShippingCost,
} from "@/constants/shippingKey";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateShippingOption } from "@/redux/reducers/cartSlice";
import { shippingOptions } from "@/utils/shippingOptions";
import { useRouter } from "next/navigation";
import CartSheetCard from "./CartSheetCard";
import { CheckoutStepsForSheet } from "./CheckoutStepsForSheet";

export default function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const shipOption = useAppSelector((state) => state.cart.shippingOption);

  const [shippingOption, setShippingOption] = useState(shipOption || "dhaka");

  const router = useRouter();

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost =
    shippingOption === "dhaka"
      ? insideDhakaShippingCost
      : outsideDhakaShippingCost;

  const total = subtotal + shippingCost;

  // const freeShippingThreshold = 2000;
  // const remainingForFreeShipping = Math.max(
  //   0,
  //   freeShippingThreshold - subtotal
  // );

  // handle checkout
  const handleCheckout = () => {
    setIsOpen(false);

    dispatch(updateShippingOption(shippingOption));

    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    setIsOpen((prev) => !prev);
    router.push("/shop");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <span className="relative cursor-pointer">
          <ShoppingCart className="w-5 h-5 2xl:w-6 2xl:h-6" />

          <Badge
            variant="destructive"
            className="absolute -top-2 -right-[10px] h-4 2xl:h-5 w-4 2xl:w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary"
          >
            {cartItems.length}
          </Badge>
        </span>
      </SheetTrigger>
      <SheetContent
        showCloseButton={true}
        className="w-full sm:max-w-[400px] border-none overflow-y-auto"
      >
        <SheetHeader className="-mb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="border-b border-primary/10">
            <div className="w-full max-w-4xl mx-auto py-6">
              <CheckoutStepsForSheet currentStep={1} />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full pt-6 px-4">
            <div>
              <div>
                <div className="">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-1 py-12">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <ShoppingBag className="w-12 h-12" />
                        <h4 className="text-lg lg:text-xl font-medium">
                          Your cart is empty!
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                          Add some products to get started
                        </p>
                      </div>
                      <Button onClick={handleContinueShopping}>
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6">
                      {cartItems.map((item, index) => (
                        <div key={item.product._id}>
                          <div className="">
                            <CartSheetCard item={item} />
                          </div>
                          {index < cartItems.length - 1 && (
                            <hr className="my-4 border border-primary/10" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Card className="">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Shipping</h3>
                      <RadioGroup
                        value={shippingOption}
                        onValueChange={(value) =>
                          setShippingOption(value as "dhaka" | "outside")
                        }
                        className="space-y-0"
                      >
                        {shippingOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={option.id}
                                id={option.id}
                              />
                              <Label
                                htmlFor={option.id}
                                className="text-sm cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>

                            <span className="text-sm font-medium">
                              ${option.price}
                            </span>
                          </div>
                        ))}
                      </RadioGroup>

                      <p className="text-xs text-muted-foreground mt-2">
                        Shipping options will be updated during checkout.
                      </p>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={cartItems.length === 0}
                      onClick={handleCheckout}
                    >
                      Proceed to checkout
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border border-gray-200 dark:border-gray-700 hover:bg-primary hover:text-white transition-all duration-300"
                      size="lg"
                      onClick={() => {
                        setIsOpen(false);

                        dispatch(updateShippingOption(shippingOption));

                        // Navigate to cart page
                        router.push("/cart");
                      }}
                      disabled={cartItems.length === 0}
                    >
                      View Cart
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
