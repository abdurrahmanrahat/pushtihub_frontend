import { getAllCategoriesFromDB } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

const MobileFilterToggle = async () => {
  const categoriesResponse = await getAllCategoriesFromDB();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-auto lg:hidden border border-gray-200 dark:border-gray-700 py-[22px]"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 overflow-auto p-6"
        showCloseButton={false}
      >
        <FilterSidebar categories={categoriesResponse?.data || []} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterToggle;
