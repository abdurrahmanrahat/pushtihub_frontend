"use client";

import { addCategoryToDB } from "@/app/actions/categories";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import MYSelect from "@/components/shared/Forms/MYSelect";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { createSlug } from "@/utils/createSlug";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const subCategorySchema = z.object({
  name: z.string().min(1, "Please provide a subcategory name."),
  subCategoryOf: z.string().min(1, "Please select a parent category."),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

type TSubCategoryFormProps = {
  parentCategories: { value: string; label: string }[];
};

export default function SubCategoryForm({
  parentCategories,
}: TSubCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSubCategory = async (values: SubCategoryFormValues) => {
    setIsLoading(true);

    try {
      const slug = createSlug(values.name);

      const newCategoryData = {
        name: values.name,
        slug,
        image: null, // no image for subcategory
        subCategoryOf: values.subCategoryOf,
      };

      const res = await addCategoryToDB(newCategoryData);

      if (res?.success) {
        toast.success("Subcategory added successfully!");
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const subCategoryDefaultValues: SubCategoryFormValues = {
    name: "",
    subCategoryOf: "",
  };

  return (
    <MYForm
      onSubmit={handleAddSubCategory}
      schema={subCategorySchema}
      defaultValues={subCategoryDefaultValues}
    >
      <div className="flex flex-col gap-6">
        {/* Fields */}
        <div className="flex flex-col gap-4">
          {/* Parent Dropdown */}
          <div className="grid gap-1">
            <label
              htmlFor="subCategoryOf"
              className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300"
            >
              Select Parent Category{" "}
              <span className="text-red-500 font-medium">*</span>
            </label>

            <MYSelect
              name="subCategoryOf"
              options={parentCategories}
              placeholder="Select parent category"
            />
          </div>

          {/* Name Field */}
          <div className="grid gap-1">
            <label
              htmlFor="name"
              className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300"
            >
              Subcategory Name{" "}
              <span className="text-red-500 font-medium">*</span>
            </label>
            <MYInput name="name" placeholder="Subcategory name" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-2 w-full">
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 2xl:h-12 cursor-pointer w-full bg-primary text-white hover:bg-primary/90"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />{" "}
                  <span>Adding...</span>
                </span>
              ) : (
                "Add Subcategory"
              )}
            </Button>
          </DialogClose>
        </div>
      </div>
    </MYForm>
  );
}
