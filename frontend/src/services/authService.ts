import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";
// Utilidades para localStorage
const STORAGE_KEYS = {
  UUID: "UUID",
  USER: "user",
};

function setUserToStorage(user: User) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function getUserFromStorage(): User | null {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
}

function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEYS.UUID);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

interface LoginData {
  username: string;
  password: string;
}

interface User {
  id?: string;
  name: string;
  lastname: string;
  role: string;
}

interface LoginResponse {
  authorization: string;
  user: User;
}

export const authService = {
  /**
   * Inicia sesión y guarda datos en localStorage
   */
  async login(credentials: LoginData): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem(
        STORAGE_KEYS.UUID,
        response.data.access.authorization
      );
      setUserToStorage(response.data.access.user);
      return {
        code: response.status,
        message: "Login exitoso",
        data: response.data.access,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Cierra sesión y limpia datos de autenticación
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await api.post("/auth/logout");
      clearAuthStorage();
      return {
        code: response.status,
        message: "Logout exitoso",
      };
    } catch (error: any) {
      clearAuthStorage();
      return handleApiError(error);
    }
  },

  /**
   * Valida el token actual
   */
  async validateToken(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get("/auth/validate");
      setUserToStorage(response.data.user);
      return {
        code: response.status,
        message: "Token válido",
        data: response.data.user,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el usuario autenticado desde localStorage
   */
  getCurrentUser(): User | null {
    return getUserFromStorage();
  },
};
