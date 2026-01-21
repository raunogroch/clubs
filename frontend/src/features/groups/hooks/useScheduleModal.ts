/**
 * Hook para manejar el modal de editar horarios
 *
 * Gestiona el estado de edición de horarios
 */

import { useState, useCallback } from "react";
import type { Schedule } from "../types";
import { getNextDay } from "../utils";
import { DEFAULT_SCHEDULE } from "../constants";

export function useScheduleModal() {
  const [showModal, setShowModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingSchedules, setEditingSchedules] = useState<Schedule[]>([]);

  const openModal = useCallback(
    (groupId: string, currentSchedules: Schedule[] = []) => {
      setEditingGroupId(groupId);
      setEditingSchedules(
        currentSchedules.length > 0
          ? [...currentSchedules]
          : [DEFAULT_SCHEDULE],
      );
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
      if (prev.length === 0) {
        return [DEFAULT_SCHEDULE];
      }

      const lastSchedule = prev[prev.length - 1];
      return [
        ...prev,
        {
          day: getNextDay(lastSchedule.day),
          startTime: lastSchedule.startTime,
          endTime: lastSchedule.endTime,
        },
      ];
    });
  }, []);

  const updateScheduleRow = useCallback(
    (index: number, field: keyof Schedule, value: string) => {
      setEditingSchedules((prev) => {
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
