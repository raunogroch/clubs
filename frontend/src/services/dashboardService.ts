import api from "./api";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";

export const dashboardService = {
  async getAdminStats(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get("/clubs/stats/admin-dashboard");
      return {
        code: response.status,
        message: "Estadísticas obtenidas",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};

export default dashboardService;
