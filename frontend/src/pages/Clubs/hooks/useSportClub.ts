import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks";
import { sportService, type ISportService } from "../../../services";

/**
 * Hook para gestionar la lista de deportes y sus acciones (obtener, eliminar).
 * Ahora depende de la interfaz ISportService para cumplir DIP e ISP.
 * @param service - Implementación de ISportService (por defecto sportService)
 */
export const useSportClub = (service: ISportService = sportService) => {
  const [sports, setSports] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de deportes desde el servicio.
   */
  const fetchSports = async () => {
    try {
      const response = await service.getAll();
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
