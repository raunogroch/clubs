import { Role, type UserFormProps } from "../interfaces";
import { UserRoleSelector } from "../pages/Users/components";
import { useUserForm } from "../pages/Users/hooks";
import { DynamicFormField } from "./DynamicFormField";
import { getFieldsForRole } from "../config/roleFieldsConfig";

export const GenericUserForm = ({
  user,
  onCancel,
  onSuccess,
}: UserFormProps) => {
  const { formData, errors, handleChange, handleSubmit } = useUserForm(user);
  const roleFields = getFieldsForRole(formData.role);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success && onSuccess) onSuccess(formData.role); // Pass role to onSuccess
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <UserRoleSelector
          selectedRole={formData.role as Role}
          onRoleChange={(role) =>
            handleChange({
              target: { name: "role", value: role },
            } as unknown as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
          }
          onError={errors.role}
        />

        {formData.role && (
          <>
            {roleFields.map((field) => (
              <DynamicFormField
                key={field.name}
                field={field}
                value={formData[field.name as keyof typeof formData]}
                error={(errors as any)[field.name]}
                onChange={handleChange}
                isEditing={!!user}
              />
            ))}
          </>
        )}

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

export default GenericUserForm;
