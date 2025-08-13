// authService.ts
import api from "./api";

interface LoginData {
  username: string;
  password: string;
}

interface User {
  name: string;
  lastname: string;
  roles: string[];
}

interface LoginResponse {
  access: {
    authorization: string;
    user: User;
  };
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout() {
    // La lógica de logout está en el AuthProvider
  },
};
