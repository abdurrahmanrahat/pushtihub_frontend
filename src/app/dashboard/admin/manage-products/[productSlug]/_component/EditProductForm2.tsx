/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { updateProductInDB } from "@/app/actions/product";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import MYMultiSelectWithExtra from "@/components/shared/Forms/MYMultiSelectWithExtra";
import MYSelect from "@/components/shared/Forms/MYSelect";
import MYTextEditor from "@/components/shared/Forms/MYTextEditor";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import VariantManagerEdit from "./VariantManagerEdit";

import { Button } from "@/components/ui/button";
import { TProduct } from "@/types/product.type";
import { createSlug } from "@/utils/createSlug";
import { ImageUp, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import z from "zod";

/* ----------------------------------------
   ZOD VALIDATION SCHEMA (SAME AS ADD FORM)
----------------------------------------- */
const variantItemSchema = z.object({
  value: z.string().min(1, "Value is required"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  sellingPrice: z.coerce.number().gt(0, "Selling price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

const primaryVariantSchema = z.object({
  type: z.enum(["size", "color", "weight"], {
    required_error: "Please select a primary variant type",
  }),
  items: z
    .array(variantItemSchema)
    .min(1, "Add at least one primary variant option"),
});

const secondaryVariantSchema = z.object({
  size: z.array(z.string()).optional().default([]),
  color: z.array(z.string()).optional().default([]),
  weight: z.array(z.string()).optional().default([]),
});

const productSchema = z.object({
  name: z.string().min(1, "Please provide a product name"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(1, "Provide product description"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  variants: z.object({
    primary: primaryVariantSchema,
    secondary: secondaryVariantSchema,
  }),
});

type TProductFormValues = z.infer<typeof productSchema>;

const imgToken = process.env.NEXT_PUBLIC_imgBB_token;
const uploadURL = `https://api.imgbb.com/1/upload?key=${imgToken}`;

type TEditProductFormProps = {
  categories: { value: string; label: string }[];
  categorySlugs: string[];
  product: TProduct;
};

/* -----------------------------------------
   MAIN COMPONENT
------------------------------------------ */
const EditProductForm = ({
  categories,
  categorySlugs,
  product,
}: TEditProductFormProps) => {
  const router = useRouter();

  const [images, setImages] = useState<string[]>(product.images || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  /* -----------------------------------------
     DEFAULT VALUES (prefilled)
  ------------------------------------------ */
  const defaultValues: TProductFormValues = {
    name: product?.name || "",
    category: product?.category || "",
    description: product?.description || "",
    tags: product?.tags || [],

    variants: {
      primary: product.variants?.primary || {
        type: "" as any,
        items: [{ value: "", price: 0, sellingPrice: 0, stock: 0 }],
      },

      secondary: {
        size: product.variants?.secondary?.size || [],
        color: product.variants?.secondary?.color || [],
        weight: product.variants?.secondary?.weight || [],
      },
    },
  };

  /* -----------------------------------------
     IMAGE UPLOADING
  ------------------------------------------ */
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setIsImageUploading(true);

    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          if (file.size > 1 * 1024 * 1024) {
            toast.error(`${file.name} exceeds 1MB`);
            return null;
          }

          const fd = new FormData();
          fd.append("image", file);

          const res = await fetch(uploadURL, { method: "POST", body: fd });
          const json = await res.json();

          return json.success ? json.data.display_url : null;
        })
      );

      setImages((prev) => [...prev, ...(uploaded.filter(Boolean) as string[])]);
      toast.success("Images uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsImageUploading(false);
    }
  };

  /* -----------------------------------------
     SUBMIT HANDLER
  ------------------------------------------ */
  const handleSubmit = async (values: TProductFormValues) => {
    if (!images.length) {
      toast.error("Upload at least 1 image");
      return;
    }

    setIsLoading(true);

    try {
      const { variants, ...restValues } = values;

      // Clean secondary (same as AddProductForm)
      const cleanedSecondary = Object.fromEntries(
        Object.entries(variants.secondary).filter(
          ([_, arr]) => Array.isArray(arr) && arr.length > 0
        )
      );

      const finalizeVariants = {
        primary: variants.primary,
        ...(Object.keys(cleanedSecondary).length > 0 && {
          secondary: cleanedSecondary,
        }),
      };

      const payload = {
        ...restValues,
        slug: createSlug(values.name),
        images,
        variants: finalizeVariants,
      };

      const res = await updateProductInDB(product._id, payload);

      if (res?.success) {
        toast.success("Product updated successfully");
        router.push("/dashboard/admin/manage-products");
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  /* -----------------------------------------
     RENDER
  ------------------------------------------ */
  return (
    <MYForm
      schema={productSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        {/* NAME + CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-sm 2xl:text-base">
              Product Name <span className="text-red-600">*</span>
            </label>
            <MYInput name="name" placeholder="Enter product name" />
          </div>

          <div>
            <label className="font-medium text-sm 2xl:text-base">
              Category <span className="text-red-600">*</span>
            </label>
            <MYSelect
              name="category"
              options={categories}
              placeholder="Select category"
            />
          </div>
        </div>

        {/* IMAGES */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Product Images <span className="text-red-600">*</span>
          </label>

          <input
            type="file"
            id="image-editor"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />

          {images.length === 0 ? (
            <label
              htmlFor="image-editor"
              className="cursor-pointer flex flex-col items-center justify-center border border-muted py-8 md:py-10 rounded-md bg-light-gray dark:bg-deep-dark"
            >
              <ImageUp
                className={`h-6 w-6 mb-2 ${
                  isImageUploading
                    ? "text-primary animate-pulse"
                    : "text-gray-400"
                }`}
              />
              <p className="text-sm">
                {isImageUploading ? "Uploading..." : "Click to upload image"}
              </p>
            </label>
          ) : (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-md overflow-hidden border border-muted"
                >
                  <MyImage
                    src={img}
                    alt="product"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    className="w-4 h-4 absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center hover:bg-red-600"
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label
                  htmlFor="image-editor"
                  className="w-24 h-24 border border-dashed flex items-center justify-center rounded-md cursor-pointer"
                >
                  <ImageUp className="h-5 w-5 text-gray-400" />
                </label>
              )}
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Description <span className="text-red-600">*</span>
          </label>
          <MYTextEditor name="description" />
        </div>

        {/* TAGS */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Tags <span className="text-red-600">*</span>
          </label>
          <MYMultiSelectWithExtra
            name="tags"
            options={categorySlugs}
            placeholder="Select tags"
          />
        </div>

        {/* VARIANTS */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Variants <span className="text-red-600">*</span>
          </label>
          <VariantManagerEdit />
        </div>

        {/* SUBMIT */}
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
            "Update Product"
          )}
        </Button>
      </div>
    </MYForm>
  );
};

export default EditProductForm;
