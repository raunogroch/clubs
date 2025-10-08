import axios from "axios";
const backendUri = import.meta.env.VITE_BACKEND_URI;

/**
 * Instancia de Axios configurada para la API principal.
 * Incluye interceptor para agregar el token de autenticación.
 */
const api = axios.create({
  baseURL: backendUri,
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
    // No redirigir automáticamente en error 401 para evitar refresco
    return Promise.reject(error);
  }
);

export default api;
