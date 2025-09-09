import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { userService, type IUserService } from "../../../services";

/**
 * Hook para gestionar la lista de coaches y sus acciones (obtener, eliminar).
 * Ahora depende de la interfaz IUserService para cumplir DIP e ISP.
 * @param service - Implementación de IUserService (por defecto userService)
 */
export const useCoachClub = (service: IUserService = userService) => {
  const [coaches, setCoaches] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de deportes desde el servicio.
   */
  const fetchCoaches = async () => {
    try {
      const response = await service.getAllCoaches();
      if (response.code === 200) {
        const { data } = response;
        setCoaches(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los deportes");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return { coaches, error };
};
