"use client";

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
  onClose: () => void;
};

const CategoryItem = ({ category, onClose }: TCategoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <Link
            href={`/shop/${category.slug}`}
            className="flex-1 py-4 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={onClose}
          >
            {category.name}
          </Link>

          {category.subCategories.length > 0 && (
            <CollapsibleTrigger className="p-2">
              <ChevronRight
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
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
                className="pl-4 pb-2 space-y-1 overflow-hidden"
              >
                {category.subCategories.map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/shop/${sub.slug}`}
                    className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    onClick={onClose}
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

export default CategoryItem;
