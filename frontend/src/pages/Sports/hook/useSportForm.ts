import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSport, updateSport } from "../../../store/sportsThunks";
import { setMessage, type AppDispatch } from "../../../store";

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
        dispatch(
          setMessage({
            message: "Disciplina actualizada exitosamente",
            type: "success",
          })
        );
      } else {
        await dispatch(createSport(formData)).unwrap();
        dispatch(
          setMessage({
            message: "Disciplina creada exitosamente",
            type: "success",
          })
        );
      }
      return true;
    } catch (error) {
      dispatch(
        setMessage({
          message: "Error de conexión",
          type: "danger",
        })
      );
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
