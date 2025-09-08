import { useState, useEffect } from "react";
import { useAuthErrorHandler } from "../../../hooks";
import { scheduleService, type IScheduleService } from "../../../services";

export const useScheduleClub = (
  service: IScheduleService = scheduleService
) => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useAuthErrorHandler();

  const fetchSchedules = async () => {
    try {
      const response = await service.getAll();

      if (response.code === 200) {
        const { data } = response;
        setSchedules(data);
      }

      handleAuthError(response, setError);
    } catch (err) {
      setError("Error al cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return { schedules, error };
};
