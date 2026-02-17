import { createAsyncThunk } from "@reduxjs/toolkit";
import schedulesService from "../services/schedulesService";
import toastr from "toastr";

/**
 * Obtener todos los schedules de un grupo
 */
export const fetchSchedulesByGroupId = createAsyncThunk(
  "schedules/fetchByGroupId",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const data = await schedulesService.getByGroupId(groupId);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener schedules");
      return rejectWithValue(err.message || "Error al obtener schedules");
    }
  },
);

/**
 * Crear nuevo schedule
 */
export const createSchedule = createAsyncThunk(
  "schedules/create",
  async (
    payload: {
      groupId: string;
      schedule: { day: string; startTime: string; endTime: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await schedulesService.create(
        payload.groupId,
        payload.schedule,
      );
      toastr.success("Schedule creado");
      return data;
    } catch (err: any) {
      toastr.error("Error al crear schedule");
      return rejectWithValue(err.message || "Error al crear schedule");
    }
  },
);

/**
 * Actualizar schedule
 */
export const updateSchedule = createAsyncThunk(
  "schedules/update",
  async (
    payload: {
      groupId: string;
      scheduleId: string;
      schedule: { day?: string; startTime?: string; endTime?: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await schedulesService.update(
        payload.groupId,
        payload.scheduleId,
        payload.schedule,
      );
      toastr.success("Schedule actualizado");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar schedule");
      return rejectWithValue(err.message || "Error al actualizar schedule");
    }
  },
);

/**
 * Eliminar schedule
 */
export const deleteSchedule = createAsyncThunk(
  "schedules/delete",
  async (
    payload: { groupId: string; scheduleId: string },
    { rejectWithValue },
  ) => {
    try {
      await schedulesService.delete(payload.groupId, payload.scheduleId);
      toastr.success("Schedule eliminado");
      return payload.scheduleId;
    } catch (err: any) {
      toastr.error("Error al eliminar schedule");
      return rejectWithValue(err.message || "Error al eliminar schedule");
    }
  },
);

/**
 * Reemplazar todos los schedules (batch)
 */
export const replaceBatchSchedules = createAsyncThunk(
  "schedules/replaceBatch",
  async (
    payload: {
      groupId: string;
      schedules: Array<{ day: string; startTime: string; endTime: string }>;
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await schedulesService.replaceBatch(
        payload.groupId,
        payload.schedules,
      );
      toastr.success("Schedules actualizados");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar schedules");
      return rejectWithValue(err.message || "Error al actualizar schedules");
    }
  },
);

/**
 * Obtener todos los schedules para el calendario del admin
 * Endpoint optimizado para mejor rendimiento
 */
export const fetchAdminSchedules = createAsyncThunk(
  "schedules/fetchAdminSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const data = await schedulesService.getAdminSchedules();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener horarios");
      return rejectWithValue(err.message || "Error al obtener horarios");
    }
  },
);
