import axios from "axios";

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
  const token = localStorage.getItem("UUID");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
