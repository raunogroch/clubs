import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

/**
 * Hook para manejar errores de autenticación (expiración de token).
 * Si el código de error es 401, cierra sesión, muestra mensaje y redirige al login.
 * @returns handleAuthError - función para manejar el error.
 */
export const useAuthErrorHandler = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Maneja el error de autenticación y redirige si el token expira.
   * @param response - respuesta de la API.
   * @param setMessage - función para mostrar mensaje al usuario.
   */
  const handleAuthError = (
    response: { code: number; message?: string },
    setMessage?: (msg: string) => void
  ) => {
    if (response.code === 401) {
      if (setMessage) {
        setMessage(
          "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
        );
      } else {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
      }
      logout();
      navigate("/login");
    }
  };

  return handleAuthError;
};
