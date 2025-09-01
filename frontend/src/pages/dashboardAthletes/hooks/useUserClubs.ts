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
export const useUserClubs = (service: IUserService = userService) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de usuarios desde el servicio.
   */
  const fetchUserClubs = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("user"));
      if (!userInfo) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }
      const response = await service.getUserClubs(userInfo.code);

      if (response.code === 200) {
        const { data } = response;
        setClubs(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los clubes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserClubs();
  }, []);

  return { clubs, loading, error, fetchUserClubs };
};
