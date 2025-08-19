// Servicio para gestionar usuarios y sus operaciones CRUD
import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";

/**
 * Interfaz que representa un usuario en el sistema
 */
interface User {
  id?: string;
  name: string;
  lastname: string;
  role: string;
}
export const userService = {
  /**
   * Obtiene todos los usuarios del sistema.
   * @returns ApiResponse con la lista de usuarios.
   */
  async getAll(): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get("/users");
      return {
        code: response.status,
        message: "Usuarios obtenidos correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene un usuario por su ID.
   * @param id - ID del usuario a buscar.
   * @returns ApiResponse con el usuario encontrado.
   */
  async getById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.get(`/users/${id}`);
      return {
        code: response.status,
        message: "Usuario obtenido correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Crea un nuevo usuario en el sistema.
   * @param userData - Datos del usuario a crear.
   * @returns ApiResponse con el usuario creado.
   */
  async create(userData: Omit<User, "id">): Promise<ApiResponse<User>> {
    try {
      const response = await api.post("/users", userData);
      return {
        code: response.status,
        message: "Usuario creado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Actualiza los datos de un usuario existente.
   * @param id - ID del usuario a actualizar.
   * @param userData - Datos a actualizar.
   * @returns ApiResponse con el usuario actualizado.
   */
  async update(
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      const response = await api.patch(`/users/${id}`, userData);
      return {
        code: response.status,
        message: "Usuario actualizado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Elimina un usuario por su ID.
   * @param id - ID del usuario a eliminar.
   * @returns ApiResponse sin datos.
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/users/${id}`);
      return {
        code: response.status,
        message: "Usuario eliminado correctamente",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Cambia la contraseña de un usuario.
   * @param userId - ID del usuario.
   * @param currentPassword - Contraseña actual.
   * @param newPassword - Nueva contraseña.
   * @returns ApiResponse sin datos.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/users/${userId}/change-password`, {
        currentPassword,
        newPassword,
      });
      return {
        code: response.status,
        message: "Contraseña cambiada correctamente",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Verifica si un nombre de usuario está disponible.
   * @param username - Nombre de usuario a verificar.
   * @returns ApiResponse con la disponibilidad.
   */
  async checkUsernameAvailability(
    username: string
  ): Promise<ApiResponse<{ available: boolean }>> {
    try {
      const response = await api.get("/users/check-username", {
        params: { username },
      });
      return {
        code: response.status,
        message: "Disponibilidad verificada",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el perfil de un usuario por su ID.
   * @param id - ID del usuario.
   * @returns ApiResponse con el perfil del usuario.
   */
  async getProfile(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.get(`/users/${id}/profile`);
      return {
        code: response.status,
        message: "Usuario obtenido correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
