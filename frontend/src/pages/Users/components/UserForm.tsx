import { Input, CustomMessage } from "../../../components";
import { useUserForm } from "../hooks/useUserForm";
import type { UserFormProps } from "../types/userTypes";
import { UserRoleSelector } from "./UserRoleSelector";

export const UserForm = ({
  initialData,
  onSuccess,
  onCancel,
}: UserFormProps) => {
  const { formData, errors, message, handleChange, handleSubmit } =
    useUserForm(initialData);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  return (
    <div>
      {message && <CustomMessage message={message.text} kind={message.type} />}

      <form onSubmit={onSubmit}>
        <UserRoleSelector
          selectedRole={formData.role}
          onRoleChange={(role) =>
            handleChange({ target: { name: "role", value: role } } as any)
          }
        />

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
              placeholder="Ej. Juan ..."
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
              placeholder="Ej. Madrigal ..."
              required
            />
            {errors.lastname && (
              <div className="invalid-feedback">{errors.lastname}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="email" className="col-sm-2 col-form-label">
            Correo electronico
          </label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Ej. Madrigal ..."
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="username" className="col-sm-2 col-form-label">
            Username
          </label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Ej. usuario123 ..."
              required
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="ci" className="col-sm-2 col-form-label">
            Cedula de identidad
          </label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="ci"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              className={`form-control ${errors.ci ? "is-invalid" : ""}`}
              placeholder="Ej. 1234567, 1234567-1Aº ..."
              required
            />
            {errors.ci && <div className="invalid-feedback">{errors.ci}</div>}
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
              className={`form-control ${
                errors.birth_date ? "is-invalid" : ""
              }`}
              placeholder="Ej. usuario123 ..."
              required
            />
            {errors.birth_date && (
              <div className="invalid-feedback">{errors.birth_date}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="height" className="col-sm-2 col-form-label">
            Altura
          </label>
          <div className="col-sm-10">
            <Input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className={`form-control ${errors.height ? "is-invalid" : ""}`}
              placeholder="Ej. 1.47"
            />
            {errors.height && (
              <div className="invalid-feedback">{errors.height}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="weight" className="col-sm-2 col-form-label">
            Peso
          </label>
          <div className="col-sm-10">
            <Input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={`form-control ${errors.weight ? "is-invalid" : ""}`}
              placeholder="Ej. 54 ..."
              required
            />
            {errors.weight && (
              <div className="invalid-feedback">{errors.weight}</div>
            )}
          </div>
        </div>

        {/* Resto de los campos del formulario... */}

        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            <button type="submit" className="btn btn-primary mr-2">
              {initialData ? "Actualizar" : "Crear"} Usuario
            </button>
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
