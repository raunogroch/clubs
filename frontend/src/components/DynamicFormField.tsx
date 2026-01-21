import { Input } from ".";
import type { FieldConfig } from "../config/roleFieldsConfig";

interface DynamicFormFieldProps {
  field: FieldConfig;
  value: any;
  error?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const genderOptions = [
  { value: "", label: "Seleccione" },
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
];

export const DynamicFormField = ({
  field,
  value,
  error,
  onChange,
}: DynamicFormFieldProps) => {
  const inputClassName = `form-control ${error ? "is-invalid" : ""}`;

  // Map custom field types to HTML input types
  const getInputType = (): string => {
    if (field.type === "tel") {
      return field.type;
    }
    if (field.type === "date") {
      return "date";
    }
    if (field.type === "password") {
      return "password";
    }
    if (field.type === "textarea") {
      return "text";
    }
    return "text";
  };

  return (
    <div className="form-group row">
      <label htmlFor={field.name} className="col-sm-2 col-form-label">
        {field.label}
        {field.required && <span className="text-danger">*</span>}
      </label>
      <div className="col-sm-10">
        {field.type === "select" ? (
          <select
            id={field.name}
            name={field.name}
            value={value || ""}
            onChange={onChange}
            className={inputClassName}
          >
            {field.name === "gender" &&
              genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            id={field.name}
            name={field.name}
            value={value || ""}
            onChange={onChange as any}
            placeholder={field.placeholder}
            className={inputClassName}
          />
        ) : (
          <Input
            type={getInputType() as any}
            id={field.name}
            name={field.name}
            value={value || ""}
            onChange={onChange}
            placeholder={field.placeholder}
            className={inputClassName}
          />
        )}
        {field.help && (
          <small className="form-text text-muted d-block mt-1">
            {field.help}
          </small>
        )}
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
    </div>
  );
};

export default DynamicFormField;
