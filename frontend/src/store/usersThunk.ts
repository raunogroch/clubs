import { createAsyncThunk } from "@reduxjs/toolkit";
import usersService from "../services/users.service";
import toastr from "toastr";

export const fetchUsersByRole = createAsyncThunk(
  "users/fetchByRole",
  async (role: string, { rejectWithValue }) => {
    try {
      const data = await usersService.fetchByRole(role);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener usuarios");
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (payload: { role: string; user: any }, { rejectWithValue }) => {
    try {
      const data = await usersService.create(payload.user);
      toastr.success("Usuario creado");
      return data;
    } catch (err: any) {
      toastr.error("Error al crear usuario");
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (payload: { id: string; user: any }, { rejectWithValue }) => {
    try {
      const data = await usersService.update(payload.id, payload.user);
      toastr.success("Usuario actualizado");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar usuario");
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await usersService.remove(id);
      toastr.success("Usuario eliminado");
      return { id, data };
    } catch (err: any) {
      toastr.error("Error al eliminar usuario");
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);
