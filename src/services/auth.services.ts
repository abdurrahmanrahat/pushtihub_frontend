import {
  accessAuthExpiryKey,
  accessAuthKey,
  accessExpiry,
} from "@/constants/authKey";
import { decodedToken } from "@/utils/jwt";
import {
  checkAccessTokenValidity,
  getFromLocalStorage,
  removeFromLocalStorage,
  setAccessTokenExpiryTimeToLocalStorage,
  setToLocalStorage,
} from "@/utils/local-storage";

// store user info into local storage
export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  if (accessToken) {
    setAccessTokenExpiryTimeToLocalStorage(
      accessAuthExpiryKey,
      String(accessExpiry)
    );
  }

  return setToLocalStorage(accessAuthKey, accessToken);
};

// get user info from local storage
export const getUserInfo = () => {
  // check user token expiry, if not then automatically remove.
  checkAccessTokenValidity(accessAuthKey, accessAuthExpiryKey);

  const authToken = getFromLocalStorage(accessAuthKey);

  if (authToken) {
    const decodedData = decodedToken(authToken);
    return decodedData;
  }
};

// remove user
export const removeUser = () => {
  return removeFromLocalStorage(accessAuthKey);
};
