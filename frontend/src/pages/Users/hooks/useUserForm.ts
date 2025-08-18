import { useState } from "react";
import type { User, UserErrors } from "../types/userTypes";
import { userService } from "../../../services/userService";

export const useUserForm = (initialData?: User) => {
  const [formData, setFormData] = useState<User>(
    initialData || {
      role: "",
      ci: "",
      name: "",
      lastname: "",
      email: "",
      birth_date: "",
      username: "",
      password: "",
      height: 0,
      weight: 0,
    }
  );

  const [errors, setErrors] = useState<UserErrors>({});
  const [message, setMessage] = useState<{ text: string; type: string }>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof UserErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: UserErrors = {};

    if (!formData.role) newErrors.role = "Seleccione un rol";
    if (!formData.ci) newErrors.ci = "La cédula es requerida";
    if (!formData.name) newErrors.name = "El nombre es requerido";
    if (!formData.lastname) newErrors.lastname = "El apellido es requerido";
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.username)
      newErrors.username = "El nombre de usuario es requerido";
    if (!initialData && !formData.password) {
      newErrors.password = "La contraseña es requerida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.password = formData.ci;
    if (!validateForm()) return;

    try {
      let response;
      if (initialData?._id) {
        response = await userService.update(initialData._id, formData);
      } else {
        response = await userService.create(formData);
      }

      if (response.code === 201 || response.code === 200) {
        setMessage({
          text: response.message || "Operación exitosa",
          type: "success",
        });
        return true;
      } else {
        setMessage({
          text: response.message || "Error al guardar",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Error de conexión", type: "error" });
    }
    return false;
  };

  return { formData, errors, message, handleChange, handleSubmit, setFormData };
};
