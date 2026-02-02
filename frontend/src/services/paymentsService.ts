import api from "./api";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";

export const paymentsService = {
  async create(payload: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/payments`, payload);
      const data = response.data?.data || response.data;
      return { code: response.status, message: "Payment creado", data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getByAthlete(athleteId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(`/payments/athlete/${athleteId}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      return { code: response.status, message: "Payments obtenidos", data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};

export default paymentsService;
