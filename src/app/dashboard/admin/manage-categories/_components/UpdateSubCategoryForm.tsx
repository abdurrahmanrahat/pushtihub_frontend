"use client";

import { updateCategoryInDB } from "@/app/actions/categories";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { TUpdateCategory } from "@/types";
import { createSlug } from "@/utils/createSlug";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Please provide a name."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const UpdateSubCategoryForm = ({ category }: { category: TUpdateCategory }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateParentCategory = async (values: CategoryFormValues) => {
    setIsLoading(true);

    try {
      const slug = createSlug(values.name);

      const updateCategoryData = {
        name: values.name,
        slug,
      };

      const res = await updateCategoryInDB(category._id, updateCategoryData);

      if (res?.success) {
        toast.success("Category updated successfully!");
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryDefaultValues = {
    name: category?.name || "",
  };

  return (
    <MYForm
      onSubmit={handleUpdateParentCategory}
      schema={categorySchema}
      defaultValues={categoryDefaultValues}
    >
      <div className="flex flex-col gap-6">
        {/* fields */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="grid gap-[6px]">
            <label
              htmlFor="name"
              className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300"
            >
              Category Name <span className="text-red-500 font-medium">*</span>
            </label>
            <MYInput name="name" placeholder="Enter category name" />
          </div>
        </div>

        {/* button */}
        <div className="mt-2 w-full">
          <DialogClose asChild>
            <Button
              className="h-11 2xl:h-12 cursor-pointer w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />{" "}
                  <span>Updating...</span>
                </span>
              ) : (
                "Update Sub Category"
              )}
            </Button>
          </DialogClose>
        </div>
      </div>
    </MYForm>
  );
};

export default UpdateSubCategoryForm;
