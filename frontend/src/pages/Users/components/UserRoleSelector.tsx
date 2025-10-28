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
            onChange={(e) => onRoleChange(e.target.value)}
          >
            <option value="">Seleccione un rol para el usuario</option>
            <option value="athlete">Deportista</option>
            <option value="parent">Responsable</option>
            <option value="coach">Entrenador</option>
            <option value="assistant">Asistente</option>
            <option value="admin">Administrador</option>
            <option value="superadmin">Super Administrador</option>
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
