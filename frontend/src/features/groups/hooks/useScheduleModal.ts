/**
 * Hook para manejar el modal de editar horarios
 *
 * Gestiona el estado de edición de horarios
 */

import { useState, useCallback } from "react";
import type { Schedule } from "../types";
import { DEFAULT_SCHEDULE } from "../constants";
import toastr from "toastr";

export function useScheduleModal() {
  const [showModal, setShowModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingSchedules, setEditingSchedules] = useState<Schedule[]>([]);

  const openModal = useCallback(
    (groupId: string, currentSchedules: Schedule[] = []) => {
      setEditingGroupId(groupId);
      // Deduplicate by day, keep the first occurrence
      if (currentSchedules.length > 0) {
        const seen = new Set<string>();
        const uniq: Schedule[] = [];
        for (const s of currentSchedules) {
          if (!seen.has(s.day)) {
            uniq.push(s);
            seen.add(s.day);
          }
        }
        if (uniq.length !== currentSchedules.length) {
          toastr.warning("Se han eliminado días duplicados al abrir el editor");
        }
        setEditingSchedules(uniq.length > 0 ? uniq : [DEFAULT_SCHEDULE]);
      } else {
        setEditingSchedules([DEFAULT_SCHEDULE]);
      }
      setShowModal(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingGroupId(null);
    setEditingSchedules([]);
  }, []);

  const addScheduleRow = useCallback(() => {
    setEditingSchedules((prev) => {
      const VALID_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      if (prev.length === 0) {
        return [DEFAULT_SCHEDULE];
      }

      const used = new Set(prev.map((s) => s.day));
      if (used.size >= VALID_DAYS.length) {
        toastr.warning("Ya existen horarios para todos los días");
        return prev;
      }

      // Find the first day not used yet
      let nextDay = DEFAULT_SCHEDULE.day;
      for (const d of VALID_DAYS) {
        if (!used.has(d)) {
          nextDay = d;
          break;
        }
      }

      const lastSchedule = prev[prev.length - 1];
      return [
        ...prev,
        {
          day: nextDay,
          startTime: lastSchedule.startTime,
          endTime: lastSchedule.endTime,
        },
      ];
    });
  }, []);

  const updateScheduleRow = useCallback(
    (index: number, field: keyof Schedule, value: string) => {
      setEditingSchedules((prev) => {
        // Si se está cambiando el día, validar que no exista duplicado
        if (field === "day") {
          const isDuplicate = prev.some(
            (s, i) => i !== index && s.day === value,
          );
          if (isDuplicate) {
            // Mostrar error pero no permitir el cambio
            console.warn(`El día ${value} ya está en la lista`);
            return prev; // Retornar sin cambios
          }
        }

        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
        return updated;
      });
    },
    [],
  );

  const removeScheduleRow = useCallback((index: number) => {
    setEditingSchedules((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    // Estados
    showModal,
    editingGroupId,
    editingSchedules,
    // Métodos
    openModal,
    closeModal,
    addScheduleRow,
    updateScheduleRow,
    removeScheduleRow,
  };
}
