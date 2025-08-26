import { useState, type ChangeEvent } from "react";

interface InputProps {
  type?:
    | "text"
    | "email"
    | "password"
    | "checkbox"
    | "number"
    | "tel"
    | "url"
    | "radio"
    | "date"
    | "time"
    | "file";
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
  const [internalValue, setInternalValue] = useState("");

  // Convert ISO date string to yyyy-MM-dd format if type is date
  const formatDateValue = (value: string | number | undefined) => {
    if (type !== "date" || value === undefined) return value;

    if (typeof value === "string" && value.includes("T")) {
      return value.split("T")[0];
    }
    return value;
  };

  const value =
    propValue !== undefined ? formatDateValue(propValue) : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (propOnChange) {
      propOnChange(e);
    }
    if (propValue === undefined) {
      setInternalValue(e.target.value);
    }
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
    return <input type="checkbox" checked={checked} {...commonProps} />;
  }

  if (type === "file") {
    return <input type="file" {...commonProps} />;
  }

  return <input type={type} value={value ?? ""} {...commonProps} />;
};
