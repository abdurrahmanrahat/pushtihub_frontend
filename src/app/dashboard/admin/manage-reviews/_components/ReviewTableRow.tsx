import { getSingleProductFromDB } from "@/app/actions/product";
import { getSingleUserFromDB } from "@/app/actions/users";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TProductReview } from "@/types";
import ApproveReviewModal from "./ApproveReviewModal";
import DeleteReviewModal from "./DeleteReviewModal";
import ReviewDetailsModal from "./ReviewDetailsModal";

const ReviewTableRow = async ({ review }: { review: TProductReview }) => {
  const userRes = await getSingleUserFromDB(review?.user);
  const productRes = await getSingleProductFromDB(review?.productSlug);

  return (
    <tr className="group border-b border-gray-200 dark:border-gray-700 hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">{userRes?.data?.name}</TableCell>
      <TableCell>{userRes?.data?.email}</TableCell>
      <TableCell>{review?.rating}</TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center justify-center px-3 py-[3px] rounded-full text-xs 2xl:text-sm font-semibold capitalize select-none transition-all duration-200",
            review.isVerified
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
          )}
        >
          {review.isVerified ? "Approved" : "Pending"}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <ReviewDetailsModal review={review} />

          {!review?.isVerified && (
            <ApproveReviewModal
              review={review}
              productId={productRes?.data?._id}
            />
          )}

          <DeleteReviewModal
            review={review}
            productId={productRes?.data?._id}
          />
        </div>
      </TableCell>
    </tr>
  );
};

export default ReviewTableRow;
