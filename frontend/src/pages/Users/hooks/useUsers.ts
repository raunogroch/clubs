import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { userService } from "../../../services/userService";
import type { IUserService } from "../../../services/interfaces/userService.interface";

/**
 * Hook para gestionar la lista de usuarios y sus acciones (obtener, eliminar).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
/**
 * Hook para gestionar la lista de usuarios y sus acciones (obtener, eliminar).
 * Ahora depende de la interfaz IUserService para cumplir DIP e ISP.
 * @param service - Implementación de IUserService (por defecto userService)
 */
export const useUsers = (service: IUserService = userService) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de usuarios desde el servicio.
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await service.getAll();

      if (response.code === 200) {
        const { data } = response;
        setUsers(data);
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
  const deleteUser = async (id: string): Promise<void> => {
    try {
      const response = await service.delete(id);
      handleAuthError(response, setError);
      fetchUsers();
    } catch (err) {
      throw new Error("Error al eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers, deleteUser };
};
