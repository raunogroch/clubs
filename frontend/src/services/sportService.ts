/**
 * Servicio de Sports (API)
 *
 * Maneja todas las llamadas HTTP relacionadas con deportes
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URI || "";
const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

export interface Sport {
  _id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSportRequest {
  name: string;
}

export interface UpdateSportRequest {
  name?: string;
  active?: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

/**
 * Helper para parsear JSON de forma segura
 */
async function safeParseJson(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Respuesta inválida del servidor: ${text || "Vacía"}`);
  }

  try {
    return await response.json();
  } catch (e) {
    const text = await response.text();
    throw new Error(`Error al parsear JSON: ${text || "Respuesta vacía"}`);
  }
}

class SportsService {
  /**
   * Obtiene todos los deportes
   */
  async getAll(): Promise<Sport[]> {
    const response = await fetch(`${API_URL}/sports`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(
        error.message || `Error al obtener deportes: ${response.status}`,
      );
    }

    return safeParseJson(response);
  }

  /**
   * Obtiene un deporte por ID
   */
  async getById(id: string): Promise<Sport> {
    const response = await fetch(`${API_URL}/sports/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(
        error.message || `Error al obtener deporte: ${response.status}`,
      );
    }

    return safeParseJson(response);
  }

  /**
   * Crea un nuevo deporte
   */
  async create(data: CreateSportRequest): Promise<Sport> {
    const response = await fetch(`${API_URL}/sports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(
        error.message || `Error al crear deporte: ${response.status}`,
      );
    }

    return safeParseJson(response);
  }

  /**
   * Actualiza un deporte existente
   */
  async update(id: string, data: UpdateSportRequest): Promise<Sport> {
    const response = await fetch(`${API_URL}/sports/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(
        error.message || `Error al actualizar deporte: ${response.status}`,
      );
    }

    return safeParseJson(response);
  }

  /**
   * Elimina un deporte
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/sports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(
        error.message || `Error al eliminar deporte: ${response.status}`,
      );
    }
  }

  /**
   * Restaura un deporte (reactiva)
   */
  async restore(id: string): Promise<Sport> {
    const response = await fetch(`${API_URL}/sports/${id}/restore`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(
        error.message || `Error al restaurar deporte: ${response.status}`,
      );
    }

    return safeParseJson(response);
  }
}

export const sportService = new SportsService();
export default sportService;
