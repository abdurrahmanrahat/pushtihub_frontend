"use server";

import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKED_URL}/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    }
  );
  const userInfo = await res.json();
  return userInfo;
};
