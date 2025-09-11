import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { User } from "../interfaces/user";
import type { UsersResponse } from "./usersSlice";

export const fetchUsers = createAsyncThunk<
  UsersResponse,
  { page?: number; limit?: number; name?: string }
>("users/fetchUsers", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get("/users", { params });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error al cargar usuarios");
  }
});

export const createUser = createAsyncThunk<User, Omit<User, "_id">>(
  "users/createUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await api.post("/users", user);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al crear usuario");
    }
  }
);

export const updateUser = createAsyncThunk<User, User>(
  "users/updateUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${user._id}`, user);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al actualizar usuario"
      );
    }
  }
);

export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al eliminar usuario");
    }
  }
);
