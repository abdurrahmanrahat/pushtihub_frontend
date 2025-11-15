"use server";

import { tagLists } from "@/constants/tag";
import { TServerResponse } from "@/types/action.type";
import { revalidateTag } from "next/cache";
import { fetchWithAuth } from "./fetchWithAuth";

/* ============================================
   Get All Products : use here normal fetch, no auth required
============================================ */
export const getAllProductsFromDB = async (
  params?: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const queryParams = params
      ? "?" + new URLSearchParams(params).toString()
      : "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products${queryParams}`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.PRODUCT] },
      }
    );

    if (!res.ok) {
      return { success: false, data: [], message: "Failed to fetch products" };
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
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { success: false, data: [], message: "Network or server error" };
  }
};

/* ============================================
   Get Single Product
============================================ */
export const getSingleProductFromDB = async (
  productSlug: string
): Promise<TServerResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productSlug}`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.PRODUCT] },
      }
    );

    if (!res.ok) {
      return { success: false, data: null, message: "Failed to fetch product" };
    }

    const data = await res.json();

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data || {},
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: data?.data || null,
        message: data?.errorSources?.[0]?.message || data?.message,
      };
    }
  } catch (error: any) {
    console.error("Error fetching single product:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Add Product
============================================ */
export const addProductToDB = async (
  productData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/create-product`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
        cache: "no-store",
      }
    );

    const data = await res.json();
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
    console.error("Error adding product:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Update Product
============================================ */
export const updateProductInDB = async (
  productId: string,
  updatedData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        success: false,
        data: null,
        message: "Failed to update product",
      };
    }

    const data = await res.json();
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
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Delete Product
============================================ */
export const deleteProductFromDB = async (
  productId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/products/${productId}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        success: false,
        data: null,
        message: "Failed to delete product",
      };
    }

    const data = await res.json();
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
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};
