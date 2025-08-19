import { AxiosError } from "axios";

/**
 * Estructura estándar para las respuestas de la API.
 * @template T Tipo de datos que retorna la API.
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Maneja los errores provenientes de Axios y los transforma en ApiResponse.
 * @param error - Error lanzado por Axios.
 * @returns ApiResponse con información del error.
 */
export function handleApiError(error: AxiosError): ApiResponse {
  if (error.response) {
    // Verificación de tipo segura
    const responseData = error.response.data;
    const message =
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
        ? (responseData as { message: string }).message
        : "Error en la solicitud";

    const errors =
      typeof responseData === "object" &&
      responseData !== null &&
      "errors" in responseData
        ? (responseData as { errors: Record<string, string> }).errors
        : undefined;

    return {
      code: error.response.status,
      message,
      errors,
    };
  } else if (error.request) {
    return {
      code: 500,
      message: "Error de conexión con el servidor",
    };
  } else {
    return {
      code: 500,
      message: "Error al configurar la solicitud",
    };
  }
}
