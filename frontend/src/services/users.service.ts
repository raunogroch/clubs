import api from "./api";

export interface UserDTO {
  _id?: string;
  name?: string;
  lastname?: string;
  username: string;
  role: string;
  [key: string]: any;
}

class UsersService {
  async fetchByRole(role: string) {
    try {
      const res = await api.get(`/users?role=${role}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async create(user: Partial<UserDTO>) {
    try {
      const res = await api.post(`/users`, user);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, user: Partial<UserDTO>) {
    try {
      const res = await api.patch(`/users/${id}`, user);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async remove(id: string) {
    try {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id: string) {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}

export default new UsersService();
