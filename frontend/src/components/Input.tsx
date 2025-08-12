import { useState, type ChangeEvent } from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "checkbox" | "number" | "tel" | "url";
  name?: string;
  className?: string;
  placeholder?: string;
  id?: string;
  checked?: boolean;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  autoComplete?: "on" | "off";
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
  };

  if (type === "checkbox") {
    return <input type="checkbox" checked={checked} {...commonProps} />;
  }

  return <input type={type} value={value} {...commonProps} />;
};
