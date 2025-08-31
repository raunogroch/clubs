import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { clubService, type IClubService } from "../../../services";
import type { Club } from "../interfaces/clubTypes";

/**
 * Hook para gestionar la lista de clubs y sus acciones (obtener, eliminar, buscar por id).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
/**
 * Hook para gestionar la lista de clubs y sus acciones (obtener, eliminar, buscar por id).
 * Ahora depende de la interfaz IClubService para cumplir DIP e ISP.
 * @param service - Implementación de IClubService (por defecto clubService)
 */
export const useClubs = (service: IClubService = clubService) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de clubs desde el servicio.
   */
  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await service.getAll();
      if (response.code === 200) {
        setClubs(response.data);
      }
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los clubs");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un club y actualiza la lista.
   * @param id - ID del club a eliminar.
   */
  const deleteClub = async (id: string): Promise<void> => {
    try {
      const response = await service.delete(id);
      handleAuthError(response, setError);
      fetchClubs();
    } catch (err) {
      throw new Error("Error al eliminar el club");
    }
  };

  /**
   * Busca un club por su ID.
   * @param id - ID del club a buscar.
   * @returns Club encontrado o null.
   */
  const getClubById = async (id: string): Promise<Club | null> => {
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
    fetchClubs();
  }, []);

  return { clubs, loading, error, fetchClubs, deleteClub, getClubById };
};
