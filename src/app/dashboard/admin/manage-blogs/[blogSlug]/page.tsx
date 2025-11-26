import { getSingleBlogFromDB } from "@/app/actions/blog";
import { getAllCategoriesFromDB } from "@/app/actions/categories";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import { Button } from "@/components/ui/button";
import { TCategory } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
import EditBlogForm from "./_components/EditBlogForm";

export const metadata: Metadata = {
  title: "Edit Blog > Dashboard | Pushtihub",
  description: "Eat & Live Healthy",
};

const SingleEditBlogPage = async (props: {
  params: Promise<{ blogSlug: string }>;
}) => {
  const params = await props.params;
  const blogSlug = params?.blogSlug;

  const singleBlogResponse = await getSingleBlogFromDB(blogSlug);

  const categoriesResponse = await getAllCategoriesFromDB();

  const categories = categoriesResponse?.data.flatMap((category: TCategory) => [
    category.name,
    ...category.subCategories.map((sub) => sub.name),
  ]);

  return (
    <div>
      {/* top section */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/manage-blogs">
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
            Back to Blog list
          </p>
          <h2 className="text-lg md:text-2xl 2xl:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Blog
          </h2>
        </div>
      </div>

      {/* form */}
      <div className="mt-8 md:mt-12">
        {!singleBlogResponse.success ? (
          <NoDataFound
            title={`Blog is not found!`}
            description="We couldn’t find any blog right now. Please check back later for new arrivals."
          />
        ) : (
          <EditBlogForm
            blog={singleBlogResponse?.data}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

export default SingleEditBlogPage;
