import type { AxiosInstance } from "axios";
import api from "./api";

interface LevelAssignment {
  order: number;
  name: string;
  description?: string;
}

interface Level {
  _id?: string;
  name: string;
  level_assignment: LevelAssignment[];
  createdAt?: string;
  updatedAt?: string;
}

interface CreateLevelDto {
  name: string;
  level_assignment?: LevelAssignment[];
}

interface UpdateLevelDto {
  name?: string;
  level_assignment?: LevelAssignment[];
}

class LevelsService {
  private client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  async getAll(): Promise<Level[]> {
    const response = await this.client.get<Level[]>("/levels");
    return Array.isArray(response.data) ? response.data : [];
  }

  async getById(id: string): Promise<Level> {
    const response = await this.client.get<Level>(`/levels/${id}`);
    return response.data;
  }

  async create(data: CreateLevelDto): Promise<Level> {
    const response = await this.client.post<Level>("/levels", data);
    return response.data;
  }

  async update(id: string, data: UpdateLevelDto): Promise<Level> {
    const response = await this.client.patch<Level>(`/levels/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/levels/${id}`);
  }
}

export default new LevelsService();
