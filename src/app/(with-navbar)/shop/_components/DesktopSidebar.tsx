import { getAllCategoriesFromDB } from "@/app/actions/categories";
import { FilterSidebar } from "./FilterSidebar";

const DesktopSidebar = async () => {
  const categoriesResponse = await getAllCategoriesFromDB();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20">
        <FilterSidebar categories={categoriesResponse?.data || []} />
      </div>
    </aside>
  );
};

export default DesktopSidebar;
