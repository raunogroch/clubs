import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { Club } from "../pages/Clubs/interfaces/clubTypes";

export const fetchClubs = createAsyncThunk<Club[]>(
  "clubs/fetchClubs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/clubs");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar clubs");
    }
  }
);

export const createClub = createAsyncThunk<Club, Omit<Club, "_id">>(
  "clubs/createClub",
  async (club, { rejectWithValue }) => {
    try {
      const response = await api.post("/clubs", club);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al crear usuario");
    }
  }
);

export const updateClub = createAsyncThunk<Club, Club>(
  "clubs/updateClub",
  async (club, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/clubs/${club._id}`, club);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al actualizar usuario"
      );
    }
  }
);

export const deleteClub = createAsyncThunk<string, string>(
  "clubs/deleteClub",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/clubs/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al eliminar usuario");
    }
  }
);

export const restoreClub = createAsyncThunk<Club, string>(
  "clubs/restoreClub",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/clubs/${id}/restore`);
      return response.data as Club;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al restaurar club");
    }
  }
);

export const findClubById = createAsyncThunk<string, string>(
  "clubs/findClubById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/clubs/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al buscar al usuario"
      );
    }
  }
);

export const assignAssistants = createAsyncThunk<
  Club,
  { clubId: string; assistants: string[] }
>(
  "clubs/assignAssistants",
  async ({ clubId, assistants }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/clubs/${clubId}/assign-assistants`, {
        assistants,
      });
      return response.data as Club;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al asignar asistentes"
      );
    }
  }
);

export const softDeleteClub = createAsyncThunk<string, string>(
  "clubs/softDeleteClub",
  async (id, { rejectWithValue }) => {
    try {
      // Soft delete: mark Club as inactive
      await api.patch(`/clubs/${id}/remove`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al desactivar club");
    }
  }
);
