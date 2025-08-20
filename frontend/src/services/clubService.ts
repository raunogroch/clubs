import type { Club } from "../pages/Clubs/types/clubTypes";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";

export const clubService = {
  async getAll(): Promise<ApiResponse<Club[]>> {
    try {
      const response = await api.get("/clubs");
      return {
        code: response.status,
        message: "Clubs obtenidos correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /*export const getClub = async (id: string): Promise<Club | undefined> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return undefined;
  return await res.json();
};*/

  /**
   * Crea un nuevo club en el sistema.
   * @param clubData - Datos del club a crear.
   * @returns ApiResponse con el club creado.
   */
  async create(clubData: Omit<Club, "id">): Promise<ApiResponse<Club>> {
    try {
      const response = await api.post("/clubs", clubData);
      return {
        code: response.status,
        message: "Club creado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Actualiza los datos de un club existente.
   * @param id - ID del club a actualizar.
   * @param clubData - Datos a actualizar.
   * @returns ApiResponse con el club actualizado.
   */
  async update(
    id: string,
    clubData: Partial<Club>
  ): Promise<ApiResponse<Club>> {
    try {
      const response = await api.patch(`/clubs/${id}`, clubData);
      return {
        code: response.status,
        message: "Club actualizado correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Elimina un club por su ID.
   * @param id - ID del club a eliminar.
   * @returns ApiResponse sin datos.
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/clubs/${id}`);
      return {
        code: response.status,
        message: "Club eliminado correctamente",
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async getById(id: string): Promise<ApiResponse<Club>> {
    try {
      const response = await api.get(`/clubs/${id}`);
      return {
        code: response.status,
        message: "Club obtenido correctamente",
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
