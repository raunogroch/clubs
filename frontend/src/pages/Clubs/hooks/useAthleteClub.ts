import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { userService } from "../../../services/userService";

/**
 * Hook para gestionar la lista de atletas y sus acciones (obtener, eliminar).
 * Maneja estados de carga y error, y redirige si la sesión expira.
 */
export const useAthleteClub = () => {
  const [athletes, setAthletes] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  /**
   * Obtiene la lista de atletas desde el servicio.
   */
  const fetchAthletes = async () => {
    try {
      const response = await userService.getAllAtheles();

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
