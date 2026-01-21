/**
 * Servicio de Grupos (API)
 *
 * Maneja todas las llamadas HTTP relacionadas con grupos
 * Solo los administradores de la asignación del club pueden acceder
 */

const API_URL = import.meta.env.VITE_BACKEND_URI;

export interface Group {
  _id: string;
  name: string;
  description?: string;
  club_id: string;
  created_by: string;
  members: string[];
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
   * Añadir un miembro a un grupo
   * POST /api/groups/:groupId/members/:memberId
   */
  async addMember(groupId: string, memberId: string): Promise<Group> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/members/${memberId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al añadir miembro");
    }

    return safeParseJson(response);
  }

  /**
   * Remover un miembro del grupo
   * DELETE /api/groups/:groupId/members/:memberId
   */
  async removeMember(groupId: string, memberId: string): Promise<Group> {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al remover miembro");
    }

    return safeParseJson(response);
  }
}

const groupsService = new GroupsService();
export default groupsService;
