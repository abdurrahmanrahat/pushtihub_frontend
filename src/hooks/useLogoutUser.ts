import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/reducers/authSlice";
import { removeUser } from "@/services/auth.services";

export const useLogoutUser = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    removeUser(); // clear localStorage
  };

  return handleLogout;
};
