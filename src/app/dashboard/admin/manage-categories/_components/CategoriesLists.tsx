import { getAllCategoriesFromDB } from "@/app/actions/categories";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import { TCategory } from "@/types";
import CategoryCard from "./CategoryCard";

const CategoriesLists = async () => {
  const categoriesResponse = await getAllCategoriesFromDB();

  return (
    <section className="py-6">
      {!categoriesResponse?.success ? (
        <NoDataFound
          title="Categories not found!"
          description="We couldn’t find any product categories right now. Please check back later for new arrivals."
        />
      ) : (
        <>
          {categoriesResponse?.data?.data?.length === 0 ? (
            <NoDataFoundBySearchFilter
              title="Categories not found!"
              description="Try searching for something else or clear all filters to explore available collections."
            />
          ) : (
            <div className="space-y-4">
              {categoriesResponse?.data?.map((category: TCategory) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CategoriesLists;
