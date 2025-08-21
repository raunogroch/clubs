import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { userService } from "../../../services/userService";

/**
 * Hook para gestionar la lista de deportes y sus acciones (obtener, eliminar).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
export const useCoachClub = () => {
  const [coaches, setCoaches] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de deportes desde el servicio.
   */
  const fetchCoaches = async () => {
    try {
      const response = await userService.getAllCoaches();

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
