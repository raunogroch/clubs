/**
 * Servicio de Grupos (API)
 *
 * Maneja todas las llamadas HTTP relacionadas con grupos
 * Solo los administradores de la asignación del club pueden acceder
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URI || "";
const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

export interface Group {
  _id: string;
  name: string;
  description?: string;
  club_id: string;
  created_by: string;
  athletes: string[];
  coaches: string[];
  members?: string[]; // legacy support
  schedule?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  club_id: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
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

class GroupsService {
  /**
   * Crear un nuevo grupo
   * POST /api/groups
   */
  async create(group: CreateGroupRequest): Promise<Group> {
    const response = await fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al crear el grupo");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener todos los grupos de un club
   * GET /api/groups/club/:clubId
   */
  async getByClub(clubId: string): Promise<Group[]> {
    const response = await fetch(`${API_URL}/groups/club/${clubId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener los grupos");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener un grupo específico
   * GET /api/groups/:groupId
   */
  async getById(groupId: string): Promise<Group> {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener el grupo");
    }

    return safeParseJson(response);
  }

  /**
   * Actualizar un grupo
   * PATCH /api/groups/:groupId
   */
  async update(groupId: string, group: UpdateGroupRequest): Promise<Group> {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al actualizar el grupo");
    }

    return safeParseJson(response);
  }

  /**
   * Eliminar un grupo
   * DELETE /api/groups/:groupId
   */
  async delete(groupId: string): Promise<void> {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al eliminar el grupo");
    }
  }

  /**
   * Añadir un atleta a un grupo
   * POST /api/groups/:groupId/athletes/:athleteId
   */
  async addAthlete(groupId: string, athleteId: string): Promise<Group> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/athletes/${athleteId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      let errorMessage = "Error al añadir atleta";
      try {
        const error = await safeParseJson(response);
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return safeParseJson(response);
  }

  /**
   * Remover un atleta del grupo
   * DELETE /api/groups/:groupId/athletes/:athleteId
   */
  async removeAthlete(groupId: string, athleteId: string): Promise<Group> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/athletes/${athleteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al remover atleta");
    }

    return safeParseJson(response);
  }

  /**
   * Añadir un entrenador a un grupo
   * POST /api/groups/:groupId/coaches/:coachId
   */
  async addCoach(groupId: string, coachId: string): Promise<Group> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/coaches/${coachId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      let errorMessage = "Error al añadir entrenador";
      try {
        const error = await safeParseJson(response);
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return safeParseJson(response);
  }

  /**
   * Remover un entrenador del grupo
   * DELETE /api/groups/:groupId/coaches/:coachId
   */
  async removeCoach(groupId: string, coachId: string): Promise<Group> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/coaches/${coachId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al remover entrenador");
    }

    return safeParseJson(response);
  }

  /**
   * Añadir un miembro a un grupo (legacy)
   * POST /api/groups/:groupId/members/:memberId
   */
  async addMember(
    groupId: string,
    memberId: string,
    role?: string,
  ): Promise<Group> {
    const url = new URL(`${API_URL}/groups/${groupId}/members/${memberId}`);
    if (role) {
      url.searchParams.append("role", role);
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      let errorMessage = "Error al añadir miembro";
      try {
        const error = await safeParseJson(response);
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return safeParseJson(response);
  }

  /**
   * Remover un miembro del grupo (legacy)
   * DELETE /api/groups/:groupId/members/:memberId
   */
  async removeMember(
    groupId: string,
    memberId: string,
    role?: string,
  ): Promise<Group> {
    const url = new URL(`${API_URL}/groups/${groupId}/members/${memberId}`);
    if (role) {
      url.searchParams.append("role", role);
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return safeParseJson(response);
  }

  /**
   * Agregar horario a un grupo
   * POST /api/groups/:groupId/schedule
   */
  async addSchedule(
    groupId: string,
    day: string,
    startTime: string,
    endTime: string,
  ): Promise<Group> {
    const response = await fetch(`${API_URL}/groups/${groupId}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        day,
        startTime,
        endTime,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Error al agregar horario";
      try {
        const error = await safeParseJson(response);
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return safeParseJson(response);
  }

  /**
   * Remover horario de un grupo
   * DELETE /api/groups/:groupId/schedule/:index
   */
  async removeSchedule(groupId: string, scheduleIndex: number): Promise<Group> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/schedule/${scheduleIndex}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al remover horario");
    }

    return safeParseJson(response);
  }
}

const groupsService = new GroupsService();
export default groupsService;
