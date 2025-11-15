"use server";

import { tagLists } from "@/constants/tag";
import { TServerResponse } from "@/types/action.type";
import { revalidateTag } from "next/cache";
import { fetchWithAuth } from "./fetchWithAuth";

/* ============================================
   Get All Orders (Admin Only)
============================================ */
export const getAllOrdersFromDB = async (
  params?: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const queryParams = params
      ? "?" + new URLSearchParams(params).toString()
      : "";

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/orders${queryParams}`,
      {
        cache: "no-store",
      }
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
        data: null,
        message: data?.message || "Failed to fetch orders",
      };
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Get Single Order (Public - For Tracking)
============================================ */
export const getSingleOrderFromDB = async (
  orderId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/orders/${orderId}`,
      { cache: "no-store" }
    );

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
        data: null,
        message: data?.message || "Order not found",
      };
    }
  } catch (error) {
    console.error("Error fetching single order:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Create Order (Public - Checkout)
============================================ */
export const createOrderInDB = async (
  orderData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/orders/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        cache: "no-store",
      }
    );

    const data = await res.json();
    revalidateTag(tagLists.ORDER);

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data,
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: null,
        message: data?.message || "Order creation failed",
      };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Update Order (Admin Only)
============================================ */
export const updateOrderInDB = async (
  orderId: string,
  updatedData: Record<string, any>
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/orders/${orderId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
        cache: "no-store",
      }
    );

    const data = await res.json();
    revalidateTag(tagLists.ORDER);

    if (data?.success) {
      return {
        success: data?.success ?? true,
        data: data?.data,
        message: data?.message,
      };
    } else {
      return {
        success: data?.success ?? false,
        data: null,
        message: data?.message || "Order update failed",
      };
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};

/* ============================================
   Delete Order (Admin Only)
============================================ */
export const deleteOrderFromDB = async (
  orderId: string
): Promise<TServerResponse> => {
  try {
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKED_URL}/orders/${orderId}`,
      { method: "DELETE", cache: "no-store" }
    );

    const data = await res.json();
    revalidateTag(tagLists.ORDER);

    if (data?.success) {
      return {
        success: true,
        data: data?.data,
        message: data?.message,
      };
    }

    return {
      success: false,
      data: null,
      message: data?.message || "Order delete failed",
    };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, data: null, message: "Network or server error" };
  }
};
