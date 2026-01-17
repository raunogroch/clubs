import { FormField, TextAreaField } from ".";
import { useClubForm } from "../hooks";
import { SelectorList } from "../../../components";
import type { ClubFormProps } from "../interfaces";
import { useClubCatalogs } from "../../../hooks";

export const ClubForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ClubFormProps) => {
  const { formData, errors, handleChange, handleSubmit } =
    useClubForm(initialData);

  const { sports } = useClubCatalogs();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <FormField
          title="Nombre del Club"
          type="text"
          name="name"
          value={formData.name}
          error={errors.name}
          handleChange={handleChange}
          placeholder="Nombre..."
        />

        <SelectorList
          name="sport"
          label="Disciplina deportiva"
          selected={formData.sport}
          items={sports}
          errors={errors.sport}
          onItemsChange={(sportId) =>
            handleChange({
              target: { name: "sport", value: sportId },
            } as any)
          }
        />

        <FormField
          title="Mensualidad"
          type="number"
          name="monthly_pay"
          value={String(formData.monthly_pay)}
          error={errors.monthly_pay}
          handleChange={handleChange}
          placeholder="Monto en Bs."
        />

        <TextAreaField
          title="Descripcion del Club"
          name="description"
          value={formData.description}
          error={errors.description}
          handleChange={handleChange}
          placeholder="Descripcion..."
          type={"text"}
        />

        <div className="hr-line-dashed"></div>

        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            <button type="submit" className="btn btn-primary mr-2">
              {initialData ? "Actualizar" : "Crear"} Club
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
