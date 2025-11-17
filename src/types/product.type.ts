export type TPrimaryVariantItem = {
  value: string;
  price: number;
  sellingPrice: number;
  stock: number;
};

export type TPrimaryVariant = {
  type: "size" | "color" | "weight";
  items: TPrimaryVariantItem[];
};

export type TSecondaryVariants = {
  size?: string[];
  color?: string[];
  weight?: string[];
};

export type TVariants = {
  primary: TPrimaryVariant;
  secondary?: TSecondaryVariants;
};

export interface TProduct {
  _id: string;

  name: string;
  slug: string;
  description: string;
  images: string[];

  category: string;
  tags: string[];

  variants: TVariants;

  totalReviews: number;
  averageRatings: number;
  salesCount: number;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
  __v: number;
}
