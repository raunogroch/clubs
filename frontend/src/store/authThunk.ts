import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";
import api from "../services/api";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// Login thunk
export const loginThunk = createAsyncThunk(
  "auth/loginThunk",
  async (formData: { username: string; password: string }, { dispatch }) => {
    try {
      const response = await api.post("/auth/login", formData);
      const { user, authorization } = response.data.access;
      dispatch(login({ user: user, token: authorization }));
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toastr.error(
          "<strong>Error de autenticación</strong><br/><small>Verifica tus credenciales e intenta nuevamente</small>",
        );
      } else {
        toastr.error("Error de conexión o inesperado");
      }
    }
  },
);

// Login por CI thunk (para atletas y padres)
export const loginByCiThunk = createAsyncThunk(
  "auth/loginByCiThunk",
  async (
    formData: { ci: string; role: "athlete" | "parent" },
    { dispatch },
  ) => {
    try {
      const response = await api.post("/auth/login-ci", formData);
      const { user, authorization } = response.data.access;
      dispatch(login({ user: user, token: authorization }));
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toastr.error(
          "<strong>CI no válido</strong><br/><small>Verifica tu número de carnet e intenta nuevamente</small>",
        );
      } else {
        toastr.error("Error de conexión o inesperado");
      }
    }
  },
);

// Logout thunk
export const logoutThunk = createAsyncThunk(
  "auth/logoutThunk",
  async (_, { dispatch }) => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      toastr.error("Error during logout");
    } finally {
      dispatch(logout());
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      return false;
    }
    const isValid = await api.get("/auth/validate");
    if (isValid) {
      const user = localStorage.getItem("user");
      dispatch(login({ user: user ? JSON.parse(user) : null, token }));
      return true;
    } else {
      dispatch(logout());
      return false;
    }
  },
);
