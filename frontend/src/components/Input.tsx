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
    | "date";
  name?: string;
  className?: string;
  placeholder?: string;
  id?: string;
  checked?: boolean;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  autoComplete?: "on" | "off";
  max?: string | number; // Added max prop
  min?: string | number; // You might want min as well for completeness
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  type = "text",
  name,
  className = "",
  placeholder,
  id,
  checked = false,
  required = false,
  value: propValue,
  disabled = false,
  autoComplete = "off",
  max, // Added max prop
  min, // Added min prop
  onChange: propOnChange,
}: InputProps) => {
  const [internalValue, setInternalValue] = useState("");

  const value = propValue !== undefined ? propValue : internalValue;

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
    max, // Added max to commonProps
    min, // Added min to commonProps
  };

  if (type === "checkbox") {
    return <input type="checkbox" checked={checked} {...commonProps} />;
  }

  return <input type={type} value={value} {...commonProps} />;
};
