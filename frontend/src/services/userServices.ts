// authService.ts
import api from "./api";

interface userData {
  roles: string[];
  ci: string;
  name: string;
  lastname: string;
  email: string;
  birth_date: string;
  username: string;
  password: string;
}

interface userResponse {
  data: {
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
  };
  code: number;
}

interface errorResponse {
  message: string;
  code: number;
}

export const userService = {
  async create(userData: userData): Promise<userResponse | errorResponse> {
    userData.username = userData.ci;
    userData.password = userData.ci;

    const response = await api.post("/users", userData);
    if (response.status === 201) {
      return {
        data: response.data,
        code: response.status,
      };
    }
    if (response.status === 500) {
      return {
        message: "El usuario ya existe",
        code: response.status,
      };
    }
  },
};
