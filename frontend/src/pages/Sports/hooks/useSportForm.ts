import { useState } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import type { Sport, SportErrors } from "../types/sportTypes";
import { sportService } from "../../../services/sportService";

/**
 * Hook para gestionar el formulario de usuario (crear/editar).
 * Incluye validación, manejo de errores y envío de datos.
 * @param initialData - Datos iniciales del usuario (para edición).
 */
export const useSportForm = (initialData?: Sport) => {
  const [formData, setFormData] = useState<Sport>(
    initialData || {
      name: "",
    }
  );

  const [errors, setErrors] = useState<SportErrors>({});
  const [message, setMessage] = useState<{ text: string; type: string }>();
  const handleAuthError = useAuthErrorHandler();

  /**
   * Maneja el cambio de los campos del formulario.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof SportErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  /**
   * Valida los datos del formulario antes de enviar.
   */
  const validateForm = (): boolean => {
    const newErrors: SportErrors = {};

    if (!formData.name) newErrors.name = "El nombre es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Envía el formulario para crear o editar usuario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let response;
      if (initialData?._id) {
        response = await sportService.update(initialData._id, formData);
      } else {
        response = await sportService.create(formData);
      }

      handleAuthError(response, (msg) =>
        setMessage({ text: msg, type: "error" })
      );

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
