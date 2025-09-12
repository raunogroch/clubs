import { UserRoleSelector } from ".";
import { useUserForm } from "../hooks";
import type { UserFormProps } from "../interfaces";
import { Input, ImageCropperWithInput } from "../../../components";
export const UserForm = ({ user, onCancel, onSuccess }: UserFormProps) => {
  const { formData, errors, handleChange, handleSubmit } = useUserForm(user);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group row">
          <label htmlFor="image" className="col-sm-2 col-form-label">
            Foto
          </label>
          <div className="col-sm-10">
            <ImageCropperWithInput
              value={formData.image}
              onChange={handleChange}
            />
          </div>
        </div>

        <UserRoleSelector
          selectedRole={formData.role}
          onRoleChange={(role) =>
            handleChange({ target: { name: "role", value: role } } as any)
          }
          onError={errors.role}
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
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="password" className="col-sm-2 col-form-label">
            Contraseña
          </label>
          <div className="col-sm-10">
            <Input
              type={formData._id ? "password" : "text"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
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
            />
            {errors.birth_date && (
              <div className="invalid-feedback">{errors.birth_date}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            <button type="submit" className="btn btn-primary mr-2">
              {user ? "Actualizar" : "Crear"} Usuario
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
