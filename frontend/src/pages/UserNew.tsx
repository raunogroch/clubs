import { useState } from "react";
import { Input } from "../components";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { NavHeader } from "../components/NavHeader";
import { userService } from "../services/userServices";

export const UserNew = ({ name, sub }: pageParamProps) => {
  const [formData, setFormData] = useState({
    roles: [],
    ci: "",
    name: "",
    lastname: "",
    email: "",
    birth_date: "",
  });

  const [errors, setErrors] = useState({
    roles: [],
    ci: "",
    name: "",
    lastname: "",
    email: "",
    birth_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validación básica en tiempo real
    if (name === "email" && !value.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "Email inválido" }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    userService.create(formData);
  };

  return (
    <>
      <NavHeader name={name} sub={sub} />
      <form onSubmit={handleSubmit}>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Rol</label>
          <div className="col-sm-10">
            <div className="form-check">
              <Input
                type="radio"
                id="athlete"
                name="role"
                value="athlete"
                checked={formData.roles === "athlete"}
                onChange={handleChange}
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
                id="couch"
                name="role"
                value="couch"
                checked={formData.roles === "couch"}
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="couch" className="form-check-label">
                Couch / Entrenador
              </label>
            </div>
          </div>
        </div>

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
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Ej. Juan Luis ..."
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="form-control"
              max={new Date().toISOString().split("T")[0]} // No fechas futuras
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">
              Registrar Usuario
            </button>
          </div>
        </div>
      </form>
      ;
    </>
  );
};
