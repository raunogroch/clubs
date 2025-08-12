import { useState } from "react";

interface InputProps {
  type?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  id?: string;
  checked?: boolean; // Añadido para manejar el estado checked
}

export const Input = ({
  type = "text",
  name,
  className,
  placeholder,
  id,
  checked = false, // Valor por defecto para checked
}: InputProps) => {
  const [inputValue, setInputValue] = useState(""); // Estado para almacenar el valor

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Actualiza el estado al escribir
  };

  return (
    <input
      type={type}
      name={name} // Tipo de input, por defecto "text"
      value={inputValue}
      className={className} // Valor controlado por React
      onChange={handleChange} // Maneja cambios
      placeholder={placeholder}
      id={id}
      checked={checked} // Maneja el estado checked si es un checkbox
    />
  );
};
