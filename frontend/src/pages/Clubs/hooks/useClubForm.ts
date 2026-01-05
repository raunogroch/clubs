import { useState } from "react";
import type { ClubErrors, Club } from "../interfaces";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store";
import { createClub, updateClub } from "../../../store/clubsThunks";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const emptyClub: Club = {
  name: "",
  place: "",
  sport: "" as any,
  description: "",
  groups: [],
  createdAt: "",
  monthly_pay: 200,
  uniqueAthletesCount: 0,
  active: true,
};

export const useClubForm = (initialData?: Club) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Club>(initialData ?? emptyClub);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return false;
    try {
      if (initialData?._id) {
        const result: any = await dispatch(updateClub(formData)).unwrap();
        if (result && result.imageProcessingSkipped) {
          toastr.warning(
            "Club actualizado, pero la imagen no pudo procesarse (servicio de imágenes no disponible)"
          );
        } else {
          toastr.success("Club actualizado con exito");
        }
      } else {
        const result: any = await dispatch(createClub(formData)).unwrap();
        if (result && result.imageProcessingSkipped) {
          toastr.warning(
            "Club creado, pero la imagen no pudo procesarse (servicio de imágenes no disponible)"
          );
        } else {
          toastr.success("Club creado con exito");
        }
      }
      return true;
    } catch (error) {
      toastr.error("Error al guardar el club");
    }
    return false;
  };

  return { formData, errors, handleChange, handleSubmit, setFormData };
};
