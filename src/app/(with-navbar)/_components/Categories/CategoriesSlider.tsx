"use client";

import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import "@/styles/custom-swiper.css";
import { TCategory } from "@/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CategoryCard from "./CategoryCard";

type TCategoryMenuProps = {
  categories: TCategory[];
};

const CategoriesSlider = ({ categories }: TCategoryMenuProps) => {
  if (!categories || categories.length === 0) {
    return (
      <NoDataFound
        title="Categories not found!"
        description="We couldn’t find any product categories right now. Please check back later for new arrivals."
      />
    );
  }

  return (
    <div className="mt-4">
      <Swiper
        modules={[Navigation]}
        spaceBetween={2}
        slidesPerView={4}
        slidesOffsetBefore={4}
        slidesOffsetAfter={4}
        // autoplay={{ delay: 4000 }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 2,
            slidesOffsetBefore: 4,
            slidesOffsetAfter: 4,
          },
          768: {
            slidesPerView: 6,
            spaceBetween: 4,
            slidesOffsetBefore: 6,
            slidesOffsetAfter: 6,
          },
          1280: {
            slidesPerView: 10,
            spaceBetween: 6,
            slidesOffsetBefore: 6,
            slidesOffsetAfter: 6,
          },
        }}
        navigation={true}
        // pagination={{ clickable: true }}
        className="w-full"
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoriesSlider;
