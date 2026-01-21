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
    const res = await api.get(`/users?role=${role}`);
    return res.data;
  }

  async create(user: Partial<UserDTO>) {
    const res = await api.post(`/users`, user);
    return res.data;
  }

  async update(id: string, user: Partial<UserDTO>) {
    const res = await api.patch(`/users/${id}`, user);
    return res.data;
  }

  async remove(id: string) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }
}

export default new UsersService();
