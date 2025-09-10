import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMessage, type AppDispatch } from "../store";
import { logoutThunk } from "../store/authThunk";

/**
 * Hook para manejar errores de autenticación (expiración de token).
 * Si el código de error es 401, cierra sesión, muestra mensaje y redirige al login.
 * @returns handleAuthError - función para manejar el error.
 */
export const useAuthErrorHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  /**
   * Maneja el error de autenticación y redirige si el token expira.
   * @param response - respuesta de la API.
   */
  const handleAuthError = (response: { code: number; message?: string }) => {
    if (response.code === 401) {
      dispatch(
        setMessage({
          message: "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
          type: "danger",
        })
      );
      dispatch(logoutThunk());
      navigate("/login");
    }
  };

  return handleAuthError;
};
