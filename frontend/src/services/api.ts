import axios from "axios";

/**
 * Instancia de Axios configurada para la API principal.
 * Incluye interceptor para agregar el token de autenticación.
 */
const api = axios.create({
  baseURL: "http://192.168.100.71:3000/",
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
      window.location.href = "/login"; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default api;
