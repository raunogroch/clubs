// Interfaz para el servicio de clubes
import type { Club } from "../../pages/Clubs/interfaces/clubTypes";
import type { ApiResponse } from "../../utils/apiUtils";

export interface IClubService {
  getAll(): Promise<ApiResponse<Club[]>>;
  create(clubData: Omit<Club, "id">): Promise<ApiResponse<Club>>;
  update(id: string, clubData: Partial<Club>): Promise<ApiResponse<Club>>;
  delete(id: string): Promise<ApiResponse<void>>;
  getById(id: string): Promise<ApiResponse<Club>>;
}
