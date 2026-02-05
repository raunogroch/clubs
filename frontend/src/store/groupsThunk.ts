import { createAsyncThunk } from "@reduxjs/toolkit";
import groupsService from "../services/groups.service";
import toastr from "toastr";

export const fetchGroupsByClub = createAsyncThunk(
  "groups/fetchByClub",
  async (clubId: string, { rejectWithValue }) => {
    try {
      const data = await groupsService.getByClub(clubId);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener grupos");
      return rejectWithValue(err.message || "Error al obtener grupos");
    }
  },
);

export const fetchGroupById = createAsyncThunk(
  "groups/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await groupsService.getById(id);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener el grupo");
      return rejectWithValue(err.message || "Error al obtener el grupo");
    }
  },
);

export const fetchGroupSummary = createAsyncThunk(
  "groups/fetchSummary",
  async (payload: { id: string; fields?: string[] }, { rejectWithValue }) => {
    try {
      console.log(
        `[fetchGroupSummary] Requesting group ${payload.id} with fields:`,
        payload.fields,
      );
      const data = await groupsService.getById(payload.id, payload.fields);
      return data;
    } catch (err: any) {
      console.error(`[fetchGroupSummary] Error:`, err);
      toastr.error("Error al obtener resumen del grupo");
      return rejectWithValue(
        err.message || "Error al obtener resumen del grupo",
      );
    }
  },
);

export const createGroup = createAsyncThunk(
  "groups/create",
  async (group: any, { rejectWithValue }) => {
    try {
      const data = await groupsService.create(group);
      toastr.success("Grupo creado");
      return data;
    } catch (err: any) {
      toastr.error("Error al crear grupo");
      return rejectWithValue(err.message || "Error al crear grupo");
    }
  },
);

export const updateGroup = createAsyncThunk(
  "groups/update",
  async (payload: { id: string; group: any }, { rejectWithValue }) => {
    try {
      const data = await groupsService.update(payload.id, payload.group);
      toastr.success("Grupo actualizado");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar grupo");
      return rejectWithValue(err.message || "Error al actualizar grupo");
    }
  },
);

export const deleteGroup = createAsyncThunk(
  "groups/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await groupsService.delete(id);
      toastr.success("Grupo eliminado");
      return { id };
    } catch (err: any) {
      toastr.error("Error al eliminar grupo");
      return rejectWithValue(err.message || "Error al eliminar grupo");
    }
  },
);

export const addCoachToGroup = createAsyncThunk(
  "groups/addCoach",
  async (
    payload: { groupId: string; coachId: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await groupsService.addCoach(
        payload.groupId,
        payload.coachId,
      );
      toastr.success("Entrenador añadido");
      return data;
    } catch (err: any) {
      toastr.error("Error al añadir entrenador");
      return rejectWithValue(err.message || "Error al añadir entrenador");
    }
  },
);

export const removeCoachFromGroup = createAsyncThunk(
  "groups/removeCoach",
  async (
    payload: { groupId: string; coachId: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await groupsService.removeCoach(
        payload.groupId,
        payload.coachId,
      );
      toastr.success("Entrenador removido");
      return data;
    } catch (err: any) {
      toastr.error("Error al remover entrenador");
      return rejectWithValue(err.message || "Error al remover entrenador");
    }
  },
);

export const addAthleteToGroup = createAsyncThunk(
  "groups/addAthlete",
  async (
    payload: { groupId: string; athleteId: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await groupsService.addAthlete(
        payload.groupId,
        payload.athleteId,
      );
      toastr.success("Atleta añadido");
      return data;
    } catch (err: any) {
      toastr.error("Error al añadir atleta");
      return rejectWithValue(err.message || "Error al añadir atleta");
    }
  },
);

export const removeAthleteFromGroup = createAsyncThunk(
  "groups/removeAthlete",
  async (
    payload: { groupId: string; athleteId: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await groupsService.removeAthlete(
        payload.groupId,
        payload.athleteId,
      );
      toastr.success("Atleta removido");
      return data;
    } catch (err: any) {
      toastr.error("Error al remover atleta");
      return rejectWithValue(err.message || "Error al remover atleta");
    }
  },
);

export const addScheduleToGroup = createAsyncThunk(
  "groups/addSchedule",
  async (payload: { groupId: string; schedule: any }, { rejectWithValue }) => {
    try {
      const data = await groupsService.addSchedule(
        payload.groupId,
        payload.schedule.day,
        payload.schedule.startTime,
        payload.schedule.endTime,
      );
      return data;
    } catch (err: any) {
      toastr.error("Error al añadir horario");
      return rejectWithValue(err.message || "Error al añadir horario");
    }
  },
);

export const removeScheduleFromGroup = createAsyncThunk(
  "groups/removeSchedule",
  async (
    payload: { groupId: string; scheduleIndex: number },
    { rejectWithValue },
  ) => {
    try {
      const data = await groupsService.removeSchedule(
        payload.groupId,
        payload.scheduleIndex,
      );
      return data;
    } catch (err: any) {
      toastr.error("Error al remover horario");
      return rejectWithValue(err.message || "Error al remover horario");
    }
  },
);
