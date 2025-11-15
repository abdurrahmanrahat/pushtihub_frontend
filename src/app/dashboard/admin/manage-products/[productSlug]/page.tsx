import { getAllCategoriesFromDB } from "@/app/actions/categories";
import { getSingleProductFromDB } from "@/app/actions/product";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import { Button } from "@/components/ui/button";
import { TCategory } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
import EditProductForm from "./_component/EditProductForm";

export const metadata: Metadata = {
  title: "Edit Product > Dashboard | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

const ManageProductEditPage = async (props: {
  params: Promise<{ productSlug: string }>;
}) => {
  const params = await props.params;
  const productSlug = params?.productSlug;

  const singleProductResponse = await getSingleProductFromDB(productSlug);

  const categoriesResponse = await getAllCategoriesFromDB();

  const categories = categoriesResponse?.data.flatMap((category: TCategory) => {
    const parentOption = {
      value: category.slug,
      label: category.name,
    };

    // sub categories options if avaiable
    const subOptions = category.subCategories?.map((sub) => ({
      value: sub.slug,
      label: `${category.name} > ${sub.name}`,
    }));

    return [parentOption, ...subOptions];
  });

  const categorySlugs = categoriesResponse?.data.flatMap(
    (category: TCategory) => {
      const parentSlug = category.slug;

      // sub categories slugs if available
      const subSlugs = category.subCategories?.map((sub) => sub.slug);

      return [parentSlug, ...subSlugs];
    }
  );

  return (
    <div>
      {/* top section */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/manage-products">
          <Button
            variant="outline"
            size="icon"
            className="rounded-md border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary transition-colors duration-300"
          >
            <MdKeyboardBackspace className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex flex-col">
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">
            Back to product list
          </p>
          <h2 className="text-lg md:text-2xl 2xl:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Product
          </h2>
        </div>
      </div>

      {/* form */}
      <div className="mt-8 md:mt-12">
        {!singleProductResponse.success ? (
          <NoDataFound
            title={`Product with the slug '${productSlug}' is not found!`}
            description="We couldn’t find any product right now. Please check back later for new arrivals."
          />
        ) : (
          <EditProductForm
            categories={categories}
            categorySlugs={categorySlugs}
            product={singleProductResponse?.data}
          />
        )}
      </div>
    </div>
  );
};

export default ManageProductEditPage;
