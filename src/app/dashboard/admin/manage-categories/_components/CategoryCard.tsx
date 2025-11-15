"use client";

import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TCategory, TSubCategory } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import DeleteCategory from "./DeleteCategory";
import UpdateCategory from "./UpdateCategory";

const CategoryCard = ({ category }: { category: TCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-deep-dark py-3">
      <CardContent className="px-4 ">
        {/* Category Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <MyImage
                src={category.image}
                alt={category.name}
                fill
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg 2xl:text-xl text-foreground group-hover:text-primary transition-colors truncate">
                {category.name}
              </h3>
              <p className="text-sm 2xl:text-base text-muted-foreground">
                {hasSubCategories
                  ? `${category.subCategories.length} Subcategories`
                  : "No subcategories"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center">
            {!hasSubCategories ? (
              // Show edit/delete for categories without subcategories
              <>
                <UpdateCategory
                  isParentUpdate={true}
                  category={{
                    _id: category._id,
                    name: category.name,
                    slug: category.slug,
                    image: category.image,
                  }}
                />
                <DeleteCategory categoryId={category._id} />
              </>
            ) : (
              <>
                <UpdateCategory
                  isParentUpdate={true}
                  category={{
                    _id: category._id,
                    name: category.name,
                    slug: category.slug,
                    image: category.image,
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 2xl:h-6 2xl:w-6" />
                  ) : (
                    <ChevronDown className="h-5 w-5 2xl:h-6 2xl:w-6" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Subcategory List */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-0">
              {category.subCategories?.map((sub: TSubCategory) => (
                <div
                  key={sub._id}
                  className="flex items-center justify-between px-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group/sub border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm 2xl:text-base font-medium text-foreground group-hover/sub:text-primary transition-colors truncate">
                      {sub.name}
                    </span>
                    <span className="text-xs 2xl:text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      /{sub.slug}
                    </span>
                  </div>

                  {/* Subcategory Actions */}
                  <div className="flex items-center  opacity-0 group-hover/sub:opacity-100 transition-opacity">
                    <UpdateCategory
                      isParentUpdate={false}
                      category={{
                        _id: sub._id,
                        name: sub.name,
                        slug: sub.slug,
                      }}
                    />
                    <DeleteCategory categoryId={sub._id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
