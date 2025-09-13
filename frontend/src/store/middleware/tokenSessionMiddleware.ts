import type { Middleware } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { setMessage } from "../messageSlice";

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

export const tokenSessionMiddleware: Middleware =
  (store) => (next) => (action) => {
    const token = localStorage.getItem("token");
    if (token && !isTokenValid(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      store.dispatch(
        setMessage({ message: "Sesión finalizada", type: "warning" })
      );
      return;
    }
    return next(action);
  };
