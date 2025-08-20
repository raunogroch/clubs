import type { Deporte } from "../pages/sports/types/DeporteTypes";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";

export const sportService = {
  async getAll(): Promise<ApiResponse<Sport[]>> {
    try {
      const response = await api.get("/sports");
      return {
        code: response.status,
        message: "Deporte obtenidos correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Crea un nuevo Deporte en el sistema.
   * @param sportData - Datos del Deporte a crear.
   * @returns ApiResponse con el Deporte creado.
   */
  async create(sportData: Omit<Sport, "id">): Promise<ApiResponse<Sport>> {
    try {
      const response = await api.post("/sports", sportData);
      return {
        code: response.status,
        message: "Deporte creado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Actualiza los datos de un Deporte existente.
   * @param id - ID del Deporte a actualizar.
   * @param sportData - Datos a actualizar.
   * @returns ApiResponse con el Deporte actualizado.
   */
  async update(
    id: string,
    sportData: Partial<Sport>
  ): Promise<ApiResponse<Sport>> {
    try {
      const response = await api.patch(`/sports/${id}`, sportData);
      return {
        code: response.status,
        message: "Deporte actualizado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Elimina un Deporte por su ID.
   * @param id - ID del Deporte a eliminar.
   * @returns ApiResponse sin datos.
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/sports/${id}`);
      return {
        code: response.status,
        message: "Deporte eliminado correctamente",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getById(id: string): Promise<ApiResponse<Sport>> {
    try {
      const response = await api.get(`/sports/${id}`);
      return {
        code: response.status,
        message: "Deporte obtenido correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
