"use client";

import MyImage from "@/components/shared/Ui/Image/MyImage";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TCategory } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TCategoryItemProps = {
  category: TCategory;
};

const BannerCategoryItem = ({ category }: TCategoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <Link
            href={`/shop?category=${category.slug}`}
            className="flex-1 py-2 text-sm 2xl:text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
          >
            <MyImage
              src={category.image}
              alt={category.name}
              width={40}
              height={40}
              className="w-[32px] 2xl:w-10 h-[32px] 2xl:h-10 rounded-full object-cover"
            />
            <span>{category.name}</span>
          </Link>

          {category.subCategories.length > 0 && (
            <CollapsibleTrigger className="p-2 cursor-pointer">
              <ChevronRight
                className={`h-5 w-5 2xl:h-6 2xl:w-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                  isOpen ? "rotate-90 text-primary" : ""
                }`}
              />
            </CollapsibleTrigger>
          )}
        </div>

        {/* Animated Subcategory List */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <CollapsibleContent forceMount>
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="pl-12 pb-2 space-y-1 overflow-hidden"
              >
                {category.subCategories.map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/shop?category=${category.slug}`}
                    className="block py-[3px] text-sm 2xl:text-base font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </div>
    </Collapsible>
  );
};

export default BannerCategoryItem;
