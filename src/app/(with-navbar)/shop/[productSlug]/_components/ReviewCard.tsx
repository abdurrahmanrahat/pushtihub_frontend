import { getSingleUserFromDB } from "@/app/actions/users";
import { Rating } from "@/components/common/Product/Rating";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Card, CardContent } from "@/components/ui/card";
import { TProductReview } from "@/types";
import { formatTimeForHowLongAgo } from "@/utils/date";
import { CheckCircle2 } from "lucide-react";

export const ReviewCard = async ({ review }: { review: TProductReview }) => {
  const userRes = await getSingleUserFromDB(review?.user);

  return (
    <Card>
      <CardContent className="">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="md:flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">
                    {userRes?.data?.name || "Anonymous"}
                  </h4>

                  {review.isVerified && (
                    <div className="inline-flex items-center gap-1 text-xs px-2 py-[2px] bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Purchase
                    </div>
                  )}
                </div>

                <Rating rating={review.rating} />
              </div>

              <p className="text-sm text-muted-foreground">
                {formatTimeForHowLongAgo(review.createdAt)}
              </p>
            </div>

            {/* Review Text */}
            <p className="text-sm leading-relaxed">{review.review}</p>

            {/* Review Images */}
            {review?.images && review.images.length > 0 && (
              <div className="flex gap-2 pt-2">
                {review?.images.map((image, index) => (
                  <div key={index}>
                    <MyImage
                      src={image}
                      width={70}
                      height={70}
                      className="rounded-md object-cover bg-muted"
                      alt={`Review image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
