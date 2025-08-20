import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { sportService } from "../../../services/sportService";

/**
 * Hook para gestionar la lista de deportes y sus acciones (obtener, eliminar).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
export const useSportClub = () => {
  const [sports, setSports] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de deportes desde el servicio.
   */
  const fetchSports = async () => {
    try {
      const response = await sportService.getAll();

      if (response.code === 200) {
        const { data } = response;
        setSports(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los deportes");
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return { sports, error };
};
