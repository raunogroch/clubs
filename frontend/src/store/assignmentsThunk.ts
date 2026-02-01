import { createAsyncThunk } from "@reduxjs/toolkit";
import assignmentsService from "../services/assignments.service";
import toastr from "toastr";

export const fetchAllAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await assignmentsService.getAll();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener asignaciones");
      return rejectWithValue(err.message || "Error al obtener asignaciones");
    }
  },
);

export const fetchMyAssignments = createAsyncThunk(
  "assignments/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const data = await assignmentsService.getMyAssignments();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener mis asignaciones");
      return rejectWithValue(
        err.message || "Error al obtener mis asignaciones",
      );
    }
  },
);

export const fetchAssignmentById = createAsyncThunk(
  "assignments/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await assignmentsService.getById(id);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener la asignación");
      return rejectWithValue(err.message || "Error al obtener la asignación");
    }
  },
);

export const createAssignment = createAsyncThunk(
  "assignments/create",
  async (assignment: any, { rejectWithValue }) => {
    try {
      const data = await assignmentsService.create(assignment);
      toastr.success("Asignación creada");
      return data;
    } catch (err: any) {
      toastr.error("Error al crear asignación");
      return rejectWithValue(err.message || "Error al crear asignación");
    }
  },
);

export const updateAssignment = createAsyncThunk(
  "assignments/update",
  async (payload: { id: string; assignment: any }, { rejectWithValue }) => {
    try {
      const data = await assignmentsService.update(
        payload.id,
        payload.assignment,
      );
      toastr.success("Asignación actualizada");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar asignación");
      return rejectWithValue(err.message || "Error al actualizar asignación");
    }
  },
);

export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await assignmentsService.delete(id);
      toastr.success("Asignación eliminada");
      return { id };
    } catch (err: any) {
      toastr.error("Error al eliminar asignación");
      return rejectWithValue(err.message || "Error al eliminar asignación");
    }
  },
);

export const checkModuleAccess = createAsyncThunk(
  "assignments/checkAccess",
  async (moduleName: string, { rejectWithValue }) => {
    try {
      const data = await assignmentsService.checkModuleAccess(moduleName);
      return data;
    } catch (err: any) {
      toastr.error("Error al verificar acceso");
      return rejectWithValue(err.message || "Error al verificar acceso");
    }
  },
);
