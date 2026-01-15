/**
 * Configuración de campos requeridos y opcionales para cada rol
 */

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "date"
  | "select"
  | "textarea"
  | "tel";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  pattern?: string;
  help?: string;
}

export interface RoleFieldsConfig {
  [role: string]: {
    fields: FieldConfig[];
    requiresUsername: boolean;
    requiresPassword: boolean;
  };
}

const commonFields: FieldConfig[] = [
  {
    name: "name",
    label: "Nombres",
    type: "text",
    required: true,
    placeholder: "Ej: Juan",
  },
  {
    name: "lastname",
    label: "Apellidos",
    type: "text",
    required: true,
    placeholder: "Ej: Pérez García",
  },
  {
    name: "ci",
    label: "Carnet de Identidad",
    type: "text",
    required: false,
    placeholder: "Ej: 12345678",
  },
];

const credentialsFields: FieldConfig[] = [
  {
    name: "username",
    label: "Nombre de Usuario",
    type: "text",
    required: true,
    placeholder: "Ej: juan.perez",
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    required: true,
    help: "Mínimo 6 caracteres",
  },
];

export const roleFieldsConfig: RoleFieldsConfig = {
  superadmin: {
    requiresUsername: true,
    requiresPassword: true,
    fields: [
      ...commonFields,
      {
        name: "middle_name",
        label: "Nombre del Medio (opcional)",
        type: "text",
        required: false,
        placeholder: "Ej: Miguel",
      },
      ...credentialsFields,
    ],
  },

  admin: {
    requiresUsername: true,
    requiresPassword: true,
    fields: [
      ...commonFields,
      {
        name: "middle_name",
        label: "Nombre del Medio (opcional)",
        type: "text",
        required: false,
        placeholder: "Ej: Miguel",
      },
      ...credentialsFields,
    ],
  },

  coach: {
    requiresUsername: true,
    requiresPassword: true,
    fields: [
      ...commonFields,
      {
        name: "middle_name",
        label: "Nombre del Medio (opcional)",
        type: "text",
        required: false,
        placeholder: "Ej: Miguel",
      },
      ...credentialsFields,
    ],
  },

  assistant: {
    requiresUsername: true,
    requiresPassword: true,
    fields: [
      ...commonFields,
      {
        name: "middle_name",
        label: "Nombre del Medio (opcional)",
        type: "text",
        required: false,
        placeholder: "Ej: Miguel",
      },
      ...credentialsFields,
    ],
  },

  athlete: {
    requiresUsername: true,
    requiresPassword: true,
    fields: [
      ...commonFields,
      {
        name: "middle_name",
        label: "Nombre del Medio (opcional)",
        type: "text",
        required: false,
        placeholder: "Ej: Miguel",
      },
      {
        name: "gender",
        label: "Género (opcional)",
        type: "select",
        required: false,
      },
      {
        name: "birth_date",
        label: "Fecha de Nacimiento (opcional)",
        type: "date",
        required: false,
      },
      ...credentialsFields,
    ],
  },

  parent: {
    requiresUsername: false,
    requiresPassword: false,
    fields: [
      ...commonFields,
      {
        name: "middle_name",
        label: "Nombre del Medio (opcional)",
        type: "text",
        required: false,
        placeholder: "Ej: Miguel",
      },
      {
        name: "phone",
        label: "Teléfono (opcional)",
        type: "tel",
        required: false,
        placeholder: "Ej: +1 234 567 8900",
      },
    ],
  },
};

/**
 * Obtiene la configuración de campos para un rol específico
 */
export const getFieldsForRole = (role: string): FieldConfig[] => {
  const config = roleFieldsConfig[role];
  return config?.fields || [];
};

/**
 * Verifica si un rol requiere username y password
 */
export const doesRoleRequireCredentials = (role: string): boolean => {
  const config = roleFieldsConfig[role];
  return config?.requiresUsername && config?.requiresPassword;
};

/**
 * Obtiene todos los nombres de campos para un rol
 */
export const getFieldNamesForRole = (role: string): string[] => {
  return getFieldsForRole(role).map((field) => field.name);
};
