"use client";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/reducers/wishlistSlice";
import { TProduct } from "@/types";
import { Heart } from "lucide-react";
import { toast } from "sonner";

const AddToWishlistButton = ({ product }: { product: TProduct }) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

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
    <>
      {alreadyInWishlist ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveFromWishlist();
          }}
          className={cn(
            "absolute top-2 right-2 p-1 2xl:p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-red-500"
          )}
          aria-label="Add to wishlist"
        >
          <Heart className={cn("h-4 2xl:h-5 w-4 2xl:w-5 fill-red-500")} />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToWishlist();
          }}
          className={cn(
            "absolute top-2 right-2 p-1 2xl:p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-gray-500 hover:text-red-500"
          )}
          aria-label="Add to wishlist"
        >
          <Heart className={cn("h-4 2xl:h-5 w-4 2xl:w-5")} />
        </button>
      )}
    </>
  );
};

export default AddToWishlistButton;
