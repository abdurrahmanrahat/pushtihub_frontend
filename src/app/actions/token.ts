"use server";

import {
  accessAuthKey,
  accessExpiry,
  refreshAuthKey,
  refreshExpiry,
} from "@/constants/authKey";
import { cookies } from "next/headers";

export const setTokensToCookies = async (
  accessToken: string,
  refreshToken: string
) => {
  const cookieStore = await cookies();

  cookieStore.set(accessAuthKey, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: accessExpiry,
  });
  cookieStore.set(refreshAuthKey, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: refreshExpiry,
  });
};

export const removeTokensFromCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(accessAuthKey);
  cookieStore.delete(refreshAuthKey);
};

export const setAccessTokenToCookies = async (accessToken: string) => {
  const cookieStore = await cookies();

  cookieStore.set(accessAuthKey, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: accessExpiry,
  });
};
