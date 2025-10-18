// Interfaz para el servicio de usuarios
import type { User } from "../../interfaces";
import type { ApiResponse } from "../../utils/apiUtils";

export interface IUserService {
  getAll(): Promise<ApiResponse<User[]>>;
  getById(id: string): Promise<ApiResponse<User>>;
  create(userData: Omit<User, "id">): Promise<ApiResponse<User>>;
  update(id: string, userData: Partial<User>): Promise<ApiResponse<User>>;
  delete(id: string): Promise<ApiResponse<void>>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>>;
  checkUsernameAvailability(
    username: string
  ): Promise<ApiResponse<{ available: boolean }>>;
  getProfile(id: string): Promise<ApiResponse<User>>;
  getAllCoaches(): Promise<ApiResponse<User[]>>;
  getAllAtheles(): Promise<ApiResponse<User[]>>;
  getUserClubs(userId: string): Promise<ApiResponse<any[]>>; // Ajusta el tipo según la estructura real de los clubes
}
