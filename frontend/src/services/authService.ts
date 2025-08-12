// authService.ts
import api from "./api";

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    // La lógica de logout está en el AuthProvider
  },
};
