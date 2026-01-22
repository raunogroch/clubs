import api from "./api";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";

export const userService = {
  async getAssistants(limit = 200): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get("/users", {
        params: { role: "assistant", page: 1, limit },
      });
      // backend returns a paginated UsersResponse { data: User[] }
      const data = response.data?.data || response.data;
      return { code: response.status, message: "Assistants obtenidos", data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getAdmins(limit = 200): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get("/users", {
        params: { role: "admin", page: 1, limit },
      });
      // backend returns a paginated UsersResponse { data: User[] }
      const data = response.data?.data || response.data;
      return { code: response.status, message: "Admins obtenidos", data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getCoaches(limit = 200): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get("/users", {
        params: { role: "coach", page: 1, limit },
      });
      // backend returns a paginated UsersResponse { data: User[] }
      const data = response.data?.data || response.data;
      return { code: response.status, message: "Coaches obtenidos", data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getAthletes(limit = 200): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get("/users", {
        params: { role: "athlete", page: 1, limit },
      });
      // backend returns a paginated UsersResponse { data: User[] }
      const data = response.data?.data || response.data;
      return { code: response.status, message: "Athletes obtenidos", data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async findAthleteByCi(ci: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/users/search/by-ci/${ci}`);
      return {
        code: response.status,
        message: "Atleta encontrado",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async findUserByCiAndRole(
    ci: string,
    role: string,
  ): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/users/search/by-ci/${ci}`, {
        params: { role },
      });
      return {
        code: response.status,
        message: `${role} encontrado`,
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async createAthlete(athleteData: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post("/users", athleteData);
      return {
        code: response.status,
        message: "Atleta creado",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getUsersById(ids: string[]): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.post("/users/batch/by-ids", { ids });
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Usuarios obtenidos",
        data: Array.isArray(data) ? data : [],
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getCoachesFromGroups(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get("/users/coaches/from-groups");
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Coaches desde grupos obtenidos",
        data: Array.isArray(data) ? data : [],
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getAthletesFromGroups(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get("/users/athletes/from-groups");
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Atletas desde grupos obtenidos",
        data: Array.isArray(data) ? data : [],
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async uploadCoachImage(payload: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post("/users/upload-image", payload);
      return {
        code: response.status,
        message: "Imagen cargada exitosamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  async getUserById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/users/${id}`);
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Usuario obtenido",
        data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async fetchByRole(role: string, limit = 200): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get("/users", {
        params: { role, page: 1, limit },
      });
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: `Usuarios de rol ${role} obtenidos`,
        data: Array.isArray(data) ? data : [],
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Usuario actualizado",
        data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getMe(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get("/users/me");
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Perfil obtenido",
        data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<any>> {
    try {
      const response = await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return {
        code: response.status,
        message: "Contraseña actualizada",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async resetPassword(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/users/${userId}/reset-password`);
      return {
        code: response.status,
        message: response.data?.message || "Contraseña reseteada",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};

export default userService;
