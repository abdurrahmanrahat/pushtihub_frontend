import { getAllCategoriesFromDB } from "@/app/actions/categories";
import { getMeFromDB } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { TCategory } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import { MdKeyboardBackspace } from "react-icons/md";
import AddBlogForm from "./_components/AddBlogForm";

export const metadata: Metadata = {
  title: "Add Blog > Dashboard | Pushtihub",
  description: "Eat & Live Healthy",
};

const AddBlogPage = async () => {
  const currentUser = await getMeFromDB();

  const categoriesResponse = await getAllCategoriesFromDB();

  const categories = categoriesResponse?.data.flatMap((category: TCategory) => [
    category.name,
    ...category.subCategories.map((sub) => sub.name),
  ]);

  return (
    <div className="">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/manage-blogs">
          <Button
            variant="outline"
            size="icon"
            className="rounded-md border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300  hover:border-primary transition-colors duration-300"
          >
            <MdKeyboardBackspace className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex flex-col">
          <p className="text-sm 2xl:text-base text-gray-500 dark:text-gray-400">
            Back to Blog list
          </p>
          <h2 className="text-lg md:text-2xl 2xl:text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Add New Blog
          </h2>
        </div>
      </div>

      <div className="w-full max-w-[980px] mx-auto my-6">
        <AddBlogForm
          userId={currentUser?.data?.user?._id}
          categories={categories || []}
        />
      </div>
    </div>
  );
};

export default AddBlogPage;
