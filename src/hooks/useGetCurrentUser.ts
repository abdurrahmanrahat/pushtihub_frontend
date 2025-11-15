import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/reducers/authSlice";
import { getUserInfo } from "@/services/auth.services";

export const useGetCurrentUser = () => {
  const user = useAppSelector(useCurrentUser);
  const isUserExits = getUserInfo();

  return isUserExits ? user : null;
};
