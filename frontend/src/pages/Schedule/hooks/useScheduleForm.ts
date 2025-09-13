import { useState } from "react";
import { useDispatch } from "react-redux";
import type { Schedule, ScheduleErrors } from "../types/scheduleTypes";
import { setMessage, type AppDispatch } from "../../../store";
import { createSchedule, updateSchedule } from "../../../store/scheduleThunks";

export const useScheduleForm = (initialData?: Schedule) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Schedule>(
    initialData || {
      startTime: "00:00",
      endTime: "00:00",
    }
  );

  const [errors, setErrors] = useState<ScheduleErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof ScheduleErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ScheduleErrors = {};

    if (!formData.startTime) newErrors.startTime = "Ingresa hora de inicio";
    if (!formData.endTime) newErrors.endTime = "Ingresa hora de salida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (initialData?._id) {
        dispatch(updateSchedule(formData)).unwrap();
        dispatch(
          setMessage({
            message: "Horario actualizado exitosamente",
            type: "success",
          })
        );
      } else {
        dispatch(createSchedule(formData)).unwrap();
        dispatch(
          setMessage({
            message: "Horario creado exitosamente",
            type: "success",
          })
        );
      }
      return true;
    } catch (error) {
      dispatch(setMessage({ message: "Error de conexión", type: "danger" }));
    }
    return false;
  };

  return { formData, errors, handleChange, handleSubmit, setFormData };
};
