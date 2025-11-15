"use server";

import { tagLists } from "@/constants/tag";
import { TCategoryUploadData } from "@/types";
import { TServerResponse } from "@/types/action.type";
import { revalidateTag } from "next/cache";
import { fetchWithAuth } from "./fetchWithAuth";

/* ============================================
   Get All categories : use here normal fetch, do not need auth token 
============================================ */
export const getAllCategoriesFromDB = async (
  params?: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const queryParams = params
      ? "?" + new URLSearchParams(params).toString()
      : "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/categories${queryParams}`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.CATEGORY] },
      }
    );

    if (!res.ok) {
      return {
        success: false,
        data: [],
        message: "Failed to fetch categories",
      };
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
        message: data?.errorSources[0]?.message || data?.message,
      };
    }
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [], message: "Network or server error" };
  }
};

/* ============================================
  Add category
============================================ */
export const addCategoryToDB = async (
  categoryData: TCategoryUploadData
): Promise<TServerResponse> => {
  let newCategory = {};

  if (categoryData?.subCategoryOf) {
    newCategory = {
      name: categoryData.name,
      slug: categoryData.slug,
      subCategoryOf: categoryData.subCategoryOf,
    };
  }

  if (categoryData?.image) {
    newCategory = {
      name: categoryData.name,
      slug: categoryData.slug,
      image: categoryData.image,
    };
  }

  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/categories/create-category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
        cache: "no-store",
      }
    );

    // if (!res.ok) {
    //   return { success: false, data: null, message: "Failed to add category" };
    // }

    const data = await res.json();
    revalidateTag(tagLists.CATEGORY);

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
        message: data?.errorSources[0]?.message || data?.message,
      };
    }
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
  Update Category
============================================ */
export const updateCategoryInDB = async (
  categoryId: string,
  updatedData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/categories/${categoryId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        success: false,
        data: null,
        message: "Failed to update category",
      };
    }

    const data = await res.json();
    revalidateTag(tagLists.CATEGORY);

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
        message: data?.errorSources[0]?.message || data?.message,
      };
    }
  } catch (error: any) {
    console.error("Error updating category:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
  Delete Category
============================================ */
export const deleteCategoryFromDB = async (
  categoryId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/categories/${categoryId}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        success: false,
        data: null,
        message: "Failed to delete category",
      };
    }

    const data = await res.json();
    revalidateTag(tagLists.CATEGORY);

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
        message: data?.errorSources[0]?.message || data?.message,
      };
    }
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};
