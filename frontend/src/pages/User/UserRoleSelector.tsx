import { Input } from "../../components";

interface UserRoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

export const UserRoleSelector = ({
  selectedRole,
  onRoleChange,
}: UserRoleSelectorProps) => {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Rol</label>
      <div className="col-sm-10">
        <div className="form-check">
          <Input
            type="radio"
            id="athlete"
            name="role"
            value="athlete"
            checked={selectedRole === "athlete"}
            onChange={() => onRoleChange("athlete")}
            className="form-check-input"
          />
          <label htmlFor="athlete" className="form-check-label">
            Atleta / Deportista
          </label>
        </div>
        <br />
        <div className="form-check">
          <Input
            type="radio"
            id="coach"
            name="role"
            value="coach"
            checked={selectedRole === "coach"}
            onChange={() => onRoleChange("coach")}
            className="form-check-input"
          />
          <label htmlFor="coach" className="form-check-label">
            Coach / Entrenador
          </label>
        </div>
        <div className="form-check">
          <Input
            type="radio"
            id="parent"
            name="role"
            value="parent"
            checked={selectedRole === "parent"}
            onChange={() => onRoleChange("parent")}
            className="form-check-input"
          />
          <label htmlFor="parent" className="form-check-label">
            Tutor
          </label>
        </div>
      </div>
    </div>
  );
};
