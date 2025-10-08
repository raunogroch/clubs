import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { checkAuth, loginThunk, logoutThunk } from "./authThunk";

interface User {
  id?: string;
  name: string;
  role: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

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
