import { TProduct } from "./product.type";

// This is the item inside each selected variant
export type TVariantItem = {
  value: string;
  price?: number;
  sellingPrice?: number;
  stock?: number;
};

// What user selects
export type TSelectedVariant = {
  type: "size" | "color" | "weight"; // supports expansion in future
  item: TVariantItem;
};

// Cart item structure
export type TCartItem = {
  product: TProduct;
  quantity: number;
  selectedVariants: TSelectedVariant[]; // ARRAY
};
