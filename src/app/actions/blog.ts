"use server";

import { tagLists } from "@/constants/tag";
import { TServerResponse } from "@/types/action.type";
import { revalidateTag } from "next/cache";
import { fetchWithAuth } from "./fetchWithAuth";

/* ============================================
   Get All Blogs : use here normal fetch, do not need auth token 
============================================ */
export const getAllBlogsFromDB = async (
  params?: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const queryParams = params
      ? "?" + new URLSearchParams(params).toString()
      : "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/blogs${queryParams}`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.BLOG] },
      }
    );

    if (!res.ok) {
      return { success: false, data: [], message: "Failed to fetch blogs" };
    }

    const data = await res.json();
    return {
      success: data?.success ?? true,
      data: data?.data || [],
      message: data?.message || "Blogs fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return { success: false, data: [], message: "Network or server error" };
  }
};

/* ============================================
   Get Single Blog: use normal fetch
============================================ */
export const getSingleBlogFromDB = async (
  blogSlug: string
): Promise<TServerResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/blogs/${blogSlug}`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.BLOG] },
      }
    );

    if (!res.ok) {
      return { success: false, data: null, message: "Failed to fetch blog" };
    }

    const data = await res.json();
    return {
      success: data?.success ?? true,
      data: data?.data || null,
      message: data?.message || "Blog fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching single blog:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
  Add Blog
============================================ */
export const addBlogToDB = async (
  blogData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/blogs/create-blog`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
        cache: "no-store",
      }
    );

    // if (!res.ok) {
    //   return { success: false, data: null, message: "Failed to create blog" };
    // }

    const data = await res.json();
    revalidateTag(tagLists.BLOG, "max");

    return {
      success: data?.success,
      data: data?.data || null,
      message: data?.message,
    };
  } catch (error: any) {
    console.error("Error adding blog:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
  Update Blog
============================================ */
export const updateBlogInDB = async (
  blogSlug: string,
  updatedData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/blogs/${blogSlug}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return { success: false, data: null, message: "Failed to update blog" };
    }

    const data = await res.json();
    revalidateTag(tagLists.BLOG, "max");

    return {
      success: data?.success ?? true,
      data: data?.data || null,
      message: data?.message || "Blog updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
  Delete Blog
============================================ */
export const deleteBlogFromDB = async (
  blogId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/blogs/${blogId}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return { success: false, data: null, message: "Failed to delete blog" };
    }

    const data = await res.json();
    revalidateTag(tagLists.BLOG, "max");

    return {
      success: data?.success ?? true,
      data: data?.data || null,
      message: data?.message || "Blog deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};
