import { accessAuthKey } from "@/constants/authKey";
import { cookies } from "next/headers";

export const getUserFromCookies = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get(accessAuthKey)?.value;

  return token;
};
