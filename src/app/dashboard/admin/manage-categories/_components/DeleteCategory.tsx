"use client";

import { deleteCategoryFromDB } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteCategory({ categoryId }: { categoryId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCategory = async () => {
    setIsLoading(true);

    try {
      const res = await deleteCategoryFromDB(categoryId);

      if (res?.success) {
        toast.success("Category deleted successfully!");
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      {/* Trigger button (trash icon) */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="max-w-[420px]! border border-gray-200 dark:border-gray-800 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" /> Delete Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="w-auto">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={handleDeleteCategory}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />{" "}
                  <span>Deleting...</span>
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
