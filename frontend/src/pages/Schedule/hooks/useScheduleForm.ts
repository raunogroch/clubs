import { useState } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import { scheduleService } from "../../../services/scheduleService";
import type { Schedule, ScheduleErrors } from "../types/scheduleTypes";

/**
 * Hook para gestionar el formulario de usuario (crear/editar).
 * Incluye validación, manejo de errores y envío de datos.
 * @param initialData - Datos iniciales del usuario (para edición).
 */
export const useUserForm = (initialData?: Schedule) => {
  const [formData, setFormData] = useState<Schedule>(
    initialData || {
      _id: "",
      startTime: "string",
      endTime: "string",
    }
  );

  const [errors, setErrors] = useState<ScheduleErrors>({});
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

    if (errors[name as keyof ScheduleErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  /**
   * Valida los datos del formulario antes de enviar.
   */
  const validateForm = (): boolean => {
    const newErrors: ScheduleErrors = {};

    if (!formData.startTime) newErrors.startTime = "Ingresa hora de inicio";
    if (!formData.endTime) newErrors.endTime = "Ingresa hora de salida";

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
      let response: any;
      if (initialData?._id) {
        response = await scheduleService.update(initialData._id, formData);
      } else {
        response = await scheduleService.create(formData);
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
