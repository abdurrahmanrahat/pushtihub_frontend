export type TProductVariantItem = {
  value: string;
  price: number;
  sellingPrice: number;
  stock: number;
};

export type TProductVariantGroup = {
  type: "size" | "color" | "weight";
  items: TProductVariantItem[];
};

export type TProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string; // html string
  images: string[];
  category: string;

  // NEW VARIANT SYSTEM
  variants: TProductVariantGroup[];

  tags: string[];

  totalReviews: number;
  averageRatings: number;
  salesCount: number;

  isDeleted: boolean;

  createdAt: string; // ISO string from server
  updatedAt: string;

  __v: number;
};
