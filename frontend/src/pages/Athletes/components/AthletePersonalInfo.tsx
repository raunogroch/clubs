import { Input } from "../../../components";
import type { User, UserErrors } from "../../../interfaces";

interface UserPersonalInfoProps {
  formData: User;
  errors: UserErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AthletePersonalInfo = ({
  formData,
  errors,
  onChange,
}: UserPersonalInfoProps) => {
  return (
    <>
      <div className="form-group row">
        <label htmlFor="name" className="col-sm-2 col-form-label">
          Nombres
        </label>
        <div className="col-sm-10">
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Ej. Juan Luis ..."
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="lastname" className="col-sm-2 col-form-label">
          Apellidos
        </label>
        <div className="col-sm-10">
          <Input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={onChange}
            className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
            placeholder="Ej. lopez loayza"
            required
          />
          {errors.lastname && (
            <div className="invalid-feedback">{errors.lastname}</div>
          )}
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="ci" className="col-sm-2 col-form-label">
          Cédula de identidad
        </label>
        <div className="col-sm-10">
          <Input
            type="text"
            id="ci"
            name="ci"
            value={formData.ci}
            onChange={onChange}
            className={`form-control ${errors.ci ? "is-invalid" : ""}`}
            placeholder="ej. 12345678, 12345678-a1"
            required
          />
          {errors.ci && <div className="invalid-feedback">{errors.ci}</div>}
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="username" className="col-sm-2 col-form-label">
          Nombre de usuario
        </label>
        <div className="col-sm-10">
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={onChange}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            placeholder="nick123, "
            required
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="birth_date" className="col-sm-2 col-form-label">
          Fecha de nacimiento
        </label>
        <div className="col-sm-10">
          <Input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={onChange}
            className="form-control"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>
    </>
  );
};
