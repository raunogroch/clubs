import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../store";
import { useParams } from "react-router-dom";
import { createGroup, updateGroup } from "../../../store/groupsThunks";
import type { IGroup } from "../../groups/interface/groupTypes";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const initialGroupData: IGroup = {
  name: "",
  dailySchedules: [],
  place: "",
  coaches: [],
  athletes: [],
  active: true,
};

// Constantes para evitar repetición
const DAYS_ORDER = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Sabado",
  "Domingo",
] as const;

const MAX_SCHEDULES = 7;

// Tipos mejorados para errores
type ScheduleError = {
  day?: string;
  turn?: string;
  startTime?: string;
  endTime?: string;
};

type GroupErrors = {
  name?: string;
  dailySchedules?: ScheduleError[];
  place?: string;
  coaches?: string;
  athletes?: string;
};

export const useGroup = (initialData?: IGroup) => {
  const { clubId } = useParams<{ clubId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [groupFormState, setGroupFormState] = useState<IGroup>(
    initialData ?? initialGroupData
  );
  const [groupFormErrors, setGroupFormErrors] = useState<GroupErrors>({});

  // Función para ordenar horarios (extraída para reutilización)
  const sortSchedules = useCallback((schedules: IGroup["dailySchedules"]) => {
    return [...schedules].sort((a, b) => {
      const idxA = DAYS_ORDER.findIndex(
        (d) => d.toLowerCase() === String(a.day).toLowerCase()
      );
      const idxB = DAYS_ORDER.findIndex(
        (d) => d.toLowerCase() === String(b.day).toLowerCase()
      );
      return idxA - idxB;
    });
  }, []);

  // Manejo de cambios en arrays (coaches/athletes)
  const handleArrayChange = useCallback(
    (name: keyof IGroup, value: string, checked: boolean) => {
      setGroupFormState((prev) => {
        const currentArray = [...(prev[name] as any[])];
        const newArray = checked
          ? currentArray.includes(value)
            ? currentArray
            : [...currentArray, value]
          : currentArray.filter((item) => item !== value);

        return { ...prev, [name]: newArray };
      });

      // Limpiar error si existe
      if (groupFormErrors[name as keyof GroupErrors]) {
        setGroupFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [groupFormErrors]
  );

  // Manejo general de cambios
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;

      if (type === "checkbox" && (name === "coaches" || name === "athletes")) {
        handleArrayChange(name as keyof IGroup, value, checked);
        return;
      }

      setGroupFormState((prev) => ({ ...prev, [name]: value }));

      if (groupFormErrors[name as keyof GroupErrors]) {
        setGroupFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [handleArrayChange, groupFormErrors]
  );

  // Manejo de horarios
  const handleScheduleChange = useCallback(
    (index: number, field: string, value: any) => {
      setGroupFormState((prev) => {
        const updatedSchedules = prev.dailySchedules.map((s, i) =>
          i === index ? { ...s, [field]: value } : s
        );
        return { ...prev, dailySchedules: updatedSchedules };
      });
    },
    []
  );

  const addSchedule = useCallback(() => {
    if (groupFormState.dailySchedules.length >= MAX_SCHEDULES) return;

    setGroupFormState((prev) => ({
      ...prev,
      dailySchedules: [
        ...prev.dailySchedules,
        { day: "", turn: "", startTime: "", endTime: "", active: true },
      ],
    }));
  }, [groupFormState.dailySchedules.length]);

  const removeSchedule = useCallback((index: number) => {
    setGroupFormState((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.filter((_, i) => i !== index),
    }));
  }, []);

  // Validación modular
  const validateForm = useCallback((): boolean => {
    const errors: GroupErrors = {};
    const scheduleErrors: { [idx: number]: ScheduleError } = {};
    const usedDays = new Set<string>();

    // Validar nombre
    if (!groupFormState.name?.trim()) {
      errors.name = "El nombre del grupo es requerido";
    }

    // Validar lugar
    if (!groupFormState.place?.trim()) {
      errors.place = "El lugar es requerido";
    }

    // Validar coaches
    if (!groupFormState.coaches?.length) {
      errors.coaches = "Debe asignar al menos un entrenador";
    }

    // Validar athletes
    if (!groupFormState.athletes?.length) {
      errors.athletes = "Debe asignar al menos un atleta";
    }

    // Validar horarios
    groupFormState.dailySchedules.forEach((schedule, idx) => {
      const scheduleError: ScheduleError = {};

      // Extraer el valor real del día (soporta string o { value, label })
      let dayValue = "";
      if (typeof schedule.day === "string") {
        dayValue = schedule.day;
      } else if (
        schedule.day &&
        typeof schedule.day === "object" &&
        "value" in schedule.day
      ) {
        dayValue = (schedule.day as any).value;
      }

      // Validar día
      if (!dayValue) {
        scheduleError.day = "El día es requerido";
      } else {
        const dayStr = String(dayValue).toLowerCase();
        if (usedDays.has(dayStr)) {
          scheduleError.day = "El día ya está asignado en otro horario";
        } else {
          usedDays.add(dayStr);
        }
      }

      // Validar turno (soporta string o { value, label })
      let turnValue = "";
      if (typeof schedule.turn === "string") {
        turnValue = schedule.turn;
      } else if (
        schedule.turn &&
        typeof schedule.turn === "object" &&
        "value" in schedule.turn
      ) {
        turnValue = (schedule.turn as any).value;
      }
      if (!turnValue) {
        scheduleError.turn = "El turno es requerido";
      }

      // Validar horas
      if (!schedule.startTime) {
        scheduleError.startTime = "La hora de inicio es requerida";
      }
      if (!schedule.endTime) {
        scheduleError.endTime = "La hora de fin es requerida";
      }

      // Solo agregar si hay errores en este horario
      if (Object.keys(scheduleError).length > 0) {
        scheduleErrors[idx] = scheduleError;
      }
    });

    // Convertir los errores a un array solo con los índices que tienen errores
    const scheduleErrorsArray =
      Object.keys(scheduleErrors).length > 0
        ? Object.entries(scheduleErrors).map(([idx, err]) => ({
            ...err,
            idx: Number(idx),
          }))
        : [];

    if (scheduleErrorsArray.length > 0) {
      errors.dailySchedules = scheduleErrorsArray;
    } else if (groupFormState.dailySchedules.length === 0) {
      errors.dailySchedules = [{ day: "Debe agregar al menos un horario" }];
    }

    setGroupFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [groupFormState]);

  // Envío de formulario
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!validateForm()) return false;

      // Ordenar dailySchedules automáticamente antes de guardar
      const sortedSchedules = sortSchedules(groupFormState.dailySchedules);
      const groupToSend = {
        ...groupFormState,
        dailySchedules: sortedSchedules,
      };

      try {
        if (initialData?._id) {
          await dispatch(updateGroup({ clubId, group: groupToSend })).unwrap();
          toastr.success("Grupo actualizado exitosamente");
        } else {
          await dispatch(createGroup({ clubId, group: groupToSend })).unwrap();
          toastr.success("Grupo creado exitosamente");
        }
        return true;
      } catch (error) {
        toastr.error("Error", "Ocurrió un error, inténtalo nuevamente");
        return false;
      }
    },
    [clubId, dispatch, groupFormState, initialData, sortSchedules, validateForm]
  );

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
