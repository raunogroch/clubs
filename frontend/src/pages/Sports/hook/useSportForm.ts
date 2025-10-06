import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSport, updateSport } from "../../../store/sportsThunks";
import { type AppDispatch } from "../../../store";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const useSportForm = (initialData?: { _id?: string; name: string }) => {
  const [formData, setFormData] = useState<{ name: string }>(
    initialData || { name: "" }
  );
  const [errors, setErrors] = useState<{ name?: string }>({});

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!formData.name) newErrors.name = "Ingresa el nombre de la disciplina";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return false;

    try {
      if (initialData?._id) {
        await dispatch(updateSport(formData)).unwrap();
        toastr.success("Disciplina actualizada exitosamente");
      } else {
        await dispatch(createSport(formData)).unwrap();
        toastr.success("Disciplina creada exitosamente");
      }
      return true;
    } catch (error) {
      toastr.error("Error al guardar la disciplina");
    }
    return false;
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  };
};
