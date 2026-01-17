import api from "./api";

export interface AdministratorInfo {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
}

export interface ManagementGroup {
  _id: string;
  name: string;
  description?: string;
  sport?: string;
  category?: string;
  schedule?: any[];
  administrator?: AdministratorInfo | string;
  coaches?: any[];
  athletes?: any[];
  clubs?: any[];
  sports?: any[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManagementGroupPayload {
  name: string;
  description?: string;
  sport?: string;
  category?: string;
  schedule?: any[];
  coaches?: string[];
  athletes?: string[];
  administrator?: string;
}

export const managementGroupsService = {
  getAll: async (): Promise<ManagementGroup[]> => {
    const response = await api.get("/admin/groups");
    return response.data;
  },

  getAllIncludingDeleted: async (): Promise<ManagementGroup[]> => {
    const response = await api.get("/admin/groups/all/including-deleted");
    return response.data;
  },

  getById: async (id: string): Promise<ManagementGroup> => {
    const response = await api.get(`/admin/groups/${id}`);
    return response.data;
  },

  create: async (payload: CreateManagementGroupPayload): Promise<ManagementGroup> => {
    const response = await api.post("/admin/groups", payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateManagementGroupPayload>
  ): Promise<ManagementGroup> => {
    const response = await api.patch(`/admin/groups/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<ManagementGroup> => {
    const response = await api.delete(`/admin/groups/${id}`);
    return response.data;
  },

  restore: async (id: string): Promise<ManagementGroup> => {
    const response = await api.patch(`/admin/groups/${id}/restore`);
    return response.data;
  },

  assignAdministrator: async (
    id: string,
    administratorId: string
  ): Promise<ManagementGroup> => {
    const response = await api.patch(`/admin/groups/${id}/administrator`, {
      administratorId,
    });
    return response.data;
  },
};
