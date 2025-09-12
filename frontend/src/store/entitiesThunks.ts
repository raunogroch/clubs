import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../pages/Users/interfaces/userTypes";
import type { Sport } from "../pages/Sports/interfaces/sportTypes";
import api from "../services/api";
import type { Schedule } from "../pages/Schedule/types/scheduleTypes";

interface EntitiesPayload {
  coaches: User[];
  athletes: User[];
  sports: Sport[];
  schedules: Schedule[];
}
export const fetchEntities = createAsyncThunk<EntitiesPayload>(
  "entities/fetchEntities",
  async (_, { rejectWithValue }) => {
    try {
      const [users, sports, schedules] = await Promise.all([
        api.get("/users"),
        api.get("/sports"),
        api.get("/schedules"),
      ]);

      return {
        coaches: users.data.filter((user: User) => user.role === "coach"),
        athletes: users.data.filter((user: User) => user.role === "athlete"),
        sports: sports.data,
        schedules: schedules.data,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar entidades");
    }
  }
);
