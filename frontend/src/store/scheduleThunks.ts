import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { Schedule } from "../pages/Schedule/types/scheduleTypes";

export const fetchSchedules = createAsyncThunk<Schedule[]>(
  "schedules/fetchSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/schedules");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar horarios");
    }
  }
);

export const createSchedule = createAsyncThunk<Schedule, Omit<Schedule, "_id">>(
  "schedules/createSchedule",
  async (schedule, { rejectWithValue }) => {
    try {
      const response = await api.post("/schedules", schedule);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al crear horario");
    }
  }
);

export const updateSchedule = createAsyncThunk<Schedule, Schedule>(
  "schedules/updateSchedule",
  async (schedule, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/schedules/${schedule._id}`, schedule);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al actualizar horario"
      );
    }
  }
);

export const deleteSchedule = createAsyncThunk<string, string>(
  "schedules/deleteSchedule",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/schedules/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al eliminar horario");
    }
  }
);

export const findScheduleById = createAsyncThunk<string, string>(
  "schedules/findScheduleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/schedules/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al buscar el horario"
      );
    }
  }
);
