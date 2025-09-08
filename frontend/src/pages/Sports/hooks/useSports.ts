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
export interface SportsPaginated {
  data: Sport[];
  total: number;
  page: number;
  limit: number;
}

export const useSports = (service: ISportService = sportService) => {
  const [sports, setSports] = useState<SportsPaginated>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de Sports desde el servicio.
   */
  const fetchSports = async (
    customPage = page,
    customLimit = limit,
    filterName = name
  ) => {
    try {
      setLoading(true);
      const response = await service.getAll({
        page: customPage,
        limit: customLimit,
        name: filterName,
      });
      if (response.code === 200) {
        if (
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data &&
          "total" in response.data &&
          "page" in response.data &&
          "limit" in response.data
        ) {
          setSports(response.data as SportsPaginated);
        } else {
          setSports({
            data: response.data as Sport[],
            total: (response.data as Sport[]).length,
            page: 1,
            limit: customLimit,
          });
        }
      }
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar las disciplinas");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para recargar cuando cambian page, limit o name
  useEffect(() => {
    fetchSports(page, limit, name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, name]);

  const handleNameChange = (value: string) => {
    setName(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
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

  return {
    sports,
    loading,
    error,
    deleteSport,
    getSportById,
    name,
    handleNameChange,
    page,
    handlePageChange,
    limit,
    handleLimitChange,
  };
};
