import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { clubService } from "../../../services/clubService";

/**
 * Hook para gestionar la lista de usuarios y sus acciones (obtener, eliminar).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
export const useClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de usuarios desde el servicio.
   */
  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getClubs();

      if (response.code === 200) {
        const { data } = response;
        setClubs(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los clubs");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un usuario y actualiza la lista.
   * @param id - ID del usuario a eliminar.
   */
  const deleteClub = async (id: string): Promise<void> => {
    try {
      const response = await clubService.deleteClub(id);
      handleAuthError(response, setError);
      fetchClubs();
    } catch (err) {
      throw new Error("Error al eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return { clubs, loading, error, fetchClubs, deleteClub };
};
