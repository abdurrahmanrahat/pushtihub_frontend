"use client";

import { updateProductInDB } from "@/app/actions/product";
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
import { TProduct } from "@/types/product.type";
import { createSlug } from "@/utils/createSlug";
import { ImageUp, Loader, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";

/* --------------------------------------------------------------
   Form Schema (same as create, but no price here anymore)
-------------------------------------------------------------- */
const productSchema = z.object({
  name: z.string().min(1, "Please provide a product name."),
  category: z.string().min(1, "Please select a category."),
  description: z.string().min(1, "Provide product description."),
  tags: z.array(z.string()).min(1, "Select at least one tag."),
});

type ProductFormValues = z.infer<typeof productSchema>;

/* --------------------------------------------------------------
   Variant Types
-------------------------------------------------------------- */
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

type Props = {
  categories: { value: string; label: string }[];
  categorySlugs: string[];
  product: TProduct;
};

export default function EditProductForm({
  categories,
  categorySlugs,
  product,
}: Props) {
  const router = useRouter();

  /* ------------------------------------------------------------------
      IMAGES
  ------------------------------------------------------------------ */
  const [images, setImages] = useState<string[]>(product.images || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  /* ------------------------------------------------------------------
      VARIANTS — PREFILLED FROM PRODUCT
  ------------------------------------------------------------------ */
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const [variantGlobalError, setVariantGlobalError] = useState<string | null>(
    null
  );
  const [variantGroupErrors, setVariantGroupErrors] = useState<
    Partial<Record<VariantType, string | null>>
  >({});
  const [hasVariantValidationRun, setHasVariantValidationRun] = useState(false);

  /* ----------------- Convert product.variants into array groups ----------------- */
  useEffect(() => {
    if (Array.isArray(product?.variants)) {
      const formatted: VariantGroup[] = product.variants.map((vg) => ({
        type: vg.type as VariantType,
        items: vg.items.map((i) => ({
          value: i.value,
          price: i.price,
          sellingPrice: i.sellingPrice,
          stock: i.stock,
        })),
      }));
      setVariantGroups(formatted);
    }
  }, [product]);

  const remainingVariantTypes: VariantType[] = ALL_VARIANT_TYPES.filter(
    (t) => !variantGroups.some((g) => g.type === t)
  );

  /* ------------------------------------------------------------------
     VALIDATION
  ------------------------------------------------------------------ */
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
      if (!items.length) {
        anyInvalid = true;
        groupErrors[
          type
        ] = `Please add at least one ${VARIANT_LABELS[type]} option.`;
        continue;
      }

      const invalid = items.some((row) => {
        if (!row.value || row.value.trim() === "") return true;
        const price = Number(row.price);
        const sp = Number(row.sellingPrice);
        const stock = Number(row.stock);
        if (!price || price <= 0 || isNaN(price)) return true;
        if (!sp || sp <= 0 || isNaN(sp)) return true;
        if (isNaN(stock) || stock < 0) return true;
        return false;
      });

      if (invalid) {
        anyInvalid = true;
        groupErrors[
          type
        ] = `Please complete all fields for ${VARIANT_LABELS[type]} variants.`;
      }
    }

    if (anyInvalid) {
      globalError =
        globalError ?? "Some variants are incomplete. Please fill all fields.";
    }

    if (withErrors) {
      setVariantGroupErrors(groupErrors);
      setVariantGlobalError(globalError);
    }

    return !anyInvalid;
  };

  const validateVariants = (withErrors: boolean) =>
    runVariantValidation(variantGroups, withErrors);

  /* ------------------------------------------------------------------
     VARIANT HANDLERS
  ------------------------------------------------------------------ */
  const handleAddVariantType = (type: VariantType) => {
    setVariantGroups((prev) => {
      const newGroup: VariantGroup = {
        type,
        items: [
          {
            value: "",
            price: "",
            sellingPrice: "",
            stock: "",
          },
        ],
      };

      const updated = [...prev, newGroup];

      if (hasVariantValidationRun) {
        runVariantValidation(updated, true);
      }

      return updated;
    });
  };

  const handleRemoveVariantType = (type: VariantType) => {
    setVariantGroups((prev) => {
      const updated = prev.filter((g) => g.type !== type);
      if (hasVariantValidationRun) runVariantValidation(updated, true);
      return updated;
    });
  };

  const handleAddVariantRow = (type: VariantType) => {
    const newRow: VariantItem = {
      value: "",
      price: "",
      sellingPrice: "",
      stock: "",
    };

    setVariantGroups((prev) => {
      const updated = prev.map((g) =>
        g.type === type ? { ...g, items: [...g.items, newRow] } : g
      );
      if (hasVariantValidationRun) runVariantValidation(updated, true);
      return updated;
    });
  };

  const handleRemoveVariantRow = (type: VariantType, index: number) => {
    setVariantGroups((prev) => {
      const updated = prev
        .map((g) =>
          g.type === type
            ? { ...g, items: g.items.filter((_, i) => i !== index) }
            : g
        )
        .filter((g) => g.items.length > 0);

      if (hasVariantValidationRun) runVariantValidation(updated, true);
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
      const updated = prev.map((g) => {
        if (g.type !== type) return g;

        const updatedItems = g.items.map((item, i) => {
          if (i !== index) return item;

          const updatedItem: VariantItem = {
            ...item,
            [field]:
              field === "price" || field === "sellingPrice" || field === "stock"
                ? value === ""
                  ? ""
                  : Number(value)
                : value,
          };

          return updatedItem;
        });

        return { ...g, items: updatedItems };
      });

      if (hasVariantValidationRun) {
        runVariantValidation(updated, true);
      }

      return updated;
    });
  };

  const buildVariantsPayload = (): VariantGroupPayload[] =>
    variantGroups.map((g) => ({
      type: g.type,
      items: g.items.map((i) => ({
        value: i.value.trim(),
        price: Number(i.price),
        sellingPrice: Number(i.sellingPrice),
        stock: Number(i.stock),
      })),
    }));

  /* ------------------------------------------------------------------
     SUBMIT HANDLER
  ------------------------------------------------------------------ */
  const handleSubmit = async (values: ProductFormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setHasVariantValidationRun(true);

    const variantsValid = validateVariants(true);
    if (!variantsValid) return;

    const variantsPayload = buildVariantsPayload();

    setIsLoading(true);

    try {
      const slug = createSlug(values.name);

      const updated = {
        name: values.name,
        slug,
        category: values.category,
        images,
        description: values.description,
        tags: values.tags,
        variants: variantsPayload,
      };

      const res = await updateProductInDB(product._id, updated);

      if (!res?.success) {
        toast.error(res?.message || "Something went wrong!");
      } else {
        toast.success("Product updated successfully!");

        router.push("/dashboard/admin/manage-products");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------
     IMAGE UPLOAD
  ------------------------------------------------------------------ */
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("You can upload max 5 images");
      return;
    }

    setIsImageUploading(true);

    try {
      const uploads = Array.from(files).map(async (file) => {
        if (file.size > 1 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 1MB`);
          return null;
        }

        const fd = new FormData();
        fd.append("image", file);

        const res = await fetch(img_hosting_url, {
          method: "POST",
          body: fd,
        }).then((r) => r.json());

        return res.success ? res.data.display_url : null;
      });

      const uploaded = (await Promise.all(uploads)).filter(Boolean) as string[];
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setIsImageUploading(false);
    }
  };

  /* ------------------------------------------------------------------
     DEFAULT FORM VALUES
  ------------------------------------------------------------------ */
  const defaultValues: ProductFormValues = {
    name: product.name,
    category: product.category,
    description: product.description,
    tags: product.tags,
  };

  const hasAnyVariantSummary = variantGroups.some((g) => g.items.length > 0);

  /* ------------------------------------------------------------------
     JSX
  ------------------------------------------------------------------ */
  return (
    <MYForm
      defaultValues={defaultValues}
      schema={productSchema}
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        {/* NAME + CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium">
              Product Name <span className="text-red-500">*</span>
            </label>
            <MYInput name="name" placeholder="Enter product name" />
          </div>

          <div className="grid gap-[6px]">
            <label className="text-sm 2xl:text-base font-medium">
              Product Category <span className="text-red-500">*</span>
            </label>
            <MYSelect
              name="category"
              options={categories}
              placeholder="Select category"
            />
          </div>
        </div>

        {/* IMAGES */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium">
            Product Images <span className="text-red-500">*</span>
          </label>

          <div>
            <input
              type="file"
              className="hidden"
              id="edit-product-images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />

            {images.length === 0 ? (
              <label
                htmlFor="edit-product-images"
                className="flex flex-col items-center justify-center py-6 px-3 rounded-md border cursor-pointer"
              >
                <ImageUp className="h-8 w-8 mb-2 text-gray-400" />
                <p>Click to upload images</p>
              </label>
            ) : (
              <div className="flex flex-wrap gap-3 py-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 border border-muted rounded overflow-hidden group"
                  >
                    <MyImage
                      src={img}
                      alt={`image no ${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white text-[11px] rounded-full px-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label
                    htmlFor="edit-product-images"
                    className="w-24 h-24 border border-dashed border-muted rounded flex items-center justify-center cursor-pointer hover:border-primary transition-all duration-300"
                  >
                    <ImageUp className="h-6 w-6 text-gray-400" />
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium">
            Product Description <span className="text-red-500">*</span>
          </label>
          <MYTextEditor name="description" />
        </div>

        {/* TAGS */}
        <div className="grid gap-[6px]">
          <label className="text-sm 2xl:text-base font-medium">
            Product Tags <span className="text-red-500">*</span>
          </label>
          <MYMultiSelectWithExtra
            name="tags"
            options={categorySlugs}
            placeholder="Select product tags"
          />
        </div>

        {/* ------------------------- VARIANT SECTION ------------------------- */}
        <div className="border border-gray-200 p-4 rounded space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm md:text-base 2xl:text-lg">
              Variants
            </h3>

            {remainingVariantTypes.length > 0 ? (
              <Select
                onValueChange={(val) =>
                  handleAddVariantType(val as VariantType)
                }
              >
                <SelectTrigger className="h-7 p-0 text-primary text-xs 2xl:text-sm bg-transparent hover:underline border-none">
                  + Add Variant
                </SelectTrigger>
                <SelectContent>
                  {remainingVariantTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {VARIANT_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs xl:text-sm 2xl:text-base text-gray-400">
                No variant available to add
              </span>
            )}
          </div>

          {variantGroups.length === 0 && (
            <p className="text-xs xl:text-sm 2xl:text-base text-gray-500">
              No variants added yet. Click <b>Add Variant</b> to begin.
            </p>
          )}

          <div className="space-y-4">
            {variantGroups.map((group) => {
              const groupError = variantGroupErrors[group.type];
              const label = VARIANT_LABELS[group.type];

              return (
                <div
                  key={group.type}
                  className="border border-muted rounded-md p-3 bg-white/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{label} Variants</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantType(group.type)}
                      className="text-xs 2xl:text-sm cursor-pointer text-red-500 hover:text-red-600"
                    >
                      Remove {label}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {group.items.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-2 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))_40px] gap-3"
                      >
                        {/* value */}
                        <div className="space-y-1">
                          <label className="text-xs 2xl:text-sm">
                            {label} Value
                          </label>
                          <Input
                            type="text"
                            value={row.value}
                            placeholder={VARIANT_PLACEHOLDERS[group.type]}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                group.type,
                                idx,
                                "value",
                                e.target.value
                              )
                            }
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* price */}
                        <div className="space-y-1">
                          <label className="text-xs 2xl:text-sm">Price</label>
                          <Input
                            type="number"
                            value={row.price}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                group.type,
                                idx,
                                "price",
                                e.target.value
                              )
                            }
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* selling price */}
                        <div className="space-y-1">
                          <label className="text-xs 2xl:text-sm">
                            Selling Price
                          </label>
                          <Input
                            type="number"
                            value={row.sellingPrice}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                group.type,
                                idx,
                                "sellingPrice",
                                e.target.value
                              )
                            }
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* stock */}
                        <div className="space-y-1">
                          <label className="text-xs 2xl:text-sm">Stock</label>
                          <Input
                            type="number"
                            value={row.stock}
                            onChange={(e) =>
                              handleVariantFieldChange(
                                group.type,
                                idx,
                                "stock",
                                e.target.value
                              )
                            }
                            className="py-[18px] px-4 rounded-md border border-muted text-gray-800 dark:text-gray-200 
                        placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none hover:border-primary focus:border-primary
                            transition-all duration-200 ease-in-out bg-light-gray dark:bg-deep-dark"
                          />
                        </div>

                        {/* remove row */}
                        <div className="flex items-end justify-end pb-[4px]">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveVariantRow(group.type, idx)
                            }
                            className="h-8 w-8 flex items-center justify-center border border-muted rounded hover:bg-red-100 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Variant error */}
                  {groupError && (
                    <p className="text-xs text-red-600">{groupError}</p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAddVariantRow(group.type)}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] 2xl:text-sm font-medium text-primary hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add another {label.toLowerCase()} option</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Global error */}
          {variantGlobalError && (
            <p className="text-xs text-red-600">{variantGlobalError}</p>
          )}

          {/* SUMMARY */}
          {hasAnyVariantSummary && (
            <div className="border-t border-muted pt-2 mt-2">
              <p className="text-xs font-semibold mb-1">Selected Variants:</p>

              {/* {variantGroups.map((g) => (
                <span
                  key={g.type}
                  className="inline-flex items-center text-xs border border-muted rounded px-2 py-1 mr-2"
                >
                  ✔ {g.type}: {g.items.length} item
                  {g.items.length > 1 ? "s" : ""}
                </span>
              ))} */}
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
          )}
        </div>

        {/* SUBMIT */}
        <Button
          className="w-full h-11"
          type="submit"
          disabled={isLoading || isImageUploading}
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
}
