"use client";

import { createProductReviewToDB } from "@/app/actions/product-review";
import MYForm from "@/components/shared/Forms/MYForm";
import MYRating from "@/components/shared/Forms/MYRating";
import MYTextArea from "@/components/shared/Forms/MYTextArea";
import MyImage from "@/components/shared/Ui/Image/MyImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUp, Loader } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type TReviewFormProps = {
  productId: string;
  productSlug: string;
  userId: string;
};

const reviewSchema = z.object({
  rating: z
    .number({ required_error: "Rating is required" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  review: z.string().min(1, "Review content is required"),
});

const reviewDefaultValues = {
  rating: 0,
  review: "",
};

const img_hosting_token = process.env.NEXT_PUBLIC_imgBB_token;
const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

export const ReviewForm = ({
  productId,
  productSlug,
  userId,
}: TReviewFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Mock: Check if user is logged in
  const isLoggedIn = userId ? true : false; // Change to true to see the form

  const handleSubmitReview = async (values: FieldValues) => {
    setIsLoading(true);

    const reviewData = {
      user: userId,
      product: productId,
      productSlug,
      rating: values?.rating,
      review: values?.review,
      ...(images && { images }),
    };

    // send to db
    try {
      const res = await createProductReviewToDB(productId, reviewData);

      if (res?.success) {
        toast.success("Review has been given successfully!");

        setImages([]);
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  /* --------------------------------------------
       Handle Image Upload
    --------------------------------------------- */
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    if (images.length + files.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    setIsImageUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (file.size > 1 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 1MB limit.`);
          return null;
        }

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(img_hosting_url, {
          method: "POST",
          body: formData,
        });
        const imageRes = await res.json();

        if (imageRes.success) return imageRes.data.display_url;
        return null;
      });

      const uploaded = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as string[];

      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded successfully!`);
    } catch (error: any) {
      toast.error(error?.message || "Image upload failed.");
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="xl:text-lg 2xl:text-xl">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoggedIn ? (
          <div className="text-center py-8 md:py-20">
            <p className="text-muted-foreground mb-4">
              You must be logged in to write a review
            </p>
            <Link href="/login">
              <Button>Login to Review</Button>
            </Link>
          </div>
        ) : (
          <MYForm
            onSubmit={handleSubmitReview}
            schema={reviewSchema}
            defaultValues={reviewDefaultValues}
          >
            <div className="flex flex-col gap-4">
              {/* Rating */}
              <div className="grid gap-[6px]">
                <label htmlFor="rating" className="text-sm font-medium">
                  Rating <span className="text-destructive font-medium">*</span>
                </label>

                <MYRating name="rating" />
              </div>

              {/* Review text */}
              <div className="grid gap-[6px]">
                <label htmlFor="review" className="text-sm font-medium">
                  Your review{" "}
                  <span className="text-destructive font-medium">*</span>
                </label>

                <MYTextArea
                  name="review"
                  placeholder="Enter your thoughts about  the product..."
                />
              </div>

              {/* image */}
              <div className="grid gap-[6px]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Images
                </label>

                <div>
                  <input
                    type="file"
                    id="product-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {images.length === 0 ? (
                    <label
                      htmlFor="product-images"
                      className="flex flex-col items-center justify-center py-6 px-3 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary transition-all cursor-pointer bg-light-gray dark:bg-deep-dark"
                    >
                      <ImageUp
                        className={`h-8 w-8 mb-2 ${
                          isImageUploading
                            ? "text-primary animate-pulse"
                            : "text-gray-400"
                        }`}
                      />
                      <p className="text-sm">
                        {isImageUploading
                          ? "Uploading..."
                          : "Click to upload images"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        PNG, JPG up to 1MB each — max 3 images
                      </p>
                    </label>
                  ) : (
                    <div className="flex flex-wrap gap-3 bg-light-gray dark:bg-deep-dark py-6 px-3 rounded-md border border-gray-200 dark:border-gray-700">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 group"
                        >
                          <MyImage
                            src={img}
                            alt={`product-${index}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setImages(images.filter((_, i) => i !== index))
                            }
                            className="absolute top-1 right-1 text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {images.length < 3 && (
                        <label
                          htmlFor="product-images"
                          className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-primary transition-all"
                        >
                          <ImageUp className="h-6 w-6 text-gray-400" />
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {images.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {images.length}/3 images uploaded
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || isImageUploading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />{" "}
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </MYForm>
        )}
      </CardContent>
    </Card>
  );
};
