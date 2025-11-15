import { TResponseUser } from "@/types";
import { jwtDecode } from "jwt-decode";

export const decodedToken = (token: string): TResponseUser | null => {
  try {
    return jwtDecode<TResponseUser>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
