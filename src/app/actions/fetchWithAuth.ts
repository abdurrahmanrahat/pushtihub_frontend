"use server";

import { accessAuthKey } from "@/constants/authKey";
import { cookies } from "next/headers";

export async function fetchWithAuth(
  url: string,
  requestOptions: RequestInit = {}
) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(accessAuthKey)?.value;
  // const refreshToken = cookieStore.get(refreshAuthKey)?.value;

  const doFetch = async (token?: string) => {
    const headers = {
      ...(requestOptions?.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(url, {
      ...requestOptions,
      headers,
    });
  };

  const response = await doFetch(accessToken);

  // // 🔄 Handle 401 → refresh token flow
  // if (response?.status === 401 && refreshToken) {
  //   console.log("401 got...");
  //   const refreshResponse = await fetch(
  //     `${process.env.NEXT_PUBLIC_BACKED_URL}/auth/refresh-token`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ refreshToken }),
  //     }
  //   );

  //   if (refreshResponse.ok) {
  //     const refreshResResult = await refreshResponse.json();
  //     console.log("refreshResResult", refreshResResult);
  //     if (refreshResResult?.success) {
  //       const newAccessToken = refreshResResult.data.accessToken;

  //       await setTokensToCookies(newAccessToken, refreshToken);

  //       response = await doFetch(newAccessToken); // retry original request
  //     } else {
  //       throw new Error(refreshResResult?.message || "Something went wrong!");
  //     }
  //   } else {
  //     throw new Error("Unauthorized – refresh failed");
  //   }
  // }

  // // 🚫 Handle forbidden (403)
  // if (response?.status === 403) {
  //   throw new Error(
  //     "Forbidden – you don’t have permission to access this resource."
  //   );
  // }

  return response;
}

// TODO: refresh token mechanism, just need to store the new token in cookie and local storage
