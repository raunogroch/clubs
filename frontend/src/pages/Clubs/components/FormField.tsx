import { Input, TextArea } from "../../../components";

interface FormFieldProps {
  title: string;
  type:
    | "number"
    | "text"
    | "email"
    | "password"
    | "checkbox"
    | "tel"
    | "url"
    | "radio"
    | "date"
    | "time";
  name: string;
  value: string;
  placeholder?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

export const FormField = ({
  title,
  type,
  name,
  value,
  placeholder,
  error,
  handleChange,
}: FormFieldProps) => {
  return (
    <div className="form-group row">
      <label htmlFor={name} className="col-sm-2 col-form-label">
        {title}
      </label>
      <div className="col-sm-10">
        <Input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

export const TextAreaField = ({
  title,
  name,
  value,
  placeholder,
  error,
  handleChange,
}: FormFieldProps) => {
  return (
    <div className="form-group row">
      <label htmlFor={name} className="col-sm-2 col-form-label">
        {title}
      </label>
      <div className="col-sm-10">
        <TextArea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};
