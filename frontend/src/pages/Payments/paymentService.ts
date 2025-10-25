import api from "../../services/api";
import { handleApiError, type ApiResponse } from "../../utils/apiUtils";

export interface CreatePaymentDto {
  athleteId: string;
  clubId: string;
  amount?: number;
  note?: string;
  month?: string;
}

export const paymentService = {
  async create(data: CreatePaymentDto): Promise<ApiResponse<any>> {
    try {
      const res = await api.post("/payments", data);
      return { code: res.status, message: "Pago registrado", data: res.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  async getPaidMonths(
    athleteId: string,
    clubId: string,
    months: string[]
  ): Promise<ApiResponse<any>> {
    try {
      const res = await api.get("/payments/status", {
        params: { athleteId, clubId, months: months.join(",") },
      });
      return { code: res.status, message: "Ok", data: res.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
