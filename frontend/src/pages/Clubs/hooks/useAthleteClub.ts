import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { userService, type IUserService } from "../../../services";

/**
 * Hook para gestionar la lista de atletas y sus acciones (obtener, eliminar).
 * Ahora depende de la interfaz IUserService para cumplir DIP e ISP.
 * @param service - Implementación de IUserService (por defecto userService)
 */
export const useAthleteClub = (service: IUserService = userService) => {
  const [athletes, setAthletes] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de atletas desde el servicio.
   */
  const fetchAthletes = async () => {
    try {
      const response = await service.getAllAtheles();

      if (response.code === 200) {
        const { data } = response;
        setAthletes(data);
      }

      // Detecta expiración de token y cierra sesión automáticamente
      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los atletas");
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  return { athletes, error };
};
