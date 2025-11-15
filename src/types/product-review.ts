export type TProductReview = {
  _id: string;
  user: string;
  product: string;
  productSlug: string;
  images?: string[];
  rating: number;
  review: string;
  isVerified: boolean; // Verified Purchase status
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v?: number;
};
