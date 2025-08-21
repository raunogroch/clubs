import type { Schedule } from "../pages/Schedule/types/scheduleTypes";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";

export const scheduleService = {
  async getAll(): Promise<ApiResponse<Schedule[]>> {
    try {
      const response = await api.get("/schedules");
      return {
        code: response.status,
        message: "Schedule obtenidos correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Crea un nuevo Schedule en el sistema.
   * @param scheduleData - Datos del Schedule a crear.
   * @returns ApiResponse con el Schedule creado.
   */
  async create(
    scheduleData: Omit<Schedule, "id">
  ): Promise<ApiResponse<Schedule>> {
    try {
      const response = await api.post("/schedules", scheduleData);
      return {
        code: response.status,
        message: "Schedule creado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Actualiza los datos de un Schedule existente.
   * @param id - ID del Schedule a actualizar.
   * @param scheduleData - Datos a actualizar.
   * @returns ApiResponse con el Schedule actualizado.
   */
  async update(
    id: string,
    scheduleData: Partial<Schedule>
  ): Promise<ApiResponse<Schedule>> {
    try {
      const response = await api.patch(`/schedules/${id}`, scheduleData);
      return {
        code: response.status,
        message: "Schedule actualizado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Elimina un Schedule por su ID.
   * @param id - ID del Schedule a eliminar.
   * @returns ApiResponse sin datos.
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/schedules/${id}`);
      return {
        code: response.status,
        message: "Schedule eliminado correctamente",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getById(id: string): Promise<ApiResponse<Schedule>> {
    try {
      const response = await api.get(`/schedules/${id}`);
      return {
        code: response.status,
        message: "Schedule obtenido correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
