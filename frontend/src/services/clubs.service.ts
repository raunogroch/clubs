/**
 * Servicio de Clubs (API)
 *
 * Maneja todas las llamadas HTTP relacionadas con clubs
 * Solo los administradores con assignments asignados pueden acceder
 */

const API_URL = import.meta.env.VITE_BACKEND_URI;

export interface Club {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  assignment_id: string;
  created_by: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClubRequest {
  name: string;
  description?: string;
  location?: string;
  assignment_id: string;
}

export interface UpdateClubRequest {
  name?: string;
  description?: string;
  location?: string;
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

class ClubsService {
  /**
   * Crear un nuevo club
   * POST /api/clubs
   */
  async create(club: CreateClubRequest): Promise<Club> {
    const response = await fetch(`${API_URL}/clubs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(club),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al crear el club");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener todos los clubs del usuario actual (sus assignments)
   * GET /api/clubs
   */
  async getAll(): Promise<Club[]> {
    const response = await fetch(`${API_URL}/clubs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener los clubs");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener club por ID
   * GET /api/clubs/:id
   */
  async getById(id: string): Promise<Club> {
    const response = await fetch(`${API_URL}/clubs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener el club");
    }

    return safeParseJson(response);
  }

  /**
   * Actualizar un club
   * PATCH /api/clubs/:id
   */
  async update(id: string, club: UpdateClubRequest): Promise<Club> {
    const response = await fetch(`${API_URL}/clubs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(club),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al actualizar el club");
    }

    return safeParseJson(response);
  }

  /**
   * Eliminar un club
   * DELETE /api/clubs/:id
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/clubs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al eliminar el club");
    }
  }

  /**
   * Agregar miembro a un club
   * POST /api/clubs/:clubId/members/:memberId
   */
  async addMember(clubId: string, memberId: string): Promise<Club> {
    const response = await fetch(
      `${API_URL}/clubs/${clubId}/members/${memberId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al agregar miembro");
    }

    return safeParseJson(response);
  }

  /**
   * Remover miembro de un club
   * DELETE /api/clubs/:clubId/members/:memberId
   */
  async removeMember(clubId: string, memberId: string): Promise<Club> {
    const response = await fetch(
      `${API_URL}/clubs/${clubId}/members/${memberId}`,
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

const clubsService = new ClubsService();
export default clubsService;
