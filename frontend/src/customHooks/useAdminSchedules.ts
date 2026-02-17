import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import { fetchAdminSchedules } from "../store/schedulesThunk";

interface CalendarGroup {
  _id: string;
  name: string;
  club_id: string;
  club: {
    _id: string;
    name: string;
  };
  schedules_added: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
}

interface UseAdminSchedulesReturn {
  calendarGroups: CalendarGroup[];
  calendarLoading: string;
  error: string | null;
}

/**
 * Custom hook para obtener y transformar los horarios del administrador
 * Maneja la lógica de Redux, transformación de datos y manejo de errores
 */
export const useAdminSchedules = (user: any): UseAdminSchedulesReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: schedules, status: calendarLoading } = useSelector(
    (state: RootState) => state.schedules,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch admin schedules when component mounts
    if (user && (user as any)?.assignment_id) {
      dispatch(fetchAdminSchedules());
    } else if (user) {
      setError(
        "No tienes una asignación configurada. Contacta al administrador.",
      );
    }
  }, [user, dispatch]);

  // Transform schedule data to calendar groups format
  const calendarGroups = Array.from(
    schedules
      .reduce((map: Map<string, CalendarGroup>, schedule: any) => {
        const groupId = schedule._id;
        if (!map.has(groupId)) {
          map.set(groupId, {
            _id: groupId,
            name: schedule.name,
            club_id: schedule.club_id,
            club: schedule.club,
            schedules_added: [],
          });
        }
        const group = map.get(groupId)!;
        group.schedules_added.push({
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        });
        return map;
      }, new Map())
      .values(),
  );

  return {
    calendarGroups,
    calendarLoading,
    error,
  };
};
