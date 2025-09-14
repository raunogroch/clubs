import { useState } from "react";
import type { ClubErrors, Club } from "../interfaces";
import { useDispatch } from "react-redux";
import { setMessage, type AppDispatch } from "../../../store";
import { createClub, updateClub } from "../../../store/clubsThunks";
import type { Sport } from "../../Sports/interfaces";

export const useClubForm = (initialData?: Club) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Club>(
    initialData || {
      image: "",
      name: "",
      place: "",
      sport: "" as unknown as Sport,
      description: "",
    }
  );

  const [errors, setErrors] = useState<ClubErrors>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof ClubErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ClubErrors = {};

    if (!formData.name) newErrors.name = "El nombre del club es requerido";
    if (!formData.sport)
      newErrors.sport = "La disciplina deportiva es requerida";
    if (!formData.place) newErrors.place = "La ubicacion es requerida";
    if (!formData.description)
      newErrors.description = "La descripcion es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return false;
    try {
      if (initialData?._id) {
        await dispatch(updateClub(formData)).unwrap();
      } else {
        await dispatch(createClub(formData)).unwrap();
      }
      return true;
    } catch (error) {
      dispatch(
        setMessage({
          message: "Ocurrió un error, inténtalo nuevamente",
          type: "danger",
        })
      );
    }
    return false;
  };

  return { formData, errors, handleChange, handleSubmit, setFormData };
};
