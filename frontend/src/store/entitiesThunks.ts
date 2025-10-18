import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../interfaces/user";
import type { Sport } from "../pages/Sports/interfaces/sportTypes";
import api from "../services/api";

interface EntitiesPayload {
  coaches: User[];
  athletes: User[];
  sports: Sport[];
}
export const fetchEntities = createAsyncThunk<EntitiesPayload>(
  "entities/fetchEntities",
  async (_, { rejectWithValue }) => {
    try {
      const [users, sports] = await Promise.all([
        api.get("/users"),
        api.get("/sports"),
      ]);

      return {
        coaches: users.data.filter((user: User) => user.role === "coach"),
        athletes: users.data.filter((user: User) => user.role === "athlete"),
        sports: sports.data,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar entidades");
    }
  }
);
