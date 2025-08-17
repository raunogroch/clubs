import { Input } from "../../components";
import type { UserData, UserErrors } from "./FormUser";

interface UserPersonalInfoProps {
  formData: UserData;
  errors: UserErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserPersonalInfo = ({
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
        <label htmlFor="email" className="col-sm-2 col-form-label">
          Correo Electrónico
        </label>
        <div className="col-sm-10">
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="email@ejemplo.com"
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
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
