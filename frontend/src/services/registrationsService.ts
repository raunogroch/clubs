import api from "./api";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";

export const registrationsService = {
  /**
   * Obtener registrations sin pagar (registration_pay = false) por assignment_id
   */
  async getUnpaidByAssignment(
    assignmentId: string,
  ): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(
        `/registrations/assignment/${assignmentId}`,
        {
          params: { registration_pay: "false" },
        },
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      return {
        code: response.status,
        message: "Registrations sin pagar obtenidas",
        data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener todas las registrations por assignment_id
   */
  async getByAssignment(assignmentId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(
        `/registrations/assignment/${assignmentId}`,
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      return {
        code: response.status,
        message: "Registrations obtenidas",
        data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Obtener una registration por ID
   */
  async getById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/registrations/${id}`);
      const data = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Registration obtenida",
        data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Actualizar una registration
   */
  async update(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.patch(`/registrations/${id}`, data);
      const resData = response.data?.data || response.data;
      return {
        code: response.status,
        message: "Registration actualizada",
        data: resData,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};

export default registrationsService;
