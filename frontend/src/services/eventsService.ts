/**
 * Servicio de Eventos (API)
 *
 * Maneja todas las llamadas HTTP relacionadas con eventos de grupos
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URI || "";
const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

export interface Event {
  _id: string;
  club_id: string;
  name: string;
  location?: string;
  duration: number;
  eventDate: string; // ISO date string
  eventTime: string; // HH:mm format
  suspended?: boolean; // Si el evento está suspendido (default: false)
  rescheduled?: boolean; // Si el evento fue reprogramado (default: false)
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  club_id: string;
  name: string;
  location?: string;
  duration: number;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
}

export interface UpdateEventRequest {
  name?: string;
  location?: string;
  duration?: number;
  eventDate?: string;
  eventTime?: string;
  suspended?: boolean;
  rescheduled?: boolean;
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

class EventsService {
  /**
   * Crear un nuevo evento
   * POST /api/events
   */
  async create(event: CreateEventRequest): Promise<Event> {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al crear el evento");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener todos los eventos de un grupo
   * GET /api/events/group/:groupId
   */
  async getByGroup(groupId: string): Promise<Event[]> {
    const response = await fetch(`${API_URL}/events/group/${groupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener los eventos");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener todos los eventos de un club
   * GET /api/events/club/:clubId
   */
  async getByClub(clubId: string): Promise<Event[]> {
    const response = await fetch(`${API_URL}/events/club/${clubId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener los eventos del club");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener un evento específico
   * GET /api/events/:eventId
   */
  async getById(eventId: string): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener el evento");
    }

    return safeParseJson(response);
  }

  /**
   * Actualizar un evento
   * PATCH /api/events/:eventId
   */
  async update(eventId: string, event: UpdateEventRequest): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al actualizar el evento");
    }

    return safeParseJson(response);
  }

  /**
   * Eliminar un evento
   * DELETE /api/events/:eventId
   */
  async delete(eventId: string): Promise<void> {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al eliminar el evento");
    }
  }
}

const eventsService = new EventsService();
export default eventsService;
