import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    status: auth.status,
    error: auth.error,
    role: auth.user?.role,
    userRole: auth.user?.role, // Alias para compatibilidad
  };
};
