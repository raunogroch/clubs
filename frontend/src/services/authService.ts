import { handleApiError, type ApiResponse } from "../utils/apiUtils";
import api from "./api";

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
  async login(credentials: LoginData): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("UUID", response.data.access.authorization);
      localStorage.setItem("user", response.data.access.user);
      return {
        code: response.status,
        message: "Login exitoso",
        data: response.data.access,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await api.post("/auth/logout");
      localStorage.removeItem("UUID");
      return {
        code: response.status,
        message: "Logout exitoso",
      };
    } catch (error: any) {
      localStorage.removeItem("UUID");
      return handleApiError(error);
    }
  },

  async validateToken(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get("/auth/validate");
      return {
        code: response.status,
        message: "Token válido",
        data: response.data.user,
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
