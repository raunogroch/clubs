/**
 * Tipos y Interfaces para el módulo de Grupos
 *
 * Define las estructuras de datos utilizadas en toda la funcionalidad de grupos.
 * Esto centraliza los tipos para mayor mantenibilidad.
 */

/**
 * Información de un deporte
 */
export interface Sport {
  _id: string;
  name: string;
  active: boolean;
}

/**
 * Información de un usuario (Coach, Atleta, etc.)
 */
export interface User {
  _id: string;
  name?: string;
  lastname?: string;
  username?: string;
  role?: string;
  ci?: string;
  phone?: string;
  images?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

/**
 * Información de un miembro del grupo (caché local)
 */
export interface MemberDetail {
  name: string;
  lastname: string;
  role: string;
  ci?: string;
}

/**
 * Horario de una sesión de grupo
 */
export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

/**
 * Grupo de deportistas/entrenadores
 */
export interface Group {
  _id: string;
  name: string;
  club_id: string;
  monthly_fee?: number;
  created_by: string;
  athletes?: string[];
  athletes_added?: Array<{
    _id: string;
    athlete_id?: User | string;
    registration_pay?: boolean;
    registration_date?: string;
  }>;
  coaches: string[];
  members?: string[]; // legacy support
  schedule?: Schedule[];
  levels?: Array<{
    _id?: string;
    position: number;
    name: string;
    description?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request para crear un grupo
 */
export interface CreateGroupRequest {
  name: string;
  club_id: string;
  monthly_fee?: number;
}

/**
 * Request para actualizar un grupo
 */
export interface UpdateGroupRequest {
  name?: string;
  monthly_fee?: number;
}

/**
 * Estados de los formularios de grupo
 */
export interface GroupFormState {
  name: string;
  club_id: string;
  monthly_fee?: number;
}

/**
 * Tipos de miembros que se pueden agregar
 */
export type MemberType = "coach" | "athlete";

/**
 * Estados de la búsqueda de usuarios
 */
export interface UserSearchState {
  ci: string;
  result: User | null;
  loading: boolean;
  showCreateForm: boolean;
}

/**
 * Datos para crear un nuevo usuario
 */
export interface CreateUserData {
  name: string;
  lastname: string;
  ci: string;
  username: string;
}

/**
 * Días de la semana en español
 */
export enum DayName {
  Monday = "Lunes",
  Tuesday = "Martes",
  Wednesday = "Miércoles",
  Thursday = "Jueves",
  Friday = "Viernes",
  Saturday = "Sábado",
  Sunday = "Domingo",
}

export enum MemberRole {
  "superadmin" = "Superadministrador(a)",
  "admin" = "Administrador(a)",
  "coach" = "Entrenador(a)",
  "assistant" = "Asistente(a)",
}
