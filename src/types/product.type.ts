export type TProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string; // html string
  images: string[];
  category: string;
  price: number;
  sellingPrice: number;
  stock: number;
  tags: string[];
  totalReviews: number;
  averageRatings: number;
  salesCount: number;
  isDeleted: boolean;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  __v: number;
};
