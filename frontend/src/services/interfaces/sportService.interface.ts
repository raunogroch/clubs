// Interfaz para el servicio de deportes
import type { Sport } from "../../pages/Sports/interfaces/sportTypes";
import type { ApiResponse } from "../../utils/apiUtils";

export interface ISportService {
  getAll(params?: {
    page?: number;
    limit?: number;
    name?: string;
  }): Promise<ApiResponse<Sport[]>>;
  create(sportData: Omit<Sport, "id">): Promise<ApiResponse<Sport>>;
  update(id: string, sportData: Partial<Sport>): Promise<ApiResponse<Sport>>;
  delete(id: string): Promise<ApiResponse<void>>;
  getById(id: string): Promise<ApiResponse<Sport>>;
}
