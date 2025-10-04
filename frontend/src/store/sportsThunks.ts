import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { Sport } from "../pages/Sports/interfaces";

export const fetchSports = createAsyncThunk<Sport[]>(
  "sports/fetchSports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/sports");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al cargar disciplinas"
      );
    }
  }
);

export const createSport = createAsyncThunk<Sport, Omit<Sport, "_id">>(
  "sports/createSport",
  async (sport, { rejectWithValue }) => {
    try {
      const response = await api.post("/sports", sport);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al crear disciplina");
    }
  }
);

export const updateSport = createAsyncThunk<Sport, Sport>(
  "sports/updateSport",
  async (sport, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/sports/${sport._id}`, sport);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al actualizar disciplina"
      );
    }
  }
);

export const deleteSport = createAsyncThunk<string, string>(
  "sports/deleteSport",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sports/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al eliminar disciplina"
      );
    }
  }
);

export const restoreSport = createAsyncThunk<Sport, string>(
  "sports/restoreSport",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/sports/${id}/restore`);
      return response.data as Sport;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al restaurar usuario"
      );
    }
  }
);

export const findSportById = createAsyncThunk<string, string>(
  "sports/findSportById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sports/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al buscar la disciplina"
      );
    }
  }
);
