/**
 * Servicio de Asignaciones (API)
 *
 * Maneja todas las llamadas HTTP relacionadas con asignaciones de módulos
 * Solo el superadmin puede usar estos endpoints
 */

const API_URL = import.meta.env.VITE_BACKEND_URI;

export interface Assignment {
  _id: string;
  module_name: string;
  assigned_admins: string[];
  assigned_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAssignmentRequest {
  module_name: string;
  assigned_admins: string[];
}

export interface UpdateAssignmentRequest {
  module_name?: string;
  assigned_admins?: string[];
  is_active?: boolean;
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

class AssignmentsService {
  /**
   * Crear una nueva asignación de módulo
   * POST /api/assignments
   */
  async create(assignment: CreateAssignmentRequest): Promise<Assignment> {
    const response = await fetch(`${API_URL}/assignments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(assignment),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al crear la asignación");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener todas las asignaciones
   * GET /api/assignments
   */
  async getAll(): Promise<Assignment[]> {
    const response = await fetch(`${API_URL}/assignments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener las asignaciones");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener asignación por ID
   * GET /api/assignments/:id
   */
  async getById(id: string): Promise<Assignment> {
    const response = await fetch(`${API_URL}/assignments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener la asignación");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener asignación por nombre del módulo
   * GET /api/assignments/module/:moduleName
   */
  async getByModuleName(moduleName: string): Promise<Assignment> {
    const response = await fetch(
      `${API_URL}/assignments/module/${moduleName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener la asignación");
    }

    return safeParseJson(response);
  }

  /**
   * Actualizar asignación
   * PATCH /api/assignments/:id
   */
  async update(
    id: string,
    assignment: UpdateAssignmentRequest,
  ): Promise<Assignment> {
    const response = await fetch(`${API_URL}/assignments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(assignment),
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al actualizar la asignación");
    }

    return safeParseJson(response);
  }

  /**
   * Eliminar asignación
   * DELETE /api/assignments/:id
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/assignments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al eliminar la asignación");
    }

    return safeParseJson(response);
  }

  /**
   * Obtener módulos asignados al admin actual
   * GET /api/assignments/admin/modules
   */
  async getMyModules(): Promise<string[]> {
    const response = await fetch(`${API_URL}/assignments/admin/modules`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al obtener tus módulos");
    }

    return safeParseJson(response);
  }

  /**
   * Verificar si el admin actual tiene acceso a un módulo
   * GET /api/assignments/admin/access/:moduleName
   */
  async checkModuleAccess(
    moduleName: string,
  ): Promise<{ module: string; hasAccess: boolean }> {
    const response = await fetch(
      `${API_URL}/assignments/admin/access/${moduleName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      const error = await safeParseJson(response);
      throw new Error(error.message || "Error al verificar acceso");
    }

    return safeParseJson(response);
  }
}

export default new AssignmentsService();
