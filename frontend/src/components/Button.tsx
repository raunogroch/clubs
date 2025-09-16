import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  name?: string;
  icon?: string | React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  className = "btn",
  onClick,
  name = "",
  icon = "",
  disabled = false,
}) => (
  <button
    type={type}
    className={className}
    onClick={onClick}
    disabled={disabled}
  >
    {icon && <i className={`fa fa-${icon}`}></i>}
    {name}
  </button>
);

export default Button;
