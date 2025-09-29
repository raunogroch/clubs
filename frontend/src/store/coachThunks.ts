import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { UsersResponse } from "./usersSlice";

export const fetchUser = createAsyncThunk<
  UsersResponse,
  { userId: string }
>("coach/fetchUser", async ({userId}, { rejectWithValue }) => {
  console.log("Fetching user clubs and groups for userId:", userId);
  try {
    const response = await api.get(`/users/${userId}/clubs-groups`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error al cargar usuarios");
  }
});

