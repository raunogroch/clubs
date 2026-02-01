import { createAsyncThunk } from "@reduxjs/toolkit";
import { sportService } from "../services/sportService";
import toastr from "toastr";

export const fetchAllSports = createAsyncThunk(
  "sports/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await sportService.getAll();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener deportes");
      return rejectWithValue(err.message || "Error al obtener deportes");
    }
  },
);

export const fetchSportById = createAsyncThunk(
  "sports/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await sportService.getById(id);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener el deporte");
      return rejectWithValue(err.message || "Error al obtener el deporte");
    }
  },
);

export const createSport = createAsyncThunk(
  "sports/create",
  async (sport: any, { rejectWithValue }) => {
    try {
      const data = await sportService.create(sport);
      toastr.success("Deporte creado");
      return data;
    } catch (err: any) {
      toastr.error("Error al crear deporte");
      return rejectWithValue(err.message || "Error al crear deporte");
    }
  },
);

export const updateSport = createAsyncThunk(
  "sports/update",
  async (payload: { id: string; sport: any }, { rejectWithValue }) => {
    try {
      const data = await sportService.update(payload.id, payload.sport);
      toastr.success("Deporte actualizado");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar deporte");
      return rejectWithValue(err.message || "Error al actualizar deporte");
    }
  },
);

export const deleteSport = createAsyncThunk(
  "sports/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await sportService.delete(id);
      toastr.success("Deporte eliminado");
      return { id };
    } catch (err: any) {
      toastr.error("Error al eliminar deporte");
      return rejectWithValue(err.message || "Error al eliminar deporte");
    }
  },
);

export const restoreSport = createAsyncThunk(
  "sports/restore",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await sportService.restore(id);
      toastr.success("Deporte restaurado");
      return data;
    } catch (err: any) {
      toastr.error("Error al restaurar deporte");
      return rejectWithValue(err.message || "Error al restaurar deporte");
    }
  },
);
