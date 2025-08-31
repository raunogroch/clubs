import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks";
import { userService, type IUserService } from "../../../services";

/**
 * Hook para gestionar el perfil del usuario autenticado.
 * Ahora depende de la interfaz IUserService para cumplir DIP e ISP.
 * @param service - Implementación de IUserService (por defecto userService)
 */
export const useProfile = (service: IUserService = userService) => {
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
      const response = await service.getById(JSON.parse(userExist).code);

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
