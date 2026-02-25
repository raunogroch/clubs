import { createAsyncThunk } from "@reduxjs/toolkit";
import clubsService from "../services/clubs.service";
import toastr from "toastr";

export const fetchClubsDashboardData = createAsyncThunk(
  "clubs/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clubsService.getDashboardData();
      return response;
    } catch (err: any) {
      console.error("❌ Error al obtener datos del dashboard:", err);
      toastr.error("Error al obtener datos del dashboard");
      return rejectWithValue(
        err.message || "Error al obtener datos del dashboard",
      );
    }
  },
);

export const fetchAllClubs = createAsyncThunk(
  "clubs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await clubsService.getAll();
      console.log("✅ Clubs fetched successfully:", data);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener clubs");
      // incluir código de status si está disponible
      const payload: any = { message: err.message || "Error al obtener clubs" };
      if (err.status) payload.status = err.status;
      return rejectWithValue(payload);
    }
  },
);

export const fetchClubById = createAsyncThunk(
  "clubs/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await clubsService.getById(id);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener el club");
      return rejectWithValue(err.message || "Error al obtener el club");
    }
  },
);

export const createClub = createAsyncThunk(
  "clubs/create",
  async (club: any, { rejectWithValue }) => {
    try {
      const data = await clubsService.create(club);
      toastr.success("Club creado");
      return data;
    } catch (err: any) {
      toastr.error("Error al crear club");
      return rejectWithValue(err.message || "Error al crear club");
    }
  },
);

export const updateClub = createAsyncThunk(
  "clubs/update",
  async (payload: { id: string; club: any }, { rejectWithValue }) => {
    try {
      const data = await clubsService.update(payload.id, payload.club);
      toastr.success("Club actualizado");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar club");
      return rejectWithValue(err.message || "Error al actualizar club");
    }
  },
);

export const deleteClub = createAsyncThunk(
  "clubs/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await clubsService.delete(id);
      toastr.success("Club eliminado");
      return { id };
    } catch (err: any) {
      toastr.error("Error al eliminar club");
      return rejectWithValue(err.message || "Error al eliminar club");
    }
  },
);

export const fetchAssignmentAssistants = createAsyncThunk(
  "clubs/fetchAssignmentAssistants",
  async (_, { rejectWithValue }) => {
    try {
      const data = await clubsService.getAssignmentAssistants();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener asistentes de la asignación");
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// Note: restoreClub functionality not available in the current ClubsService
// export const restoreClub = createAsyncThunk(
//   "clubs/restore",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const data = await clubsService.restore(id);
//       toastr.success("Club restaurado");
//       return data;
//     } catch (err: any) {
//       toastr.error("Error al restaurar club");
//       return rejectWithValue(err.message || "Error al restaurar club");
//     }
//   },
// );
