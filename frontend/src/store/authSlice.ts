/**
 * AuthSlice - Slice de Redux para gestionar el estado de autenticación
 * 
 * Responsabilidades:
 * - Almacenar información del usuario autenticado
 * - Gestionar el estado de login/logout
 * - Guardar y recuperar el token JWT
 * - Mantener el estado de carga de peticiones de autenticación
 * 
 * Estado:
 * {
 *   user: Usuario autenticado o null
 *   token: JWT token o null
 *   isAuthenticated: boolean
 *   status: Estado de la petición (idle, loading, succeeded, failed)
 *   error: Mensaje de error o null
 * }
 * 
 * Acciones disponibles:
 * - loginThunk: Envía credenciales al servidor y obtiene el token
 * - logoutThunk: Invalida el token y limpia el estado
 * - checkAuth: Verifica si el usuario aún está autenticado
 * - login: Acción manual para establecer usuario y token
 * - logout: Acción manual para limpiar el estado
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { checkAuth, loginThunk, logoutThunk } from "./authThunk";

/**
 * Interfaz que define la estructura del usuario autenticado
 */
interface User {
  id?: string;        // ID del usuario
  name: string;       // Nombre completo o nombre de usuario
  role: string;       // Rol del usuario (ADMIN, COACH, ATHLETE, etc)
  [key: string]: any; // Otros campos dinámicos que pueda tener el usuario
}

/**
 * Interfaz que define el estado de autenticación global
 * Este es el estado que se almacena en Redux
 */
interface AuthState {
  user: User | null;                         // Usuario autenticado
  token: string | null;                      // Token JWT
  isAuthenticated: boolean;                  // Indicador de si está logueado
  status: "idle" | "loading" | "succeeded" | "failed"; // Estado de la petición
  error: string | null;                      // Mensaje de error si algo falló
}

/**
 * Estado inicial de autenticación
 * Cuando la app carga, no hay usuario ni token
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginThunk.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state) => {
      state.status = "succeeded";
      state.error = null;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error?.message || "Credenciales incorrectas";
    });
    // LOGOUT
    builder.addCase(logoutThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.status = "idle";
      state.error = null;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error?.message || "Error al cerrar sesión";
    });
    // CHECK AUTH
    builder.addCase(checkAuth.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(checkAuth.fulfilled, (state) => {
      state.status = "succeeded";
      state.error = null;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error?.message || "Error de autenticación";
    });
  },
});

export const { login, logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
