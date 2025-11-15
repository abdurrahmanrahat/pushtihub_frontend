import {
  getProductReviewsFromDB,
  getProductReviewsStatsFromDB,
} from "@/app/actions/product-review";
import { Rating } from "@/components/common/Product/Rating";
import NoDataFound from "@/components/shared/Ui/Data/NoDataFound";
import MYPagination from "@/components/shared/Ui/Pagination/MYPagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TProduct, TProductReview } from "@/types";
import { Star } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import ReviewRatingFilter from "./ReviewRatingFilter";
import ReviewsSort from "./ReviewsSort";

type TReviewsSectionProps = {
  product: TProduct;
  averageRating: number;
  totalReviews: number;
  userId: string;
  paramsObj: Record<string, string>;
  MANAGE_REVIEWS_DATA_LIMIT: string;
};

export const ReviewsSection = async ({
  product,
  averageRating,
  totalReviews,
  userId,
  paramsObj,
  MANAGE_REVIEWS_DATA_LIMIT,
}: TReviewsSectionProps) => {
  const reviewsResponse = await getProductReviewsFromDB(product._id, paramsObj);

  // Calculate rating distribution
  const ratingDistributionStatsResponse = await getProductReviewsStatsFromDB(
    product._id
  );

  // const ratingDistribution = [
  //   { stars: 5, count: 141, percentage: 85 },
  //   { stars: 4, count: 7, percentage: 4 },
  //   { stars: 3, count: 4, percentage: 2 },
  //   { stars: 2, count: 0, percentage: 0 },
  //   { stars: 1, count: 13, percentage: 9 },
  // ];

  const totalData = reviewsResponse?.data?.totalCount || 0;

  return (
    <div className="space-y-8">
      {/* Summary and Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Review Summary */}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6 xl:mb-12">
              <h2 className="text-xl md:text-2xl font-bold">
                Customer Reviews
              </h2>
              <Badge variant="outline">{totalReviews || 0} reviews</Badge>
            </div>

            {!ratingDistributionStatsResponse?.success ? (
              <NoDataFound
                title={`Reviews stats with the product '${product.name}' is not found!`}
                description="We couldn’t find any reviews stats right now. Please check back later for new reviews by user."
              />
            ) : (
              <div>
                {/* Overall Rating */}
                <div className="text-center mb-6 xl:mb-12">
                  <div className="text-5xl font-bold mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Rating rating={averageRating} size="lg" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {totalReviews} reviews
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {ratingDistributionStatsResponse?.data.map(
                    ({
                      stars,
                      count,
                      percentage,
                    }: {
                      stars: number;
                      count: number;
                      percentage: number;
                    }) => (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium">{stars}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Write Review Form */}
        <ReviewForm
          productId={product._id}
          productSlug={product.slug}
          userId={userId}
        />
      </div>

      {/* Reviews List */}
      <div>
        <div className="md:flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold mb-4 md:mb-0">All Reviews</h3>

          {/* Sort and Filter */}
          <div className="flex flex-row gap-2 md:gap-4 sm:flex-row sm:items-center justify-between sm:justify-end">
            <ReviewRatingFilter />

            <ReviewsSort />
          </div>
        </div>

        {!reviewsResponse?.success ? (
          <NoDataFound
            title="Reviews not found!"
            description="We couldn’t find any orders right now. Please check back later for new orders."
          />
        ) : (
          <div>
            {reviewsResponse?.data?.data?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                {/* Icon */}
                <div className="p-4 rounded-full bg-gray-100 dark:bg-deep-dark mb-4">
                  <Star className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  This product has no review yet!
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                  Try searching for another product or clear all filters to
                  explore available reviews.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsResponse?.data?.data?.map((review: TProductReview) => (
                  <ReviewCard key={review._id} review={review} />
                ))}

                {reviewsResponse?.data?.data?.length !== 0 &&
                  MANAGE_REVIEWS_DATA_LIMIT < totalData && (
                    <div className="mt-2">
                      <MYPagination
                        totalData={totalData}
                        dataLimit={Number(MANAGE_REVIEWS_DATA_LIMIT)}
                      />
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
