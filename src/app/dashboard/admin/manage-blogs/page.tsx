import { getAllBlogsFromDB } from "@/app/actions/blog";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import NoDataFoundBySearchFilter from "@/components/shared/Ui/Data/NoDataFoundBySearchFilter";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import MYPagination from "@/components/shared/Ui/Pagination/MYPagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TBlog } from "@/types";
import { Pencil } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import BlogsSearch from "./_components/BlogsSearch";
import DeleteBlogModal from "./_components/DeleteBlogModal";

export const metadata: Metadata = {
  title: "Manage Blogs > Dashboard | Pushtihub",
  description: "Eat & Live Healthy",
};

type TManageBlogsPageParams = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

const MANAGE_BLOGS_DATA_LIMIT = "8";

const ManageBlogsPage = async (props: {
  searchParams: Promise<TManageBlogsPageParams>;
}) => {
  const searchParams = await props?.searchParams;

  const {
    searchTerm,
    page = "1",
    limit = MANAGE_BLOGS_DATA_LIMIT,
    sort,
  } = searchParams || {};

  const params: Record<string, string> = {};

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }
  if (page) {
    params.page = page;
  }
  if (limit) {
    params.limit = limit;
  }
  if (sort) {
    params.sort = sort;
  }

  const blogsResponse = await getAllBlogsFromDB(params);

  const totalData = blogsResponse?.data?.totalCount || 0;

  return (
    <div className="min-h-screen w-full">
      <div>
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-card px-3 md:px-6">
            <div className="flex gap-4 items-center justify-between">
              <CardTitle className="text-xl md:text-2xl 2xl:text-3xl font-semibold">
                All Blog List
              </CardTitle>
              <Link href="/dashboard/admin/add-blog">
                <Button variant="default" className="">
                  Add Blog
                </Button>
              </Link>
            </div>
          </CardHeader>

          {!blogsResponse?.success ? (
            <NoDataFound
              title="Blogs not found!"
              description="We couldn’t find any blogs right now. Please check back later for new posts."
            />
          ) : (
            <CardContent className="px-3 md:px-6">
              {/* Filters Section */}
              <div className="mb-6 flex flex-col gap-2 md:gap-4 sm:flex-row sm:items-center">
                <BlogsSearch />

                {/* <ManageProductsCategoryFilter categories={categories} />

                <ProductsSort /> */}
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 ">
                {blogsResponse?.data?.data?.length === 0 ? (
                  <NoDataFoundBySearchFilter
                    title="Blogs not found!"
                    description="Try searching for something else or clear all filters to explore available blogs."
                  />
                ) : (
                  <Table className="">
                    <TableHeader className="">
                      <TableRow className="">
                        <TableHead>#</TableHead>
                        <TableHead>Blog Image</TableHead>
                        <TableHead>Blog Title</TableHead>

                        <TableHead>Author Name</TableHead>

                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogsResponse?.data?.data?.map(
                        (blog: TBlog, index: number) => (
                          <TableRow key={blog._id} className="">
                            <TableCell className="font-semibold text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <MyImage
                                src={blog.image}
                                alt={blog.title.slice(0, 4)}
                                width={50}
                                height={50}
                                className="rounded-full"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {blog.title}
                            </TableCell>

                            <TableCell>{blog.authorDetails.name}</TableCell>

                            <TableCell>
                              <div className="flex items-center justify-center gap-1 md:gap-2">
                                <Link
                                  href={`/dashboard/admin/manage-blogs/${blog.slug}`}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-muted"
                                  >
                                    <Pencil className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </Link>

                                <DeleteBlogModal blogId={blog._id} />
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>

              {blogsResponse?.data?.data?.length !== 0 &&
                MANAGE_BLOGS_DATA_LIMIT < totalData && (
                  <div className="mt-6">
                    <MYPagination
                      totalData={totalData}
                      dataLimit={Number(MANAGE_BLOGS_DATA_LIMIT)}
                    />
                  </div>
                )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageBlogsPage;
