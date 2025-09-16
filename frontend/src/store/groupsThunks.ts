import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { Group } from "../pages/groups/interface/group.Interface";

export const fetchGroups = createAsyncThunk<Group[], { clubId: string }>(
  "groups/fetchGroups",
  async ({ clubId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/clubs/${clubId}/groups`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar grupos");
    }
  }
);

export const createGroup = createAsyncThunk<
  Group,
  { clubId: string; group: Omit<Group, "_id"> }
>("groups/createGroup", async ({ clubId, group }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/clubs/${clubId}/groups`, group);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error al crear grupo");
  }
});

export const updateGroup = createAsyncThunk<
  Group,
  { clubId: string; group: Group }
>("groups/updateGroup", async ({ clubId, group }, { rejectWithValue }) => {
  try {
    const response = await api.patch(
      `/clubs/${clubId}/groups/${group._id}`,
      group
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error al actualizar grupo");
  }
});

export const deleteGroup = createAsyncThunk<
  string,
  { clubId: string; groupId: string }
>("groups/deleteGroup", async ({ clubId, groupId }, { rejectWithValue }) => {
  try {
    await api.delete(`/clubs/${clubId}/groups/${groupId}`);
    return groupId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error al eliminar grupo");
  }
});

export const findGroupById = createAsyncThunk<
  Group,
  { clubId: string; groupId: string }
>("groups/findGroupById", async ({ clubId, groupId }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/clubs/${clubId}/groups/${groupId}`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error al buscar el grupo");
  }
});
