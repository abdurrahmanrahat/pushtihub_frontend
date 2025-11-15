import { getSingleProductFromDB } from "@/app/actions/product";
import { getSingleUserFromDB } from "@/app/actions/users";
import { Rating } from "@/components/common/Product/Rating";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { TProductReview } from "@/types";
import { formatTimeForHowLongAgo } from "@/utils/date";
import { Calendar, CheckCircle2, Eye } from "lucide-react";
import Link from "next/link";

const ReviewDetailsModal = async ({ review }: { review: TProductReview }) => {
  const userRes = await getSingleUserFromDB(review?.user);
  const productRes = await getSingleProductFromDB(review?.productSlug);

  return (
    <Dialog>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="!max-w-3xl max-h-[90vh] overflow-y-auto scroll-hidden"
        aria-describedby={undefined}
      >
        {/* Header */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl 2xl:text-2xl font-semibold">
              Review Details
            </h2>{" "}
            <span
              className={cn(
                "inline-flex items-center justify-center px-3 py-[3px] rounded-full text-xs 2xl:text-base font-semibold capitalize select-none transition-all duration-200",
                review.isVerified
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
              )}
            >
              {review.isVerified ? "Approved" : "Pending"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm 2xl:text-base text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <p>
              <span className="text-gray-800 dark:text-gray-100 font-medium">
                Posted on:
              </span>{" "}
              {formatTimeForHowLongAgo(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Reviewer Info */}
        <div className="space-y-2 mb-4">
          <p>
            <span className="font-semibold text-foreground">Reviewer:</span>{" "}
            {userRes?.data.name}
          </p>

          <div className="flex items-center gap-[2px]">
            <Rating rating={review.rating} />
          </div>

          {review.isVerified && (
            <div className="inline-flex items-center gap-1 text-xs 2xl:text-sm px-2 py-[2px] bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              Verified Purchase
            </div>
          )}
        </div>

        {/* Review Text */}
        <p className="text-sm 2xl:text-base leading-relaxed mb-4">
          {review.review}
        </p>

        {/* Review Images */}
        {review?.images && review?.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {review?.images.map((img, idx) => (
              <MyImage
                key={idx}
                src={img}
                alt="Review image"
                width={80}
                height={80}
                className="rounded-md object-cover border border-border"
              />
            ))}
          </div>
        )}

        {/* Product Info */}
        <div>
          <h3 className="md:text-lg font-semibold mb-2">Product Info:</h3>
          <div className="flex items-center gap-3">
            <Link href={`/shop/${productRes?.data.slug}`}>
              <MyImage
                src={productRes?.data.images[0]}
                alt={productRes?.data.name}
                width={70}
                height={70}
                className="rounded-md object-cover bg-muted"
              />
            </Link>

            <div>
              <Link href={`/shop/${productRes?.data.slug}`}>
                <p className="font-medium text-sm 2xl:text-base md:text-base">
                  {productRes?.data.name}
                </p>
              </Link>
              <p className="text-sm 2xl:text-base text-muted-foreground">
                ৳{productRes?.data.sellingPrice}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailsModal;
