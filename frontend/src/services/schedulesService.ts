/**
 * Servicio de Schedules (API)
 *
 * Maneja todas las llamadas HTTP relacionadas con schedules
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URI || "";
const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

interface Schedule {
  _id: string;
  group_id: string;
  day: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateScheduleRequest {
  day: string;
  startTime: string;
  endTime: string;
}

interface UpdateScheduleRequest {
  day?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * Helper para parsear JSON de forma segura
 */
async function safeParseJson(response: Response) {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(
      `Respuesta inválida: se esperaba JSON pero se recibió ${contentType}`,
    );
  }
  return response.json();
}

class SchedulesService {
  /**
   * Crear nuevo schedule
   * POST /api/groups/:groupId/schedules
   */
  async create(
    groupId: string,
    schedule: CreateScheduleRequest,
  ): Promise<Schedule> {
    const response = await fetch(`${API_URL}/groups/${groupId}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(schedule),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al crear schedule");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener todos los schedules de un grupo
   * GET /api/groups/:groupId/schedules
   */
  async getByGroupId(groupId: string): Promise<Schedule[]> {
    const response = await fetch(`${API_URL}/groups/${groupId}/schedules`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener schedules");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener un schedule específico
   * GET /api/groups/:groupId/schedules/:scheduleId
   */
  async getById(groupId: string, scheduleId: string): Promise<Schedule> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/schedules/${scheduleId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error al obtener schedule");
    }

    return safeParseJson(response);
  }

  /**
   * Actualizar un schedule
   * PATCH /api/groups/:groupId/schedules/:scheduleId
   */
  async update(
    groupId: string,
    scheduleId: string,
    schedule: UpdateScheduleRequest,
  ): Promise<Schedule> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/schedules/${scheduleId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(schedule),
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al actualizar schedule");
    }

    return safeParseJson(response);
  }

  /**
   * Eliminar un schedule
   * DELETE /api/groups/:groupId/schedules/:scheduleId
   */
  async delete(groupId: string, scheduleId: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/schedules/${scheduleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al eliminar schedule");
    }
  }

  /**
   * Reemplazar todos los schedules de un grupo (batch)
   * POST /api/groups/:groupId/schedules/batch
   */
  async replaceBatch(
    groupId: string,
    schedules: CreateScheduleRequest[],
  ): Promise<Schedule[]> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/schedules/batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ schedules }),
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al actualizar schedules");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener todos los schedules para el calendario del admin
   * GET /api/groups/admin/schedules
   * Endpoint optimizado para mejor rendimiento
   */
  async getAdminSchedules(): Promise<any[]> {
    const response = await fetch(`${API_URL}/groups/admin/schedules`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener horarios");
    }

    return safeParseJson(response);
  }
}

const schedulesService = new SchedulesService();
export default schedulesService;
