import { createAsyncThunk } from "@reduxjs/toolkit";
import clubsService from "../services/clubs.service";
import toastr from "toastr";

export const addClubLevel = createAsyncThunk(
  "levels/addClubLevel",
  async (payload: { clubId: string; level: any }, { rejectWithValue }) => {
    try {
      const data = await clubsService.addLevel(payload.clubId, payload.level);
      toastr.success("Nivel agregado");
      return data;
    } catch (err: any) {
      toastr.error("Error al agregar nivel");
      return rejectWithValue(err.message || "Error al agregar nivel");
    }
  },
);

export const updateClubLevel = createAsyncThunk(
  "levels/updateClubLevel",
  async (
    payload: { clubId: string; levelId: string; level: any },
    { rejectWithValue },
  ) => {
    try {
      const data = await clubsService.updateLevel(
        payload.clubId,
        payload.levelId,
        payload.level,
      );
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar nivel");
      return rejectWithValue(err.message || "Error al actualizar nivel");
    }
  },
);

export const deleteClubLevel = createAsyncThunk(
  "levels/deleteClubLevel",
  async (payload: { clubId: string; levelId: string }, { rejectWithValue }) => {
    try {
      const data = await clubsService.deleteLevel(
        payload.clubId,
        payload.levelId,
      );
      toastr.success("Nivel eliminado");
      return data;
    } catch (err: any) {
      toastr.error("Error al eliminar nivel");
      return rejectWithValue(err.message || "Error al eliminar nivel");
    }
  },
);
