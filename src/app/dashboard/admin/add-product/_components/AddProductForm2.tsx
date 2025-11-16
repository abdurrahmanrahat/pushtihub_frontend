/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ImageUp, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import MYMultiSelectWithExtra from "@/components/shared/Forms/MYMultiSelectWithExtra";
import MYSelect from "@/components/shared/Forms/MYSelect";
import MYTextEditor from "@/components/shared/Forms/MYTextEditor";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";

import { addProductToDB } from "@/app/actions/product";
import VariantManager from "./VariantManager";

/* ----------------------------
  ZOD SCHEMA
----------------------------- */
const variantItemSchema = z.object({
  value: z.string().min(1, "Value is required"),
  price: z.coerce.number().gt(0, "Price required. (<0))"),
  sellingPrice: z.coerce.number().gt(0, "Selling price required. (<0))"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

const primaryVariantSchema = z.object({
  type: z.enum(["size", "color", "weight"], {
    required_error: "Please select a primary variant type.",
    invalid_type_error: "Please select a primary variant type",
  }),
  items: z
    .array(variantItemSchema)
    .min(1, "Add at least one primary variant option."),
});

const secondaryVariantSchema = z.object({
  size: z.array(z.string()).optional().default([]),
  color: z.array(z.string()).optional().default([]),
  weight: z.array(z.string()).optional().default([]),
});

const productSchema = z.object({
  name: z.string().min(1, "Please provide a product name."),
  category: z.string().min(1, "Please select a category."),
  description: z.string().min(1, "Provide product description."),
  tags: z.array(z.string()).min(1, "Select at least one tag."),
  variants: z.object({
    primary: primaryVariantSchema,
    secondary: secondaryVariantSchema,
  }),
});

type TProductFormValues = z.infer<typeof productSchema>;

const imgToken = process.env.NEXT_PUBLIC_imgBB_token;
const uploadURL = `https://api.imgbb.com/1/upload?key=${imgToken}`;

type TAddProductFormProps = {
  categories: { value: string; label: string }[];
  categorySlugs: string[];
};

const AddProductForm = ({
  categories,
  categorySlugs,
}: TAddProductFormProps) => {
  const router = useRouter();

  /* ----------------------------
     STATE
  ----------------------------- */
  const [images, setImages] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: TProductFormValues = {
    name: "",
    category: "",
    description: "",
    tags: [],
    variants: {
      primary: {
        type: "" as any, // start empty, Zod will require it
        items: [
          {
            value: "",
            price: 0,
            sellingPrice: 0,
            stock: 0,
          },
        ],
      },
      secondary: {
        size: [],
        color: [],
        weight: [],
      },
    },
  };

  /* ----------------------------
    IMAGE UPLOAD HANDLER
  ----------------------------- */
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setIsImageUploading(true);

    try {
      const uploads = Array.from(files).map(async (file) => {
        if (file.size > 1024 * 1024) {
          toast.error(`${file.name} exceeds 1MB`);
          return null;
        }

        const fd = new FormData();
        fd.append("image", file);

        const res = await fetch(uploadURL, { method: "POST", body: fd });
        const json = await res.json();

        return json.success ? json.data.display_url : null;
      });

      const results = (await Promise.all(uploads)).filter(Boolean) as string[];

      setImages((prev) => [...prev, ...results]);
      if (results.length) toast.success("Image(s) uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsImageUploading(false);
    }
  };

  /* ----------------------------
     SUBMIT HANDLER
  ----------------------------- */
  const handleSubmit = async (values: TProductFormValues) => {
    const { variants, ...restValues } = values;
    if (!images.length) {
      toast.error("Upload at least 1 image");
      return;
    }

    setIsLoading(true);

    try {
      // Clean secondary variants
      const cleanedSecondary = Object.fromEntries(
        Object.entries(variants.secondary || {}).filter(
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
        slug: values.name.trim().toLowerCase().replace(/\s+/g, "-"),
        images,
        variants: finalizeVariants,
      };
      console.log("payload", payload);

      const res = await addProductToDB(payload);

      if (res?.success) {
        toast.success("Product added successfully");
        router.push("/dashboard/admin/manage-products");
      } else {
        toast.error(res?.message || "Failed to add product");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------------------------
    RENDER FORM
  ----------------------------- */
  return (
    <MYForm
      schema={productSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        {/* -------------------------
          BASIC INFO
        -------------------------- */}
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

        {/* -------------------------
          IMAGE UPLOAD
        -------------------------- */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Product Images <span className="text-red-600">*</span>
          </label>

          <input
            type="file"
            id="image-uploader"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />

          {images.length === 0 ? (
            <label
              htmlFor="image-uploader"
              className="cursor-pointer flex flex-col items-center justify-center border border-muted py-8 md:py-10 rounded-md bg-light-gray dark:bg-deep-dark"
            >
              <ImageUp
                className={`h-6 w-6 2xl:h-8 2xl:w-8 mb-2 ${
                  isImageUploading
                    ? "text-primary animate-pulse"
                    : "text-gray-400"
                }`}
              />
              <p className="text-sm 2xl:text-base">
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
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1"
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
                  htmlFor="image-uploader"
                  className="w-24 h-24 border border-dashed border-muted flex items-center justify-center cursor-pointer rounded-md"
                >
                  <ImageUp className="h-5 w-5 text-gray-400" />
                </label>
              )}
            </div>
          )}
        </div>

        {/* -------------------------
          DESCRIPTION
        -------------------------- */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Description <span className="text-red-600">*</span>
          </label>
          <MYTextEditor name="description" />
        </div>

        {/* -------------------------
          TAGS
        -------------------------- */}
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

        {/* -------------------------
          VARIANTS (new modular system)
        -------------------------- */}
        <div>
          <label className="font-medium text-sm 2xl:text-base">
            Variants <span className="text-red-600">*</span>
          </label>
          <VariantManager />
        </div>

        {/* -------------------------
          SUBMIT
        -------------------------- */}
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
            "Upload Product"
          )}
        </Button>
      </div>
    </MYForm>
  );
};

export default AddProductForm;
