import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { UsersResponse } from "./usersSlice";
import type { User } from "../pages/Users/interfaces/userTypes";

export const fetchUsers = createAsyncThunk<
  UsersResponse,
  { page?: number; limit?: number; name?: string; role?: string }
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
      const response = await api.patch(`/users/${user._id}`, user);
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

export const restoreUser = createAsyncThunk<User, string>(
  "users/restoreUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${id}/restore`);
      return response.data as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error al restaurar usuario");
    }
  }
);

export const findUserById = createAsyncThunk<User, string>(
  "users/findUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data as User;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Error al buscar al usuario"
      );
    }
  }
);
