// set
export const setToLocalStorage = (key: string, token: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }

  localStorage.setItem(key, token);
};

export const setAccessTokenExpiryTimeToLocalStorage = (
  key: string,
  expiresIn: string
) => {
  const expiryTimestamp = Date.now() + Number(expiresIn) * 1000; // ms

  localStorage.setItem(key, expiryTimestamp.toString());
};

export const checkAccessTokenValidity = (
  accessTokenKey: string,
  accessTokenExpiryKey: string
) => {
  const accessToken = localStorage.getItem(accessTokenKey);
  const accessTokenExpiry = Number(localStorage.getItem(accessTokenExpiryKey));

  if (!accessToken || !accessTokenExpiry || Date.now() > accessTokenExpiry) {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(accessTokenExpiryKey);
  }
};

// get
export const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(key);
};

// remove
export const removeFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }

  return localStorage.removeItem(key);
};
