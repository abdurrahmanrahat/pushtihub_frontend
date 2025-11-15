import { getAllReviewsFromDB } from "@/app/actions/product-review";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import MYPagination from "@/components/shared/Ui/Pagination/MYPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TProductReview } from "@/types";
import { Star } from "lucide-react";
import { Metadata } from "next";
import ReviewRatingFilter from "./_components/ReviewRatingFilter";
import ReviewsSort from "./_components/ReviewsSort";
import ReviewsStatusFilter from "./_components/ReviewsStatusFilter";
import ReviewTableRow from "./_components/ReviewTableRow";

export const metadata: Metadata = {
  title: "Manage Reviews > Dashboard | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

type TManageReviewsPageParams = {
  searchTerm?: string;
  isVerified?: string;
  rating?: string;
  page?: string;
  limit?: string;
  sort?: string;
};

const MANAGE_REVIEWS_DATA_LIMIT = "8";

const ManageReviewsPage = async (props: {
  searchParams: Promise<TManageReviewsPageParams>;
}) => {
  const searchParams = await props?.searchParams;

  const {
    searchTerm,
    isVerified,
    rating,
    page = "1",
    limit = MANAGE_REVIEWS_DATA_LIMIT,
    sort,
  } = searchParams || {};

  const params: Record<string, string> = {};

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }
  if (isVerified) {
    params.isVerified = isVerified;
  }
  if (rating) {
    params.rating = rating;
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

  const reviewsResponse = await getAllReviewsFromDB(params);

  const totalData = reviewsResponse?.data?.totalCount || 0;

  return (
    <div className="min-h-screen w-full">
      <div>
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-card px-3 md:px-6">
            <CardTitle className="text-xl md:text-2xl 2xl:text-3xl font-semibold">
              All Reviews List
            </CardTitle>
          </CardHeader>

          {!reviewsResponse?.success ? (
            <NoDataFound
              title="Reviews not found!"
              description="We couldn’t find any orders right now. Please check back later for new orders."
            />
          ) : (
            <CardContent className="px-3 md:px-6">
              {/* Filters Section */}
              <div className="mb-6 flex flex-col gap-2 md:gap-4 sm:flex-row sm:items-center sm:justify-end">
                {/* <ReviewSearch /> */}

                <ReviewsStatusFilter />

                <ReviewRatingFilter />

                <ReviewsSort />
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 ">
                {reviewsResponse?.data?.data?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    {/* Icon */}
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-deep-dark mb-4">
                      <Star className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      Reviews not found!
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                      Try searching for something else or clear all filters to
                      explore available reviews.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="">
                      <TableRow className="">
                        <TableHead className="">User Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {reviewsResponse?.data?.data?.map(
                        (review: TProductReview) => (
                          <ReviewTableRow key={review._id} review={review} />
                        )
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>

              {reviewsResponse?.data?.data?.length !== 0 &&
                MANAGE_REVIEWS_DATA_LIMIT < totalData && (
                  <div className="mt-6">
                    <MYPagination
                      totalData={totalData}
                      dataLimit={Number(MANAGE_REVIEWS_DATA_LIMIT)}
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

export default ManageReviewsPage;
