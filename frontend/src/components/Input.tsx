import type { ChangeEvent } from "react";

interface InputProps {
  type?:
    | "text"
    // email type removed — prefer plain text or tel for contact fields
    | "password"
    | "checkbox"
    | "file"
    | "textarea"
    | "number"
    | "tel"
    | "url"
    | "radio"
    | "date"
    | "time"
    | "file"
    | "hidden";
  name?: string;
  className?: string;
  placeholder?: string;
  accept?: string;
  id?: string;
  checked?: boolean;
  required?: boolean;
  value?: string | number;
  disabled?: boolean;
  autoComplete?: "on" | "off";
  max?: string | number;
  min?: string | number;
  readOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  type = "text",
  name,
  className = "",
  placeholder,
  accept,
  id,
  checked = false,
  required = false,
  value: propValue,
  disabled = false,
  autoComplete = "off",
  max,
  min,
  onChange: propOnChange,
}: InputProps) => {
  const formatDateValue = (value: string | number | undefined) => {
    if (type !== "date" || value === undefined) return value;
    if (typeof value === "string" && value.includes("T")) {
      return value.split("T")[0];
    }
    return value;
  };

  const value =
    propValue !== undefined ? formatDateValue(propValue) : undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (propOnChange) propOnChange(e);
  };

  const commonProps = {
    name,
    className: `input ${className}`.trim(),
    placeholder,
    id,
    required,
    disabled,
    autoComplete,
    onChange: handleChange,
    max,
    min,
    ...(type === "file" ? { accept } : {}),
  };

  if (type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={checked}
        value={propValue}
        {...commonProps}
      />
    );
  }
  if (type === "file") {
    return <input type="file" {...commonProps} />;
  }
  return <input type={type} value={value ?? ""} {...commonProps} />;
};

export const TextArea = ({
  name,
  className = "",
  placeholder,
  id,
  required = false,
  value: propValue,
  disabled = false,
  autoComplete = "off",
  onChange: propOnChange,
}: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (propOnChange) propOnChange(e as any);
  };

  return (
    <textarea
      name={name}
      className={`input ${className}`.trim()}
      placeholder={placeholder}
      id={id}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      value={propValue}
      onChange={handleChange}
    />
  );
};
