import { Input } from "../../../components";
import type { SportFormProps } from "../interfaces/sportTypes";
import { useSportForm } from "../hook/useSportForm";

export const SportForm = ({
  initialData,
  onSuccess,
  onCancel,
}: SportFormProps) => {
  const { formData, errors, handleChange, handleSubmit } =
    useSportForm(initialData);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success) onSuccess();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group row">
          <label htmlFor="name" className="col-sm-2 col-form-label">
            Nombre
          </label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Ej. Atletismo ..."
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            <button type="submit" className="btn btn-primary mr-2">
              {initialData ? "Actualizar" : "Crear"}
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
