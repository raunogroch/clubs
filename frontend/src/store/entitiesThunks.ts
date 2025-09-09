import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { setEntities } from "./entitiesSlice";

export const fetchClubs = createAsyncThunk(
  "entities/fetchClubs",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/clubs");
      dispatch(setEntities({ name: "clubs", data: response.data }));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar clubs");
    }
  }
);

export const fetchSports = createAsyncThunk(
  "entities/fetchSports",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/sports");
      dispatch(setEntities({ name: "sports", data: response.data }));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar sports");
    }
  }
);

export const fetchSchedules = createAsyncThunk(
  "entities/fetchSchedules",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/schedules");
      dispatch(setEntities({ name: "schedules", data: response.data }));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar schedules");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "entities/fetchUsers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/users");
      dispatch(setEntities({ name: "users", data: response.data }));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar usuarios");
    }
  }
);
