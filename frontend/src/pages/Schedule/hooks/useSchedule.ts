import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { scheduleService } from "../../../services/scheduleService";

/**
 * Hook para gestionar la lista de usuarios y sus acciones (obtener, eliminar).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
export const useSchedule = () => {
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
      const response = await scheduleService.getAll();

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
   * Elimina un usuario y actualiza la lista.
   * @param id - ID del usuario a eliminar.
   */
  const deleteSchedule = async (id: string): Promise<void> => {
    try {
      const response = await scheduleService.delete(id);
      handleAuthError(response, setError);
      fetchSchedules();
    } catch (err) {
      throw new Error("Error al eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return { schedules, loading, error, fetchSchedules, deleteSchedule };
};
