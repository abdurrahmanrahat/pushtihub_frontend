"use client";

import { addBlogToDB } from "@/app/actions/blog";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import MYMultiSelectWithExtra from "@/components/shared/Forms/MYMultiSelectWithExtra";
import MYTextEditor from "@/components/shared/Forms/MYTextEditor";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/utils/createSlug";
import { ImageUp, Loader } from "lucide-react";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

const blogDefaultValues = {
  title: "",
  description: "",
  tags: [],
};

const img_hosting_token = process.env.NEXT_PUBLIC_imgBB_token;
const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

const AddBlogForm = ({
  userId,
  categories,
}: {
  userId: string;
  categories: string[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const router = useRouter();

  const handleAddBlog = async (values: FieldValues) => {
    setIsLoading(true);
    try {
      if (!image) {
        toast.error("Please upload an image for the category.");
      }

      const slug = createSlug(values.title);
      console.log("slug", slug);

      const newBlogData = {
        ...values,
        slug,
        image,
        authorDetails: userId,
      };

      const res = await addBlogToDB(newBlogData);

      if (res?.success) {
        toast.success("Blog created successfully!");
        router.push("/dashboard/admin/manage-blogs");
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

  return (
    <MYForm
      onSubmit={handleAddBlog}
      defaultValues={blogDefaultValues}
      schema={blogSchema}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* blog title */}

        <div className="grid gap-[6px]">
          <label
            htmlFor="title"
            className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300"
          >
            Blog Title <span className="text-red-500 font-medium">*</span>
          </label>
          <MYInput name="title" placeholder="Enter blog title" />
        </div>

        {/* blog photo */}
        <div className="grid gap-[6px]">
          <label
            htmlFor="name"
            className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300"
          >
            Blog Image <span className="text-red-500 font-medium">*</span>
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
      </div>

      {/* blog description */}
      <div className="flex flex-col gap-6 mt-6">
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Description <span className="text-red-600">*</span>
          </label>
          <MYTextEditor name="description" />
        </div>

        {/* blog tags */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Tags <span className="text-red-600">*</span>
          </label>
          <MYMultiSelectWithExtra
            name="tags"
            options={categories}
            placeholder="Select tags"
          />
        </div>
      </div>

      {/* submit button */}
      <div className="mt-8 flex justify-center items-center">
        <Button
          type="submit"
          disabled={isLoading || isImageUploading}
          className="w-full h-11"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            "Upload Blog"
          )}
        </Button>
      </div>
    </MYForm>
  );
};

export default AddBlogForm;
