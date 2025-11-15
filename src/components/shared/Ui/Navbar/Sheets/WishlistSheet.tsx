"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import WishlistCard from "./WishListCard";

export default function WishlistSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const wishlists = useAppSelector((state) => state.wishlist.items);

  const handleContinueShopping = () => {
    setIsOpen((prev) => !prev);
    router.push("/shop");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <span className="relative cursor-pointer">
          <Heart className="w-5 h-5 2xl:w-6 2xl:h-6" />

          {wishlists.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-[10px] h-4 2xl:h-5 w-4 2xl:w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary"
            >
              {wishlists.length}
            </Badge>
          )}
        </span>
      </SheetTrigger>
      <SheetContent
        showCloseButton={true}
        className="w-full sm:max-w-[400px] border-none"
      >
        <SheetHeader className="-mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Your Wishlist Items
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full overflow-auto">
          {/* Main Content */}
          <div className="w-full pb-6 px-4">
            <div>
              <div>
                <div className="">
                  {wishlists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-1 py-12">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Heart className="w-12 h-12" />
                        <h4 className="text-lg lg:text-xl font-medium">
                          Your wishlist is empty!
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
                      {wishlists.map((product, index) => (
                        <div key={product._id}>
                          <WishlistCard
                            product={product}
                            onSheetClose={setIsOpen}
                          />

                          {index < wishlists.length - 1 && (
                            <hr className="my-4 border border-primary/10" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
