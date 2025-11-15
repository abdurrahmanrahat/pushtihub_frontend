"use server";

import { FieldValues } from "react-hook-form";
import { setTokensToCookies } from "./token";

export const loginUser = async (userData: FieldValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKED_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include",
    body: JSON.stringify(userData),
    cache: "no-store",
  });
  const userInfo = await res.json();

  if (userInfo?.success) {
    const accessToken = userInfo.data.accessToken;
    const refreshToken = userInfo.data.refreshToken;

    await setTokensToCookies(accessToken, refreshToken);
  }

  return userInfo;
};
