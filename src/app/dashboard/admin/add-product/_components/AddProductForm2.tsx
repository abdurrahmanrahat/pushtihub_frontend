"use client";

import { addProductToDB } from "@/app/actions/product";
import MYMultiSelectWithExtra from "@/components/shared/Forms/MTMultiSelectWithExtra";
import MYTextEditor from "@/components/shared/Forms/MTTextEditor";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import MYSelect from "@/components/shared/Forms/MYSelect";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { createSlug } from "@/utils/createSlug";
import { ImageUp, Loader, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import z from "zod";

/* ------------------------------------------------------------------
   ZOD SCHEMA (no price/sellingPrice/stock on root)
------------------------------------------------------------------- */

const productSchema = z.object({
  name: z.string().min(1, "Please provide a product name."),
  category: z.string().min(1, "Please select a category."),
  description: z.string().min(1, "Provide product description."),
  tags: z.array(z.string()).min(1, "Select at least one tag."),
});

type ProductFormValues = z.infer<typeof productSchema>;

/* ------------------------------------------------------------------
   VARIANT TYPES / STATE
------------------------------------------------------------------- */

type VariantType = "size" | "color" | "weight";

type VariantItem = {
  value: string;
  price: number | "";
  sellingPrice: number | "";
  stock: number | "";
};

type VariantGroup = {
  type: VariantType;
  items: VariantItem[];
};

type VariantItemPayload = {
  value: string;
  price: number;
  sellingPrice: number;
  stock: number;
};

type VariantGroupPayload = {
  type: VariantType;
  items: VariantItemPayload[];
};

const VARIANT_LABELS: Record<VariantType, string> = {
  size: "Size",
  color: "Color",
  weight: "Weight",
};

const VARIANT_PLACEHOLDERS: Record<VariantType, string> = {
  size: "e.g. S, M, L",
  color: "e.g. Green, Red",
  weight: "e.g. 250g, 500g",
};

const ALL_VARIANT_TYPES: VariantType[] = ["size", "color", "weight"];

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

  // variants as ARRAY of groups
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);

  // validation errors
  const [variantGlobalError, setVariantGlobalError] = useState<string | null>(
    null
  );
  const [variantGroupErrors, setVariantGroupErrors] = useState<
    Partial<Record<VariantType, string | null>>
  >({});
  const [hasVariantValidationRun, setHasVariantValidationRun] = useState(false);

  const router = useRouter();

  /* ------------------------------------------------------------------
     Helpers: remaining variant types
  ------------------------------------------------------------------- */

  const remainingVariantTypes: VariantType[] = ALL_VARIANT_TYPES.filter(
    (type) => !variantGroups.some((g) => g.type === type)
  );

  /* ------------------------------------------------------------------
     Variant Validation (core logic)
  ------------------------------------------------------------------- */

  const runVariantValidation = (
    groups: VariantGroup[],
    withErrors: boolean
  ): boolean => {
    let globalError: string | null = null;
    const groupErrors: Partial<Record<VariantType, string | null>> = {};

    if (groups.length === 0) {
      globalError =
        "Please add at least one variant type with at least one option.";
      if (withErrors) {
        setVariantGlobalError(globalError);
        setVariantGroupErrors(groupErrors);
      }
      return false;
    }

    let anyInvalid = false;

    for (const group of groups) {
      const { type, items } = group;

      if (!items || items.length === 0) {
        anyInvalid = true;
        globalError =
          globalError ??
          "Please add at least one variant type with at least one option.";
        groupErrors[
          type
        ] = `Please add at least one ${VARIANT_LABELS[type]} option.`;
        continue;
      }

      const invalidRow = items.some((row) => {
        if (!row.value || row.value.trim() === "") return true;

        const price = Number(row.price);
        const sellingPrice = Number(row.sellingPrice);
        const stock = Number(row.stock);

        if (!price || price <= 0 || isNaN(price)) return true;
        if (!sellingPrice || sellingPrice <= 0 || isNaN(sellingPrice))
          return true;
        if (isNaN(stock) || stock < 0) return true;

        return false;
      });

      if (invalidRow) {
        anyInvalid = true;
        globalError =
          globalError ??
          "Some variants are incomplete. Please fill all required fields.";
        groupErrors[
          type
        ] = `Please complete all fields for ${VARIANT_LABELS[type]} variants.`;
      } else {
        // valid group, ensure no leftover error
        groupErrors[type] = null;
      }
    }

    if (!anyInvalid && !globalError) {
      if (withErrors) {
        setVariantGlobalError(null);
        setVariantGroupErrors(groupErrors);
      }
      return true;
    }

    if (withErrors) {
      if (!globalError) {
        globalError = "Please fix the highlighted variant fields.";
      }
      setVariantGlobalError(globalError);
      setVariantGroupErrors(groupErrors);
    }

    return false;
  };

  const validateVariants = (withErrors: boolean) =>
    runVariantValidation(variantGroups, withErrors);

  /* ------------------------------------------------------------------
     Variant State Handlers (with auto re-validation)
  ------------------------------------------------------------------- */

  const handleAddVariantType = (type: VariantType) => {
    if (!remainingVariantTypes.includes(type)) return;

    setVariantGroups((prev) => {
      const updated: VariantGroup[] = [
        ...prev,
        {
          type,
          items: [
            {
              value: "",
              price: "",
              sellingPrice: "",
              stock: "",
            },
          ],
        },
      ];

      if (hasVariantValidationRun) {
        runVariantValidation(updated, true);
      }

      return updated;
    });
  };

  const handleRemoveVariantType = (type: VariantType) => {
    setVariantGroups((prev) => {
      const updated = prev.filter((g) => g.type !== type);

      if (hasVariantValidationRun) {
        runVariantValidation(updated, true);
      }

      return updated;
    });
  };

  const handleAddVariantRow = (type: VariantType) => {
    setVariantGroups((prev) => {
      const newRow: VariantItem = {
        value: "",
        price: "",
        sellingPrice: "",
        stock: "",
      };

      const updated = prev.map((group) =>
        group.type === type
          ? {
              ...group,
              items: [...group.items, newRow],
            }
          : group
      );

      if (hasVariantValidationRun) {
        runVariantValidation(updated, true);
      }

      return updated;
    });
  };

  const handleRemoveVariantRow = (type: VariantType, index: number) => {
    setVariantGroups((prev) => {
      const updated = prev
        .map((group) =>
          group.type === type
            ? {
                ...group,
                items: group.items.filter((_, i) => i !== index),
              }
            : group
        )
        // if group has no items, remove that variant type entirely
        .filter((group) => group.items.length > 0);

      if (hasVariantValidationRun) {
        runVariantValidation(updated, true);
      }

      return updated;
    });
  };

  const handleVariantFieldChange = (
    type: VariantType,
    index: number,
    field: keyof VariantItem,
    value: string
  ) => {
    setVariantGroups((prev) => {
      const updated = prev.map((group) => {
        if (group.type !== type) return group;

        const newItems = group.items.map((item, i) => {
          if (i !== index) return item;

          const updatedItem: VariantItem = { ...item };

          if (
            field === "price" ||
            field === "sellingPrice" ||
            field === "stock"
          ) {
            updatedItem[field] =
              value === "" ? "" : (Number(value) as VariantItem[typeof field]);
          } else {
            updatedItem[field] = value as VariantItem[typeof field];
          }

          return updatedItem;
        });

        return { ...group, items: newItems };
      });

      if (hasVariantValidationRun) {
        runVariantValidation(updated, true);
      }

      return updated;
    });
  };

  const buildVariantsPayload = (): VariantGroupPayload[] => {
    return variantGroups.map((group) => ({
      type: group.type,
      items: group.items.map((row) => ({
        value: row.value.trim(),
        price: Number(row.price),
        sellingPrice: Number(row.sellingPrice),
        stock: Number(row.stock),
      })),
    }));
  };

  /* ------------------------------------------------------------------
     Handle Submit
  ------------------------------------------------------------------- */

  const handleAddProduct = async (values: ProductFormValues) => {
    if (images.length === 0) {
      // this is still okay as a toast
      toast.error("Please upload at least one product image.");
      return;
    }

    setHasVariantValidationRun(true);
    const variantsValid = validateVariants(true);

    if (!variantsValid) {
      // block submit, show only inline errors
      return;
    }

    const variantsPayload = buildVariantsPayload();

    setIsLoading(true);
    try {
      const slug = createSlug(values?.name);

      const newProduct = {
        name: values.name,
        slug,
        description: values.description,
        images,
        category: values.category,
        tags: values.tags,
        variants: variantsPayload,
      };
      console.log("newPro", newProduct);

      const res = await addProductToDB(newProduct);

      if (res?.success) {
        toast.success("Product added successfully!");

        // reset local UI state
        setImages([]);
        setVariantGroups([]);
        setVariantGlobalError(null);
        setVariantGroupErrors({});
        setHasVariantValidationRun(false);

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

  /* ------------------------------------------------------------------
     Handle Image Upload
  ------------------------------------------------------------------- */

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
    description: "",
    tags: [],
  };

  const hasAnyVariantSummary =
    variantGroups.filter((g) => g.items && g.items.length > 0).length > 0;

  return (
    <MYForm
      onSubmit={handleAddProduct}
      schema={productSchema}
      defaultValues={defaultValues}
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
              Product Name <span className="text-red-500 font-medium">*</span>
            </label>
            <MYInput name="name" placeholder="Enter product name" />
          </div>

          {/* Category */}
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

        {/* Description */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300">
            Product Description{" "}
            <span className="text-red-500 font-medium">*</span>
          </label>

          <MYTextEditor name="description" />
        </div>

        {/* Tags */}
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

        {/* VARIANTS SECTION */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-4 bg-light-gray/40 dark:bg-deep-dark/40">
          {/* Header + Add Variant */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm xl:text-lg 2xl:text-xl font-medium text-gray-800 dark:text-gray-100">
              Variants
            </h3>

            {remainingVariantTypes.length > 0 ? (
              <Select
                onValueChange={(val) =>
                  handleAddVariantType(val as VariantType)
                }
              >
                <SelectTrigger className="h-7 border-none bg-transparent p-0 text-primary text-xs md:text-sm 2xl:text-base font-semibold uppercase tracking-wide hover:underline w-auto focus:ring-0 focus:ring-offset-0">
                  <span className="flex items-center gap-1 cursor-pointer">
                    <Plus className="h-3 w-3" />
                    <span>Add Variant</span>
                  </span>
                </SelectTrigger>
                <SelectContent className="text-sm">
                  {remainingVariantTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {VARIANT_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs md:text-sm 2xl:text-base uppercase tracking-wide text-gray-400">
                No variant available to add
              </span>
            )}
          </div>

          {variantGroups.length === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No variants added yet. Use{" "}
              <span className="font-medium">Add Variant</span> to create{" "}
              <i>Size</i>, <i>Color</i>, or <i>Weight</i> options.
            </p>
          )}

          {/* Variant Blocks */}
          <div className="space-y-4">
            {variantGroups.map((group) => {
              const { type, items } = group;
              const label = VARIANT_LABELS[type];
              const groupError = variantGroupErrors[type];

              if (!items || items.length === 0) return null;

              return (
                <div
                  key={type}
                  className="rounded-md border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/30 p-3 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs xl:text-sm 2xl:text-base font-semibold text-gray-800 dark:text-gray-100">
                      {label} Variants
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantType(type)}
                      className="text-xs xl:text-sm 2xl:text-base text-red-500 hover:text-red-600 font-medium cursor-pointer"
                    >
                      Remove {label}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {items.map((row, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))_40px] gap-3 items-end"
                      >
                        {/* Value */}
                        <div className="space-y-1">
                          <label className="text-[11px] 2xl:text-sm font-medium text-gray-600 dark:text-gray-300">
                            {label} Value
                          </label>
                          <Input
                            type="text"
                            value={row.value}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                type,
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder={VARIANT_PLACEHOLDERS[type]}
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <label className="text-[11px] 2xl:text-sm font-medium text-gray-600 dark:text-gray-300">
                            Price
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={row.price}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                type,
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* Selling Price */}
                        <div className="space-y-1">
                          <label className="text-[11px] 2xl:text-sm font-medium text-gray-600 dark:text-gray-300">
                            Selling Price
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={row.sellingPrice}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                type,
                                index,
                                "sellingPrice",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* Stock */}
                        <div className="space-y-1">
                          <label className="text-[11px] 2xl:text-sm font-medium text-gray-600 dark:text-gray-300">
                            Stock
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={row.stock}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                type,
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* Remove Row */}
                        <div className="flex items-end justify-end pb-[bpx]">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantRow(type, index)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Per-variant error */}
                  {groupError && (
                    <p className="text-[11px] text-red-600 mt-1">
                      {groupError}
                    </p>
                  )}

                  {/* Add row for this variant type */}
                  <button
                    type="button"
                    onClick={() => handleAddVariantRow(type)}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] 2xl:text-sm font-medium text-primary hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add another {label.toLowerCase()} option</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Global variants error */}
          {variantGlobalError && (
            <p className="text-xs text-red-600 mt-1">{variantGlobalError}</p>
          )}

          {/* Selected Variants Summary */}
          {hasAnyVariantSummary && (
            <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-xs 2xl:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Selected Variants:
              </p>
              <div className="flex flex-wrap gap-2">
                {variantGroups.map((group) => {
                  const count = group.items.length;
                  if (count === 0) return null;

                  return (
                    <span
                      key={group.type}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-600 px-2 py-1 text-[11px] 2xl:text-sm text-gray-700 dark:text-gray-200"
                    >
                      <span className="text-green-500">✔</span>
                      <span className="capitalize">{group.type}</span>:
                      <span>
                        {count} item{count > 1 ? "s" : ""}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
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
