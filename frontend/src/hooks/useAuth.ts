/**
 * Hook personalizado useAuth
 * 
 * Propósito: Obtener información de autenticación del estado global
 * 
 * Proporciona:
 * - user: Objeto con los datos del usuario autenticado
 * - token: Token JWT del usuario
 * - isAuthenticated: Boolean que indica si el usuario está logueado
 * - status: Estado de la petición de login (pending, fulfilled, rejected)
 * - error: Mensaje de error si algo falló
 * - role: Rol del usuario (ADMIN, USER, etc)
 * 
 * Uso en un componente:
 * const { user, isAuthenticated, role } = useAuth();
 * if (role === 'ADMIN') { ... }
 */

import { useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * Hook que retorna la información de autenticación del usuario actual
 * @returns Objeto con información del usuario y token
 */
export const useAuth = () => {
  // Obtener el estado de autenticación desde Redux
  const auth = useSelector((state: RootState) => state.auth);

  return {
    user: auth.user,                          // Datos del usuario (id, nombre, rol, etc)
    token: auth.token,                        // Token JWT para hacer peticiones autorizadas
    isAuthenticated: auth.isAuthenticated,    // true si el usuario está logueado
    status: auth.status,                      // Estado de la petición ('pending', 'fulfilled', 'rejected')
    error: auth.error,                        // Mensaje de error si falló el login
    role: auth.user?.role,                    // Rol del usuario (ADMIN, COACH, ATHLETE, etc)
    userRole: auth.user?.role,                // Alias del rol para compatibilidad con código antiguo
  };
};
