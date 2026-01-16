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
};

export default userService;
