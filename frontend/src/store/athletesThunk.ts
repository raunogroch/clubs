import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

export const fetchAthletes = createAsyncThunk(
  "athletes/fetchAthletes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAthletesFromGroups();
      if (response.code === 200 && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Error al cargar atletas");
    }
  },
);

export const fetchParentsByCISearch = createAsyncThunk(
  "athletes/fetchParentsByCISearch",
  async (ci: string, { rejectWithValue }) => {
    try {
      if (!ci.trim()) {
        return null;
      }
      const response = await userService.fetchByRole("parent");
      const foundParent = response?.data?.find(
        (u: any) => u.ci?.toLowerCase() === ci.toLowerCase(),
      );
      return foundParent || null;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Error al buscar tutor");
    }
  },
);

export const fetchAllParents = createAsyncThunk(
  "athletes/fetchAllParents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.fetchByRole("parent");
      return response?.data || [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Error al cargar tutores");
    }
  },
);

export const uploadAthleteImage = createAsyncThunk(
  "athletes/uploadAthleteImage",
  async (
    payload: { userId: string; imageBase64: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await userService.uploadCoachImage(payload);
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.message || "Error al procesar la imagen");
    } catch (error: any) {
      return rejectWithValue(error?.message || "Error al actualizar imagen");
    }
  },
);

export const uploadAthleteCI = createAsyncThunk(
  "athletes/uploadAthleteCI",
  async (
    payload: { userId: string; pdfBase64: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await userService.uploadAthleteCI(payload);
      if (response.code === 200) {
        return response.data;
      }
      return rejectWithValue(response.message || "Error al procesar el PDF");
    } catch (error: any) {
      return rejectWithValue(error?.message || "Error al actualizar CI");
    }
  },
);

export const fetchAthleteParent = createAsyncThunk(
  "athletes/fetchAthleteParent",
  async (parentId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(parentId);
      const parentInfo = response?.data || response;
      return parentInfo || null;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Error al cargar datos del tutor",
      );
    }
  },
);

export const fetchMyAthletes = createAsyncThunk(
  "athletes/fetchMyAthletes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getMyAthletes();
      if (response.code === 200 && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Error al cargar tus atletas");
    }
  },
);
