import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { setEntities } from "../entitiesSlice";
import type { User } from "./types";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get<User[]>("/users");
      dispatch(setEntities({ name: "users", data: response.data }));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al cargar usuarios");
    }
  }
);
