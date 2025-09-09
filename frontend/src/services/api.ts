import axios from "axios";
import { store } from "../store";
import { logout } from "../store/authSlice";

/**
 * Instancia de Axios configurada para la API principal.
 * Incluye interceptor para agregar el token de autenticación.
 */
const api = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT a cada petición si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      store.dispatch(logout());
      window.location.href = "/login"; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default api;
