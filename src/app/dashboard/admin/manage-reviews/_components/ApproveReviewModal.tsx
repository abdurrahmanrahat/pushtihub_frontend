"use client";

import { approveReviewInDB } from "@/app/actions/product-review";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TProductReview } from "@/types";
import { Loader, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ApproveReviewModal({
  review,
  productId,
}: {
  review: TProductReview;
  productId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);

    try {
      const res = await approveReviewInDB(productId, review._id);

      if (res?.success) {
        toast.success("Review approved successfully!");
      } else {
        toast.error(res?.message || "Failed to approve review");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-green-600 hover:bg-green-500/10 dark:hover:bg-green-500/20"
        >
          <ShieldCheck className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[420px] border border-gray-200 dark:border-gray-800 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Approve Review
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Approving this review will mark it as Verified Purchase and show it
            publicly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleApprove}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" /> Approving...
                </span>
              ) : (
                "Approve"
              )}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
