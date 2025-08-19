import type { Club } from "../interfaces/club";
import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";

export const clubService = {
  async getClubs(): Promise<ApiResponse<Club[]>> {
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
};

export const createClub = async (club: Club): Promise<void> => {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(club),
  });
};

export const updateClub = async (id: string, club: Club): Promise<void> => {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(club),
  });
};*/

  async deleteClub(id: string): Promise<ApiResponse<void>> {
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
};
