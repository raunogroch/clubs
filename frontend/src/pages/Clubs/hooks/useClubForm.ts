import { useState } from "react";
import type { ClubErrors, Club } from "../interfaces";
import { useDispatch } from "react-redux";
import { setMessage, type AppDispatch } from "../../../store";
import { createClub, updateClub } from "../../../store/clubsThunks";

export const useClubForm = (initialData?: Club) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Club>(
    initialData || {
      image: "",
      name: "",
      place: "",
      discipline: "",
      schedule: "",
      coaches: [],
      athletes: [],
    }
  );

  const [errors, setErrors] = useState<ClubErrors>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (initialData?._id) {
        dispatch(updateClub(formData)).unwrap();
      } else {
        dispatch(createClub(formData)).unwrap();
      }
      return true;
    } catch (error) {
      dispatch(
        setMessage({
          message: "Ocurrio un error intentalo nuevamente",
          type: "danger",
        })
      );
    }
    return false;
  };

  return { formData, errors, handleChange, handleSubmit, setFormData };
};
