"use client";

import MYMultiSelectWithExtra from "@/components/shared/Forms/MYMultiSelectWithExtra";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { colors } from "@/utils/colors";
import { sizes } from "@/utils/sizes";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FieldErrors,
  Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

type TVariantType = "size" | "color" | "weight";

const VARIANT_LABELS: Record<TVariantType, string> = {
  size: "Size",
  color: "Color",
  weight: "Weight",
};

/* -----------------------------------------------------
   SAFE ERROR ACCESSOR
------------------------------------------------------ */
const getVariantError = (
  err: FieldErrors<any>,
  key: "primary" | "secondary"
) => {
  if (!err?.variants) return undefined;
  if (typeof err.variants !== "object") return undefined;
  return (err.variants as any)[key];
};

function getPrimaryItemError(
  errors: FieldErrors<any>,
  index: number,
  field: "value" | "price" | "sellingPrice" | "stock"
) {
  if (
    errors?.variants &&
    typeof errors.variants === "object" &&
    "primary" in errors.variants &&
    (errors.variants as any).primary?.items &&
    Array.isArray((errors.variants as any).primary.items)
  ) {
    return (errors.variants as any).primary.items[index]?.[field];
  }
  return undefined;
}

const VariantManagerEdit = () => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<any>();

  // Primary type from form state (prefilled by defaultValues)
  const primaryType: TVariantType | "" = watch("variants.primary.type");

  const {
    fields: primaryItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants.primary.items",
  });

  // Secondary values in form (size/color/weight arrays)
  const secondaryValues = watch("variants.secondary");

  /* -----------------------------------------------------
     SECONDARY VARIANTS — local UI state (only visibility)
------------------------------------------------------ */
  const [secondary, setSecondary] = useState<{
    size?: boolean;
    color?: boolean;
    weight?: boolean;
  }>({});

  // Initialize secondary toggles based on existing values (edit mode)
  useEffect(() => {
    if (!secondaryValues) return;

    setSecondary({
      size:
        Array.isArray(secondaryValues.size) && secondaryValues.size.length > 0,
      color:
        Array.isArray(secondaryValues.color) &&
        secondaryValues.color.length > 0,
      weight:
        Array.isArray(secondaryValues.weight) &&
        secondaryValues.weight.length > 0,
    });
  }, [secondaryValues]);

  const toggleSecondary = (type: TVariantType, enabled: boolean) => {
    setSecondary((prev) => ({
      ...prev,
      [type]: enabled ? true : false,
    }));

    const path = `variants.secondary.${type}` as Path<any>;

    if (!enabled) {
      // Clear array when unchecked
      setValue(path, []);
    } else {
      const existing = watch(path) || [];
      setValue(path, existing); // Ensure array exists in RHF
    }
  };

  const primaryError = getVariantError(errors, "primary");
  const secondaryError = getVariantError(errors, "secondary");

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 space-y-4 bg-light-gray/40 dark:bg-deep-dark/40">
      {/* ---------------------------------------------------
          PRIMARY VARIANT SELECTION
      ---------------------------------------------------- */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm xl:text-base 2xl:text-lg font-medium text-gray-800 dark:text-gray-100">
          Primary Variant
        </h3>

        {/* <Select
          value={primaryType || undefined}
          onValueChange={(val) => {
            // When switching primary variant type in edit mode:
            //  - reset primary items
            //  - reset secondary selections
            setValue("variants.primary.items", []);
            setSecondary({});
            setValue("variants.secondary", {});
            setValue("variants.primary.type", val as TVariantType);

            append({ value: "", price: 0, sellingPrice: 0, stock: 0 });
          }}
        >
          <SelectTrigger className="h-8 md:h-9 w-40 text-sm 2xl:text-base">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="weight">Weight</SelectItem>
            <SelectItem value="size">Size</SelectItem>
            <SelectItem value="color">Color</SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      {primaryError?.type && (
        <p className="text-xs text-red-600 mt-1">
          {(primaryError.type.message as string) ||
            "Please select a primary variant type."}
        </p>
      )}

      {/* ---------------------------------------------------
          PRIMARY VARIANT ITEMS
      ---------------------------------------------------- */}
      {primaryType && (
        <div className="space-y-3">
          <p className="text-xs xl:text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-200">
            {VARIANT_LABELS[primaryType]} Options
          </p>

          {primaryItems.map((field, index) => {
            const valueError = getPrimaryItemError(errors, index, "value");
            const priceError = getPrimaryItemError(errors, index, "price");
            const sellingError = getPrimaryItemError(
              errors,
              index,
              "sellingPrice"
            );
            const stockError = getPrimaryItemError(errors, index, "stock");

            return (
              <div
                key={field.id}
                className="w-full flex flex-col md:flex-row gap-3 items-end justify-center"
              >
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 xl:gap-3 justify-between">
                  {/* VALUE */}
                  <div className="space-y-1 relative">
                    <label className="text-xs xl:text-xs 2xl:text-[15px] font-medium text-gray-600 dark:text-gray-300">
                      {VARIANT_LABELS[primaryType]} Value
                    </label>

                    <Input
                      {...register(
                        `variants.primary.items.${index}.value` as const
                      )}
                      placeholder={
                        primaryType === "weight"
                          ? "e.g. 250g"
                          : primaryType === "size"
                          ? "e.g. M"
                          : "e.g. Red"
                      }
                    />

                    {valueError && (
                      <p className="absolute -bottom-[14px] text-red-600 text-xs mt-1">
                        {(valueError.message as string) || "Invalid value"}
                      </p>
                    )}
                  </div>

                  {/* PRICE */}
                  <div className="space-y-1 relative">
                    <label className="text-xs xl:text-xs 2xl:text-[15px] font-medium text-gray-600 dark:text-gray-300">
                      Price
                    </label>

                    <Input
                      type="number"
                      {...register(
                        `variants.primary.items.${index}.price` as const
                      )}
                    />

                    {priceError && (
                      <p className="absolute -bottom-[14px] text-red-600 text-xs mt-1">
                        {(priceError.message as string) || "Invalid price"}
                      </p>
                    )}
                  </div>

                  {/* SELLING PRICE */}
                  <div className="space-y-1 relative">
                    <label className="text-xs xl:text-xs 2xl:text-[15px] font-medium text-gray-600 dark:text-gray-300">
                      Selling Price
                    </label>

                    <Input
                      type="number"
                      {...register(
                        `variants.primary.items.${index}.sellingPrice` as const
                      )}
                    />

                    {sellingError && (
                      <p className="absolute -bottom-[14px] text-red-600 text-xs mt-1">
                        {(sellingError.message as string) ||
                          "Invalid selling price"}
                      </p>
                    )}
                  </div>

                  {/* STOCK */}
                  <div className="space-y-1 relative">
                    <label className="text-xs xl:text-xs 2xl:text-[15px] font-medium text-gray-600 dark:text-gray-300">
                      Stock
                    </label>

                    <Input
                      type="number"
                      {...register(
                        `variants.primary.items.${index}.stock` as const
                      )}
                    />

                    {stockError && (
                      <p className="absolute -bottom-[14px] text-red-600 text-xs mt-1">
                        {(stockError.message as string) || "Invalid stock"}
                      </p>
                    )}
                  </div>
                </div>

                {/* REMOVE BUTTON */}
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="h-8 w-8 2xl:h-10 2xl:w-10 flex items-center justify-center rounded border border-muted cursor-pointer hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5 2xl:h-5 2xl:w-5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              append({ value: "", price: 0, sellingPrice: 0, stock: 0 })
            }
            className="text-xs 2xl:text-sm flex gap-1 text-primary hover:underline px-0"
          >
            <Plus className="h-3 w-3" />
            Add another {VARIANT_LABELS[primaryType]}
          </Button>
        </div>
      )}

      {/* ---------------------------------------------------
          SECONDARY VARIANTS (only after primary selected)
      ---------------------------------------------------- */}
      {primaryType && (
        <div className="pt-4 border-t border-dashed border-muted space-y-3">
          <p className="text-xs xl:text-sm 2xl:text-base">
            Secondary Variants (optional)
          </p>

          {/* CHECKBOXES (excluding primary) */}
          <div className="flex flex-wrap gap-4 text-xs 2xl:text-base">
            {(["size", "color", "weight"] as TVariantType[])
              .filter((t) => t !== primaryType)
              .map((type) => (
                <label
                  key={type}
                  className="inline-flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={!!secondary[type]}
                    onCheckedChange={(val) =>
                      toggleSecondary(type, Boolean(val))
                    }
                  />
                  <span className="capitalize">{VARIANT_LABELS[type]}</span>
                </label>
              ))}
          </div>

          {/* SECONDARY FIELDS */}
          <div className="space-y-3">
            {secondary.size && (
              <MYMultiSelectWithExtra
                name="variants.secondary.size"
                options={sizes}
                placeholder="Add size (multiple allow)"
              />
            )}

            {secondary.color && (
              <MYMultiSelectWithExtra
                name="variants.secondary.color"
                options={colors}
                placeholder="Add color (multiple allow)"
              />
            )}

            {secondary.weight && (
              <MYMultiSelectWithExtra
                name="variants.secondary.weight"
                options={["250g", "500g"]}
                placeholder="Add weight (multiple allow)"
              />
            )}
          </div>

          {secondaryError && (
            <p className="text-xs text-red-600 mt-1">
              {(secondaryError.message as string) ||
                "Please review secondary variant options."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantManagerEdit;
