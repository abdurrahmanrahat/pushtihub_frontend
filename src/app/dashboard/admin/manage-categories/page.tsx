import { Metadata } from "next";
import AddCategory from "./_components/AddCategory";
import CategoriesLists from "./_components/CategoriesLists";

export const metadata: Metadata = {
  title: "Manage Categories > Dashboard | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const ManageCategoriesPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl 2xl:text-3xl font-semibold">
            Manage Categories
          </h2>
          <p className="text-base 2xl:text-lg mt-1">
            Explore all available categories and their subcategories
          </p>
        </div>
        <AddCategory />
      </div>

      <CategoriesLists />
    </div>
  );
};

export default ManageCategoriesPage;
