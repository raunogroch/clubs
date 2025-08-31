import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks";
import { scheduleService, type IScheduleService } from "../../../services";

/**
 * Hook para gestionar la lista de horarios y sus acciones (obtener, eliminar).
 * Ahora depende de la interfaz IScheduleService para cumplir DIP e ISP.
 * @param service - Implementación de IScheduleService (por defecto scheduleService)
 */
export const useScheduleClub = (
  service: IScheduleService = scheduleService
) => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de usuarios desde el servicio.
   */
  const fetchSchedules = async () => {
    try {
      const response = await service.getAll();

      if (response.code === 200) {
        const { data } = response;
        setSchedules(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return { schedules, error };
};
