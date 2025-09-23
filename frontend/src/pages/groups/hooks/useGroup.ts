import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import toastr from "toastr";
import { createGroup, updateGroup } from "../../../store/groupsThunks";
import type { AppDispatch } from "../../../store";
import type { GroupErrors, IGroup } from "../interface/groupTypes";
import "toastr/build/toastr.min.css";

export const initialGroupData: IGroup = {
  name: "",
  dailySchedules: [],
  place: "",
  coaches: [],
  athletes: [],
  active: true,
};

export const useGroup = (initialData?: IGroup) => {
  const { clubId } = useParams<{ clubId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [groupFormState, setGroupFormState] = useState<IGroup>(
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

  const handleScheduleChange = (index: number, field: string, value: any) => {
    setGroupFormState((prev) => {
      const updatedSchedules = prev.dailySchedules.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...prev, dailySchedules: updatedSchedules };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox" && (name === "coaches" || name === "athletes")) {
      setGroupFormState((prev) => {
        const arr = Array.isArray(prev[name as keyof IGroup])
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
            ? (schedule.day as any).value
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
    setGroupFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validateForm()) return false;

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
    function getDayValue(day: any): string {
      if (typeof day === "string") return day;
      if (day && typeof day === "object" && "value" in day) return day.value;
      return "";
    }
    const sortedSchedules = [...groupFormState.dailySchedules].sort((a, b) => {
      const idxA = daysOrder.findIndex(
        (d) => d.toLowerCase() === getDayValue(a.day).toLowerCase()
      );
      const idxB = daysOrder.findIndex(
        (d) => d.toLowerCase() === getDayValue(b.day).toLowerCase()
      );
      return idxA - idxB;
    });
    const groupToSend = { ...groupFormState, dailySchedules: sortedSchedules };
    try {
      if (initialData && initialData._id) {
        await dispatch(updateGroup({ clubId, group: groupToSend })).unwrap();
        toastr.success("Grupo actualizado con éxito");
      } else {
        await dispatch(createGroup({ clubId, group: groupToSend })).unwrap();
        toastr.success("Grupo creado con éxito");
      }
      return true;
    } catch (error) {
      toastr.warning("Ocurrió un error, inténtalo nuevamente");
      return false;
    }
  }

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
