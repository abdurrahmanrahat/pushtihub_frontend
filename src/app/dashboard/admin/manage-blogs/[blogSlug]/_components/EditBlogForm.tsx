"use client";

import { updateBlogInDB } from "@/app/actions/blog";
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

const img_hosting_token = process.env.NEXT_PUBLIC_imgBB_token;
const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

const EditBlogForm = ({
  blog,
  categories,
}: {
  blog: any;
  categories: string[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(blog?.image || null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const router = useRouter();

  const handleEditBlog = async (values: FieldValues) => {
    setIsLoading(true);

    try {
      if (!image) {
        toast.error("Please upload an image for the blog.");
        return;
      }

      const slug = createSlug(values.title);

      const updatedBlogData = {
        ...values,
        slug,
        image,
      };

      const res = await updateBlogInDB(blog.slug, updatedBlogData);

      if (res?.success) {
        toast.success("Blog updated successfully!");

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
      toast.error(error?.message || "Image upload failed!");
    } finally {
      setIsImageUploading(false);
    }
  };

  // Default values for editing
  const blogDefaultValues = {
    title: blog?.title || "",
    description: blog?.description || "",
    tags: blog?.tags || [],
  };

  return (
    <MYForm
      onSubmit={handleEditBlog}
      defaultValues={blogDefaultValues}
      schema={blogSchema}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* blog title */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
            Blog Title <span className="text-red-500">*</span>
          </label>
          <MYInput name="title" placeholder="Enter blog title" />
        </div>

        {/* blog image */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
            Blog Image <span className="text-red-500">*</span>
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
              <div className="py-[22px] px-4 rounded-md border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 bg-light-gray dark:bg-deep-dark hover:border-primary cursor-pointer transition-all">
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
                  <p className="text-sm 2xl:text-base">
                    {isImageUploading
                      ? "Uploading..."
                      : "Click to upload image"}
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative w-40 h-32 mx-auto group rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <MyImage
                  src={image}
                  alt="blog-image"
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-1 right-1 text-[10px] opacity-0 group-hover:opacity-100 transition-all w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* description */}
      <div className="flex flex-col gap-6 mt-6">
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Description <span className="text-red-600">*</span>
          </label>
          <MYTextEditor name="description" />
        </div>

        {/* tags */}
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
      <div className="mt-8 flex justify-center">
        <Button
          type="submit"
          disabled={isLoading || isImageUploading}
          className="w-full h-11"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Updating...
            </span>
          ) : (
            "Update Blog"
          )}
        </Button>
      </div>
    </MYForm>
  );
};

export default EditBlogForm;
