// authService.ts
import api from "./api";

interface userData {
  roles: string;
  ci: string;
  name: string;
  lastname: string;
  email: string;
  birth_date: string;
  username: string;
  password: string;
}

interface userResponse {
  _id: string;
  username: string;
  password: string;
  roles: string[];
  name: string;
  lastname: string;
  email: string;
  ci: string;
  birth_date: string;
  height: string;
  weight: string;
}

export const userService = {
  async create(userData: userData): Promise<userResponse> {
    userData.username = userData.ci;
    userData.password = userData.ci;

    const response = await api.post("/users", userData);
    return response.data;
  },
};
