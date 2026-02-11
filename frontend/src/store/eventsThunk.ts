import { createAsyncThunk } from "@reduxjs/toolkit";
import eventsService from "../services/eventsService";

export const fetchEventsByClub = createAsyncThunk(
  "events/fetchByClub",
  async (clubId: string, { rejectWithValue }) => {
    try {
      const data = await eventsService.getByClub(clubId);
      return data || [];
    } catch (err: any) {
      return rejectWithValue(err.message || "Error al obtener eventos");
    }
  },
);

export const createEvent = createAsyncThunk(
  "events/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const data = await eventsService.create(payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error al crear evento");
    }
  },
);

export const updateEvent = createAsyncThunk(
  "events/update",
  async (
    { id, eventData }: { id: string; eventData: any },
    { rejectWithValue },
  ) => {
    try {
      const data = await eventsService.update(id, eventData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error al actualizar evento");
    }
  },
);
