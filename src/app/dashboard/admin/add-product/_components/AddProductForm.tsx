"use client";

import { addProductToDB } from "@/app/actions/product";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import MYMultiSelectWithExtra from "@/components/shared/Forms/MYMultiSelectWithExtra";
import MYSelect from "@/components/shared/Forms/MYSelect";
import MYTextEditor from "@/components/shared/Forms/MYTextEditor";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { createSlug } from "@/utils/createSlug";
import { ImageUp, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import z from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Please provide a product name."),
  category: z.string().min(1, "Please select a category."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  sellingPrice: z.coerce
    .number()
    .min(1, "Selling price must be greater than 0."),
  stock: z.coerce.number().min(0, "Stock cannot be negative."),
  description: z.string().min(1, "Provide product description."),
  tags: z.array(z.string()).min(1, "Select at least one tag."),
});

type ProductFormValues = z.infer<typeof productSchema>;

const img_hosting_token = process.env.NEXT_PUBLIC_imgBB_token;
const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

type TAddProductFormProps = {
  categories: { value: string; label: string }[];
  categorySlugs: string[];
};

const AddProductForm = ({
  categories,
  categorySlugs,
}: TAddProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const router = useRouter();

  //  Handle Submit
  const handleAddProduct = async (values: ProductFormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setIsLoading(true);
    try {
      const slug = createSlug(values?.name);
      const newProduct = {
        name: values.name,
        slug,
        description: values.description,
        images,
        category: values.category,
        price: values.price,
        sellingPrice: values.sellingPrice,
        stock: values.stock,
        tags: values.tags,
      };

      const res = await addProductToDB(newProduct);

      if (res?.success) {
        toast.success("Product added successfully!");

        router.push("/dashboard/admin/manage-products");
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  /* --------------------------------------------
     Handle Image Upload
  --------------------------------------------- */
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    setIsImageUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (file.size > 1 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 1MB limit.`);
          return null;
        }

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(img_hosting_url, {
          method: "POST",
          body: formData,
        });
        const imageRes = await res.json();

        if (imageRes.success) return imageRes.data.display_url;
        return null;
      });

      const uploaded = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as string[];

      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded successfully!`);
    } catch (error: any) {
      toast.error(error?.message || "Image upload failed.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const defaultValues: ProductFormValues = {
    name: "",
    category: "",
    price: 0,
    sellingPrice: 0,
    stock: 0,
    description: "",
    tags: [],
  };

  return (
    <MYForm
      onSubmit={handleAddProduct}
      schema={productSchema}
      defaultValues={defaultValues}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
              Product Name <span className="text-red-500 font-medium">*</span>
            </label>
            <MYInput name="name" placeholder="Enter product name" />
          </div>

          {/* category */}
          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
              Product Category{" "}
              <span className="text-red-500 font-medium">*</span>
            </label>
            <MYSelect
              name="category"
              options={categories}
              placeholder="Select category"
            />
          </div>

          {/* Price */}
          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
              Regular Price <span className="text-red-500 font-medium">*</span>
            </label>
            <MYInput name="price" placeholder="Enter price" type="number" />
          </div>

          {/* Selling Price */}
          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
              Selling Price <span className="text-red-500 font-medium">*</span>
            </label>
            <MYInput
              name="sellingPrice"
              placeholder="Enter selling price"
              type="number"
            />
          </div>

          {/* Stock */}
          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
              Stock <span className="text-red-500 font-medium">*</span>
            </label>
            <MYInput
              name="stock"
              placeholder="Enter stock quantity"
              type="number"
            />
          </div>
        </div>

        {/* Images */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
            Product Images <span className="text-red-500 font-medium">*</span>
          </label>

          <div>
            <input
              type="file"
              id="product-images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {images.length === 0 ? (
              <label
                htmlFor="product-images"
                className="flex flex-col items-center justify-center py-6 px-3 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary transition-all cursor-pointer bg-light-gray dark:bg-deep-dark"
              >
                <ImageUp
                  className={`h-8 w-8 mb-2 ${
                    isImageUploading
                      ? "text-primary animate-pulse"
                      : "text-gray-400"
                  }`}
                />
                <p className="text-sm 2xl:text-base">
                  {isImageUploading ? "Uploading..." : "Click to upload images"}
                </p>
                <p className="text-xs 2xl:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  PNG, JPG up to 1MB each — max 5 images
                </p>
              </label>
            ) : (
              <div className="flex flex-wrap gap-3 bg-light-gray dark:bg-deep-dark py-6 px-3 rounded-md border border-gray-200 dark:border-gray-700">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 group"
                  >
                    <MyImage
                      src={img}
                      alt={`product-${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      className="absolute top-1 right-1 text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label
                    htmlFor="product-images"
                    className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-primary transition-all"
                  >
                    <ImageUp className="h-6 w-6 text-gray-400" />
                  </label>
                )}
              </div>
            )}
          </div>

          {images.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              {images.length}/5 images uploaded
            </p>
          )}
        </div>

        {/* description */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
            Product Description{" "}
            <span className="text-red-500 font-medium">*</span>
          </label>

          <MYTextEditor name="description" />
        </div>

        {/* tags */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
            Product Tags <span className="text-red-500 font-medium">*</span>
          </label>

          <MYMultiSelectWithExtra
            name="tags"
            options={categorySlugs}
            placeholder="Select product tags"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-2 w-full">
          <Button
            className="h-11 2xl:h-12 cursor-pointer w-full"
            type="submit"
            disabled={isLoading || isImageUploading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />{" "}
                <span>Uploading...</span>
              </span>
            ) : (
              "Upload Product"
            )}
          </Button>
        </div>
      </div>
    </MYForm>
  );
};

export default AddProductForm;
