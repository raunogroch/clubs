const AUTH_TOKEN_KEY = "UUID";

export const setToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getTokenPayload = (): any | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export const isTokenExpired = (): boolean => {
  const payload = getTokenPayload();
  if (!payload || !payload.exp) return true;

  const expirationTime = payload.exp * 1000;
  return Date.now() > expirationTime;
};
