import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import type { Sport } from "../interfaces/sportTypes";
import type { ISportService } from "../../../services/interfaces/sportService.interface";
import { sportService } from "../../../services/sportService";

/**
 * Hook para gestionar la lista de Sports y sus acciones (obtener, eliminar, buscar por id).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
/**
 * Hook para gestionar la lista de Sports y sus acciones (obtener, eliminar, buscar por id).
 * Ahora depende de la interfaz ISportService para cumplir DIP e ISP.
 * @param service - Implementación de ISportService (por defecto sportService)
 */
export const useSports = (service: ISportService = sportService) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de Sports desde el servicio.
   */
  const fetchSports = async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      if (response.code === 200) {
        setSports(response.data);
      }
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar las disciplinas");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un Sport y actualiza la lista.
   * @param id - ID del Sport a eliminar.
   */
  const deleteSport = async (id: string): Promise<void> => {
    try {
      const response = await service.delete(id);
      handleAuthError(response, setError);
      fetchSports();
    } catch (err) {
      throw new Error("Error al eliminar la disciplina");
    }
  };

  /**
   * Busca un Sport por su ID.
   * @param id - ID del Sport a buscar.
   * @returns Sport encontrado o null.
   */
  const getSportById = async (id: string): Promise<Sport | null> => {
    try {
      setLoading(true);
      const response = await service.getById(id);
      handleAuthError(response, setError);
      if (response.code === 200) {
        return response.data;
      }
      return null;
    } catch (err) {
      setError("Error al buscar la disciplina");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return { sports, loading, error, fetchSports, deleteSport, getSportById };
};
