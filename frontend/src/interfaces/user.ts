// ============================================================
// Tipos Base
// ============================================================

/**
 * Interfaz base para imágenes de usuario
 */
export interface UserImages {
  small: string;
  medium: string;
  large: string;
}

/**
 * Interfaz base compartida por todos los usuarios
 * Contiene los campos comunes que tienen todos los roles
 */
export interface BaseUser {
  _id?: string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: "male" | "female";
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  images?: UserImages;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// Interfaces de Referencia (para relaciones)
// ============================================================

/**
 * Referencia a un grupo
 */
export interface GroupReference {
  _id: string;
  name: string;
  club_id: string;
}

/**
 * Referencia a un coaching
 */
export interface CoachingReference {
  _id: string;
  name: string;
  lastname: string;
  ci?: string;
}

/**
 * Referencia a una asignación
 */
export interface AssignmentReference {
  _id: string;
  name: string;
}

// ============================================================
// Interfaces por Rol (Independientes con Campos Específicos)
// ============================================================

/**
 * Usuario Superadmin
 *
 * Descripción: Usuario con máximos permisos del sistema
 *
 * Campos específicos:
 * - role: "superadmin"
 * - Acceso a todo el sistema
 *
 * Permisos: Acceso total al sistema
 */
export interface UserSuperadmin {
  role: "superadmin";
  _id?: string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: "male" | "female";
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  images?: UserImages;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Usuario Admin
 *
 * Descripción: Usuario administrador con asignaciones a módulos específicos
 *
 * Campos específicos:
 * - role: "admin"
 * - assignment_id: ID de la asignación actual
 * - assignments: Lista de asignaciones disponibles
 *
 * Permisos: Gestión dentro de su(s) módulo(s) asignado(s)
 */
export interface UserAdmin {
  role: "admin";
  _id?: string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: "male" | "female";
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  images?: UserImages;
  createdAt?: string;
  updatedAt?: string;
  assignment_id?: string | null;
  assignments?: AssignmentReference[];
}

/**
 * Usuario Asistente
 *
 * Descripción: Usuario que asiste a entrenadores en entrenamientos
 *
 * Campos específicos:
 * - role: "assistant"
 * - sport: Deporte en el que asiste
 * - club: Club donde trabaja
 * - coaches: Lista de coaches a los que asiste
 * - groups: Grupos donde trabaja
 *
 * Permisos: Asistencia a coaches y grupos
 */
export interface UserAssistant {
  role: "assistant";
  _id?: string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: "male" | "female";
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  images?: UserImages;
  createdAt?: string;
  updatedAt?: string;
  sport?: string;
  club?: string;
  coaches?: CoachingReference[];
  groups?: GroupReference[];
}

/**
 * Usuario Entrenador/Coach
 *
 * Descripción: Usuario que gestiona atletas y grupos de entrenamiento
 *
 * Campos específicos:
 * - role: "coach"
 * - sport: Deporte que enseña
 * - club: Club principal
 * - athletes: Atletas bajo su supervisión
 * - groups: Grupos que dirige
 *
 * Permisos: Gestión de atletas y grupos asignados
 */
export interface UserCoach {
  role: "coach";
  _id?: string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: "male" | "female";
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  images?: UserImages;
  createdAt?: string;
  updatedAt?: string;
  sport?: string;
  club?: string;
  athletes?: CoachingReference[];
  groups?: GroupReference[];
}

/**
 * Usuario Padre/Responsable
 *
 * Descripción: Usuario padre o responsable de atletas menores
 *
 * Campos específicos:
 * - role: "parent"
 * - athletes: Hijos/atletas bajo su responsabilidad
 *
 * Permisos: Visualización de información de sus hijos/atletas
 */
export interface UserParent {
  role: "parent";
  _id?: string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: "male" | "female";
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  images?: UserImages;
  createdAt?: string;
  updatedAt?: string;
  athletes?: CoachingReference[];
}

/**
 * Usuario Atleta
 *
 * Descripción: Usuario deportista con información física y de entrenamiento
 *
 * Campos específicos:
 * - role: "athlete"
 * - height: Altura en cm
 * - weight: Peso en kg
 * - sport: Deporte que practica
 * - club: Club de pertenencia
 * - coaches: Entrenadores asignados
 * - groups: Grupos de entrenamiento
 *
 * Permisos: Acceso a su información y entrenamientos asignados
 */
export interface UserAthlete {
  role: "athlete";
  _id?: string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: "male" | "female";
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  images?: UserImages;
  createdAt?: string;
  updatedAt?: string;
  height?: number;
  weight?: number;
  sport?: string;
  club?: string;
  coaches?: CoachingReference[];
  groups?: GroupReference[];
}

// ============================================================
// Tipo Unión de Todos los Usuarios
// ============================================================

/**
 * Tipo union de todos los roles de usuario
 */
export type User =
  | UserSuperadmin
  | UserAdmin
  | UserAssistant
  | UserCoach
  | UserParent
  | UserAthlete;

/**
 * Usuario autenticado con información de sesión
 */
export type AuthUser = User & {
  token?: string;
};

// ============================================================
// Tipos de Error y Props
// ============================================================

export type UserErrors = {
  [key in keyof BaseUser]?: string;
};

export interface UserFormProps {
  user?: User;
  onSuccess?: (role?: string) => void;
  onCancel?: () => void;
}

export interface UsersPageProps {
  name: string;
  sub?: string;
  edit?: boolean;
  restore?: boolean;
  remove?: boolean;
  delete?: boolean;
}
