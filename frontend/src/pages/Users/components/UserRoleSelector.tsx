// use plain string for role keys (e.g. 'athlete', 'parent', 'coach', ...)
interface UserRoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onError?: string;
}

export const UserRoleSelector = ({
  selectedRole,
  onRoleChange,
  onError,
}: UserRoleSelectorProps) => {
  // Intenta obtener el rol del usuario actual desde localStorage
  const getCurrentUserRole = (): string | undefined => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return undefined;
      const u = JSON.parse(raw);
      return u?.role as string | undefined;
    } catch {
      return undefined;
    }
  };

  const currentRole = getCurrentUserRole();

  // Definir las opciones permitidas según el rol del usuario actual
  const options: { value: string; label: string }[] =
    currentRole === "superadmin"
      ? [
          { value: "", label: "Seleccione un rol para el usuario" },
          { value: "superadmin", label: "Super Administrador" },
          { value: "admin", label: "Administrador" },
          { value: "assistant", label: "Asistente" },
          { value: "coach", label: "Entrenador" },
          { value: "parent", label: "Tutor" },
          { value: "athlete", label: "Deportista" },
        ]
      : currentRole === "admin"
      ? [
          { value: "", label: "Seleccione un rol para el usuario" },
          { value: "admin", label: "Administrador" },
          { value: "assistant", label: "Asistente" },
          { value: "coach", label: "Entrenador" },
          { value: "parent", label: "Tutor" },
          { value: "athlete", label: "Deportista" },
        ]
      : currentRole === "assistant"
      ? [
          { value: "parent", label: "Tutor" },
          { value: "athlete", label: "Deportista" },
        ]
      : [
          // Fallback: mostrar las mismas opciones que admin para evitar bloquear la creación
          { value: "", label: "Seleccione un rol para el usuario" },
          { value: "admin", label: "Administrador" },
          { value: "assistant", label: "Asistente" },
          { value: "coach", label: "Entrenador" },
          { value: "parent", label: "Tutor" },
          { value: "athlete", label: "Deportista" },
        ];

  return (
    <>
      <div className="form-group row">
        <label htmlFor="name" className="col-sm-2 col-form-label">
          Roles
        </label>
        <div className="col-sm-10">
          <select
            className={`form-control${onError ? " is-invalid" : ""}`}
            name="role"
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value as string)}
          >
            {options.map((opt) => (
              <option key={opt.value || "empty"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {onError && (
            <div className="invalid-feedback" style={{ display: "block" }}>
              {onError}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
