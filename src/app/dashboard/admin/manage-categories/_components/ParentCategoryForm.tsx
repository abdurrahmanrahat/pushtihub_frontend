"use client";

import { addCategoryToDB } from "@/app/actions/categories";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { createSlug } from "@/utils/createSlug";
import { ImageUp, Loader } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import z from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Please provide a name."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const img_hosting_token = process.env.NEXT_PUBLIC_imgBB_token;
const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

const ParentCategoryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const handleAddCategory = async (values: CategoryFormValues) => {
    setIsLoading(true);
    try {
      if (!image) {
        toast.error("Please upload an image for the category.");
      }

      const slug = createSlug(values.name);

      const newCategoryData = {
        name: values.name,
        slug,
        image,
        subCategoryOf: null, // no subcategory for parent category
      };

      const res = await addCategoryToDB(newCategoryData);

      if (res?.success) {
        toast.success("Parent category added successfully!");
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // handle image upload
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    setIsImageUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(img_hosting_url, {
        method: "POST",
        body: formData,
      });
      const imageRes = await res.json();

      if (imageRes.success) {
        const imageUrl = imageRes.data.display_url;
        setImage(imageUrl);

        toast.success("Image uploaded successfully!");
      }
    } catch (error: any) {
      console.log("error full", error);
      toast.error(error?.message || "Image upload failed.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const categoryDefaultValues = {
    name: "",
  };

  return (
    <MYForm
      onSubmit={handleAddCategory}
      schema={categorySchema}
      defaultValues={categoryDefaultValues}
    >
      <div className="flex flex-col gap-6">
        {/* fields */}
        <div className="flex flex-col gap-4">
          {/* image */}
          <div className="grid gap-[6px]">
            <label
              htmlFor="name"
              className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300"
            >
              Category Image <span className="text-red-500 font-medium">*</span>
            </label>

            <div>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {!image ? (
                <div className="py-[22px] px-4 rounded-md border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark hover:border-primary cursor-pointer">
                  <label
                    htmlFor="photo"
                    className="block text-center cursor-pointer"
                  >
                    <ImageUp
                      className={`text-4xl ${
                        isImageUploading
                          ? "text-primary animate-pulse"
                          : "text-gray-400"
                      } mb-2 mx-auto`}
                    />
                    <p className="text-sm 2xl:text-base text-gray-900 dark:text-white">
                      {isImageUploading
                        ? "Uploading..."
                        : "Click to upload image"}
                    </p>
                    <p className="text-xs 2xl:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      PNG, JPG up to 2MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative w-40 h-32 mx-auto group rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                  <MyImage
                    src={image}
                    alt="category-image"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-1 right-1 text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-200  cursor-pointer w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

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
              disabled={isLoading || isImageUploading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />{" "}
                  <span>Adding...</span>
                </span>
              ) : (
                "Add Parent Category"
              )}
            </Button>
          </DialogClose>
        </div>
      </div>
    </MYForm>
  );
};

export default ParentCategoryForm;
