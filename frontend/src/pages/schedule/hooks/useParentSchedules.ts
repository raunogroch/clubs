/**
 * Hook customizado para obtener datos de schedules de un parent
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import type { Group } from "../types";
import { fetchParentCalendarGroups } from "../../../store/schedulesThunk";

interface UseParentSchedulesResult {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

export const useParentSchedules = (): UseParentSchedulesResult => {
  const dispatch = useDispatch<AppDispatch>();
  const groups = useSelector(
    (state: RootState) => state.schedules.parentGroups,
  );
  const loading = useSelector(
    (state: RootState) => state.schedules.parentStatus === "loading",
  );
  const error = useSelector((state: RootState) => state.schedules.parentError);

  useEffect(() => {
    dispatch(fetchParentCalendarGroups());
  }, [dispatch]);

  return { groups, loading, error };
};
