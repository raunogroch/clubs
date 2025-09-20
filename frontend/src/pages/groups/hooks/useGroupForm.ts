import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMessage, type AppDispatch } from "../../../store";
import type { Group, GroupErrors } from "../interface/group.Interface";
import { useParams } from "react-router-dom";
import { createGroup, updateGroup } from "../../../store/groupsThunks";

export const initialGroupData: Group = {
  name: "",
  dailySchedules: [],
  place: "",
  coaches: [],
  athletes: [],
  active: true,
};

export const useGroupForm = (initialData?: Group) => {
  const { clubId } = useParams<{ clubId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [groupFormState, setGroupFormState] = useState<Group>(
    initialData ?? initialGroupData
  );
  const [groupFormErrors, setGroupFormErrors] = useState<GroupErrors>({});

  const addSchedule = () => {
    if (groupFormState.dailySchedules.length >= 7) return;
    setGroupFormState((prev) => ({
      ...prev,
      dailySchedules: [
        ...prev.dailySchedules,
        { day: "", turn: "", startTime: "", endTime: "", active: true },
      ],
    }));
  };

  const removeSchedule = (index: number) => {
    setGroupFormState((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.filter((_, i) => i !== index),
    }));
  };

  // Actualizar campo de horario semanal
  const handleScheduleChange = (index: number, field: string, value: any) => {
    setGroupFormState((prev) => {
      const updatedSchedules = prev.dailySchedules.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...prev, dailySchedules: updatedSchedules };
    });
  };

  // Manejar cambios de campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Multi-select para coaches/athletes
    if (type === "checkbox" && (name === "coaches" || name === "athletes")) {
      setGroupFormState((prev) => {
        const arr = Array.isArray(prev[name as keyof Group])
          ? [...(prev as any)[name]]
          : [];
        if (checked) {
          if (!arr.includes(value)) arr.push(value);
        } else {
          return { ...prev, [name]: arr.filter((v: any) => v !== value) };
        }
        return { ...prev, [name]: arr };
      });
      if (groupFormErrors[name as keyof GroupErrors]) {
        setGroupFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
      return;
    }

    setGroupFormState((prev) => ({ ...prev, [name]: value }));
    if (groupFormErrors[name as keyof GroupErrors]) {
      setGroupFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validar formulario
  function validateForm(): boolean {
    const errors: GroupErrors = {};
    if (!groupFormState.name || groupFormState.name.trim() === "") {
      errors.name = "El nombre del grupo es requerido";
    }
    if (
      !groupFormState.dailySchedules ||
      groupFormState.dailySchedules.length === 0
    ) {
      errors.dailySchedules = "Debe agregar al menos un horario";
    } else {
      const usedDays = new Set<string>();
      groupFormState.dailySchedules.forEach((schedule, idx) => {
        const dayValue =
          typeof schedule.day === "object" && schedule.day !== null
            ? schedule.day.value
            : schedule.day;
        if (!dayValue) {
          errors[`dailySchedules_${idx}_day`] = `El día es requerido`;
        } else if (usedDays.has(dayValue)) {
          errors[
            `dailySchedules_${idx}_day`
          ] = `El día ya está asignado en otro horario`;
        } else {
          usedDays.add(dayValue);
        }
        if (!schedule.turn) {
          errors[`dailySchedules_${idx}_turn`] = `El turno es requerido`;
        }
        if (!schedule.startTime) {
          errors[
            `dailySchedules_${idx}_startTime`
          ] = `La hora de inicio es requerida`;
        }
        if (!schedule.endTime) {
          errors[
            `dailySchedules_${idx}_endTime`
          ] = `La hora de fin es requerida`;
        }
      });
    }
    if (!groupFormState.place || groupFormState.place.trim() === "") {
      errors.place = "El lugar es requerido";
    }
    if (!groupFormState.coaches || groupFormState.coaches.length === 0) {
      errors.coaches = "Debe asignar al menos un entrenador";
    }
    if (!groupFormState.athletes || groupFormState.athletes.length === 0) {
      errors.athletes = "Debe asignar al menos un atleta";
    }
    console.log("Validation Errors:", errors);
    console.log("Group Form State:", groupFormState);
    setGroupFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Enviar formulario
  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validateForm()) return false;
    // Ordenar el cronograma semanal antes de enviar
    const daysOrder = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Sabado",
      "Domingo",
    ];
    const sortedSchedules = [...groupFormState.dailySchedules].sort((a, b) => {
      const idxA = daysOrder.findIndex(
        (d) => d.toLowerCase() === String(a.day).toLowerCase()
      );
      const idxB = daysOrder.findIndex(
        (d) => d.toLowerCase() === String(b.day).toLowerCase()
      );
      return idxA - idxB;
    });
    const groupToSend = { ...groupFormState, dailySchedules: sortedSchedules };
    try {
      if (initialData && initialData._id) {
        await dispatch(updateGroup({ clubId, group: groupToSend })).unwrap();
        dispatch(
          setMessage({
            message: "Grupo actualizado exitosamente",
            type: "success",
          })
        );
      } else {
        await dispatch(createGroup({ clubId, group: groupToSend })).unwrap();
        dispatch(
          setMessage({ message: "Grupo creado exitosamente", type: "success" })
        );
      }
      return true;
    } catch (error) {
      dispatch(
        setMessage({
          message: "Ocurrió un error, inténtalo nuevamente",
          type: "danger",
        })
      );
      return false;
    }
  }

  // Retornar API del hook
  return {
    formData: groupFormState,
    errors: groupFormErrors,
    handleChange,
    handleSubmit,
    setFormData: setGroupFormState,
    addSchedule,
    removeSchedule,
    handleScheduleChange,
  };
};
