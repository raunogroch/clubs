import { useState } from "react";
import { useAuthErrorHandler } from "../../../hooks/useAuthErrorHandler";
import type { ClubErrors, Club } from "../types/clubTypes";
import { clubService } from "../../../services/clubService";

/**
 * Hook para gestionar el formulario de usuario (crear/editar).
 * Incluye validación, manejo de errores y envío de datos.
 * @param initialData - Datos iniciales del usuario (para edición).
 */
export const useClubForm = (initialData?: Club) => {
  const [formData, setFormData] = useState<Club>(
    initialData || {
      name: "",
      schedule: "",
      sport: "",
      place: "",
      discipline: "",
      coaches: [],
      athletes: [],
    }
  );

  const [errors, setErrors] = useState<ClubErrors>({});
  const [message, setMessage] = useState<{ text: string; type: string }>();
  const handleAuthError = useAuthErrorHandler();

  /**
   * Maneja el cambio de los campos del formulario.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox" && (name === "coaches" || name === "athletes")) {
      let updatedArr = Array.isArray(formData[name]) ? [...formData[name]] : [];
      if (checked) {
        if (!updatedArr.includes(value)) {
          updatedArr.push(value);
        }
      } else {
        updatedArr = updatedArr.filter((id) => id !== value);
      }
      setFormData({ ...formData, [name]: updatedArr });
      if (errors[name as keyof ClubErrors]) {
        setErrors({ ...errors, [name]: undefined });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof ClubErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  /**
   * Valida los datos del formulario antes de enviar.
   */
  const validateForm = (): boolean => {
    const newErrors: ClubErrors = {};

    if (!formData.name) newErrors.name = "El nombre del club es requerido";
    if (formData.schedule === "") newErrors.schedule = "El horaro es requerido";
    if (formData.discipline === "")
      newErrors.discipline = "La disciplina deportiva es requerida";
    if (!formData.place) newErrors.place = "La ubicacion es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Envía el formulario para crear o editar usuario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Submitting form data:", formData);
    try {
      let response: any;
      if (initialData?._id) {
        response = await clubService.update(initialData._id, formData);
      } else {
        response = await clubService.create(formData);
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
