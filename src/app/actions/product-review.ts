"use server";

import { tagLists } from "@/constants/tag";
import { TServerResponse } from "@/types/action.type";
import { revalidateTag } from "next/cache";
import { fetchWithAuth } from "./fetchWithAuth";

/* ============================================
   Create Review  (Auth required)
============================================ */
export const createProductReviewToDB = async (
  productId: string,
  reviewData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productId}/reviews/create-review`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
        cache: "no-store",
      }
    );

    const data = await res.json();
    revalidateTag(tagLists.PRODUCT_REVIEW);

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data || [],
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: data?.data || null,
        message: data?.errorSources?.[0]?.message || data?.message,
      };
    }
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Get Reviews for a Product  (Public)
============================================ */
export const getProductReviewsFromDB = async (
  productId: string,
  params?: Record<string, any>
): Promise<TServerResponse> => {
  const queryParams = params
    ? "?" + new URLSearchParams(params).toString()
    : "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productId}/reviews${queryParams}`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.PRODUCT_REVIEW] },
      }
    );

    if (!res.ok) {
      return { success: false, data: [], message: "Failed to fetch reviews" };
    }

    const data = await res.json();

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data || [],
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: data?.data || null,
        message: data?.errorSources?.[0]?.message || data?.message,
      };
    }
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return { success: false, data: [], message: "Network or server error" };
  }
};
export const getProductReviewsStatsFromDB = async (
  productId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productId}/reviews/stats`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.PRODUCT_REVIEW] },
      }
    );

    if (!res.ok) {
      return { success: false, data: [], message: "Failed to fetch reviews" };
    }

    const data = await res.json();

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data || [],
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: data?.data || null,
        message: data?.errorSources?.[0]?.message || data?.message,
      };
    }
  } catch (error) {
    console.error("Error fetching product reviews stats:", error);
    return { success: false, data: [], message: "Network or server error" };
  }
};

/* ============================================
   Get All Reviews (Admin)
============================================ */
export const getAllReviewsFromDB = async (
  params?: Record<string, any>
): Promise<TServerResponse> => {
  const queryParams = params
    ? "?" + new URLSearchParams(params).toString()
    : "";

  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/reviews/all-reviews${queryParams}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data || [],
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: data?.data || null,
        message: data?.errorSources?.[0]?.message || data?.message,
      };
    }
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return { success: false, data: [], message: "Network or server error" };
  }
};

/* ============================================
   Delete Review (Admin)
============================================ */
export const deleteReviewFromDB = async (
  productId: string,
  reviewId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productId}/reviews/${reviewId}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    const data = await res.json();
    revalidateTag(tagLists.PRODUCT_REVIEW);

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data || [],
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: data?.data || null,
        message: data?.errorSources?.[0]?.message || data?.message,
      };
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Approve Review (Admin)
============================================ */
export const approveReviewInDB = async (
  productId: string,
  reviewId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productId}/reviews/${reviewId}/approved`,
      {
        method: "POST",
        cache: "no-store",
      }
    );

    const data = await res.json();
    revalidateTag(tagLists.PRODUCT_REVIEW);
    revalidateTag(tagLists.PRODUCT);

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data || [],
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: data?.data || null,
        message: data?.errorSources?.[0]?.message || data?.message,
      };
    }
  } catch (error) {
    console.error("Error approving review:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};
