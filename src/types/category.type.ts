export type TCategory = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  productsCount?: number;
  subCategories: TSubCategory[];
};

export type TSubCategory = {
  _id: string;
  name: string;
  slug: string;
  productsCount?: number;
};

export type TCategoryUploadData = {
  name: string;
  slug: string;
  image: string | null;
  subCategoryOf: string | null;
};

export type TUpdateCategory = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};
