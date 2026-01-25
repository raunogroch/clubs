/**
 * Configuración central de Axios para comunicación con la API
 *
 * Este archivo:
 * - Crea una instancia configurada de Axios
 * - Agrrega interceptores para autenticación
 * - Maneja errores de respuesta
 *
 * Flujo de una petición:
 * 1. Se agrega el token JWT al header Authorization (interceptor de request)
 * 2. Se envía la petición al backend
 * 3. Si hay error 401, se redirige a login (interceptor de response)
 */

import axios from "axios";

// Obtener la URL del backend desde las variables de entorno
const backendUri = import.meta.env.VITE_BACKEND_URI;

// Asegurar que las peticiones vayan al prefijo `/api` del backend
const normalizedBase = (() => {
  if (!backendUri) return "/api";
  const trimmed = backendUri.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
})();

/**
 * Instancia de Axios configurada para comunicar con la API del backend
 *
 * Configuración:
 * - baseURL: URL del servidor backend (desde .env)
 * - headers: Content-Type JSON por defecto
 */
const api = axios.create({
  baseURL: normalizedBase,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de request (peticiones)
 *
 * Propósito: Agregar el token JWT al header Authorization
 * El backend valida este token para verificar que la petición es de un usuario autorizado
 *
 * Flujo:
 * 1. Obtener el token del localStorage
 * 2. Si existe, agregarlo al header Authorization
 * 3. Continuar con la petición
 */
api.interceptors.request.use((config) => {
  // Obtener el token almacenado en el navegador del cliente
  const token = localStorage.getItem("token");

  // Si existe un token, agregarlo al header Authorization
  if (token && config.headers) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Interceptor de response (respuestas)
 *
 * Propósito: Manejar errores de autenticación y respuestas exitosas
 *
 * Casos especiales:
 * - 401 Unauthorized: Token inválido o expirado → Redirigir a login
 * - Otros errores: Dejar que el componente maneje el error
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No redirigir automáticamente en error 401 para evitar refresco
    return Promise.reject(error);
  },
);

export default api;
