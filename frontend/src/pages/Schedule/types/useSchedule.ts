import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import type { IScheduleService } from "../../../services/interfaces/scheduleService.interface";
import { scheduleService } from "../../../services/scheduleService";
import type { Schedule } from "../types/scheduleTypes";

/**
 * Hook para gestionar la lista de horarios y sus acciones (obtener, eliminar).
 * Ahora depende de la interfaz IScheduleService para cumplir DIP e ISP.
 * @param service - Implementación de IScheduleService (por defecto scheduleService)
 */
export const useSchedule = (service: IScheduleService = scheduleService) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de usuarios desde el servicio.
   */
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await service.getAll();

      if (response.code === 200) {
        const { data } = response;
        setSchedules(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un club y actualiza la lista.
   * @param id - ID del club a eliminar.
   */
  const deleteSchedule = async (id: string): Promise<void> => {
    try {
      const response = await service.delete(id);
      handleAuthError(response, setError);
      fetchSchedules();
    } catch (err) {
      throw new Error("Error al eliminar el horario");
    }
  };

  /**
   * Busca un club por su ID.
   * @param id - ID del club a buscar.
   * @returns Club encontrado o null.
   */
  const getScheduleById = async (id: string): Promise<Schedule | null> => {
    try {
      setLoading(true);
      const response = await service.getById(id);
      handleAuthError(response, setError);
      if (response.code === 200) {
        return response.data;
      }
      return null;
    } catch (err) {
      setError("Error al buscar el club");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    getScheduleById,
    deleteSchedule,
  };
};
