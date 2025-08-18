import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";

interface User {
  id?: string;
  name: string;
  lastname: string;
  role: string;
}

export const userService = {
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
};
