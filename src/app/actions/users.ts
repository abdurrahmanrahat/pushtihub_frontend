"use server";

import { tagLists } from "@/constants/tag";
import { TServerResponse } from "@/types/action.type";
import { fetchWithAuth } from "./fetchWithAuth";

export const getMeFromDB = async () => {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKED_URL}/users/current/me`
  );

  if (!res.ok) {
    // User not logged in or forbidden
    return null;
  }

  return res.json();
};

/* ============================================
   Get Single User
============================================ */
export const getSingleUserFromDB = async (
  userId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/users/${userId}`,
      {
        cache: "force-cache",
        next: { tags: [tagLists.USER] },
      }
    );

    if (!res.ok) {
      return { success: false, data: null, message: "Failed to fetch user" };
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
    console.error("Error fetching single user:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};
