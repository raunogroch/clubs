import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { userService } from "../../../services/userService";

/**
 * Hook para gestionar el perfil del usuario autenticado.
 * Obtiene los datos desde el servicio y maneja estados de carga y error.
 */
export const useProfile = () => {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene el perfil del usuario autenticado.
   */
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userExist = localStorage.getItem("user");

      const response = await userService.getById(JSON.parse(userExist).code);

      if (response.code === 200) {
        const { data } = response;
        setUser(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, fetchUser };
};
