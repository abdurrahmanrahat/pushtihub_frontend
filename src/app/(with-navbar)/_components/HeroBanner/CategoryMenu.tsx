"use client";

import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import { TCategory } from "@/types";
import BannerCategoryItem from "./BannerCategoryItem";

type TCategoryMenuProps = {
  categories: TCategory[];
};

const CategoryMenu = ({ categories }: TCategoryMenuProps) => {
  if (!categories || categories.length === 0) {
    return (
      <NoDataFound
        title="Categories not found!"
        description="We couldn’t find any product categories right now. Please check back later for new arrivals."
      />
    );
  }

  return (
    <div className="h-[440px] overflow-auto scroll-hidden shadow-cardLightShadow dark:shadow-cardDarkShadow section-space-for-shadow rounded-xl">
      <div className="py-1">
        {categories.map((category) => (
          <BannerCategoryItem key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
