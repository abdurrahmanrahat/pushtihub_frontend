"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TUpdateCategory } from "@/types";
import { Edit } from "lucide-react";
import UpdateParentCategoryForm from "./UpdateParentCategoryForm";
import UpdateSubCategoryForm from "./UpdateSubCategoryForm";

export default function UpdateCategory({
  isParentUpdate,
  category,
}: {
  isParentUpdate: boolean;
  category: TUpdateCategory;
}) {
  return (
    <Dialog>
      {/* Trigger button (trash icon) */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-primary hover:bg-primary/10"
        >
          <Edit className="h-4 w-4 2xl:h-5 2xl:w-5" />
        </Button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="max-w-[420px]! border border-gray-200 dark:border-gray-800 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <Edit className="h-5 w-5 text-red-500" /> Update Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the category information below. Ensure all details are
            accurate before saving changes.
          </DialogDescription>
        </DialogHeader>

        {/* Action buttons */}
        <div className="mt-6">
          {isParentUpdate ? (
            <UpdateParentCategoryForm category={category} />
          ) : (
            <UpdateSubCategoryForm category={category} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
