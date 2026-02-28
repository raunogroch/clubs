import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminSchedules,
  fetchAthleteSchedules,
  fetchParentSchedules,
  fetchAssistantSchedules,
} from "../store/schedulesThunk";
import type { RootState, AppDispatch } from "../store/store";

/**
 * Determina cuál de los endpoints optimizados debe llamarse según el rol
 * del usuario (admin, athlete, parent, assistant). Devuelve el slice de
 * schedules de Redux con estado, items y cualquier error.
 */
export const useSchedules = (user: any | undefined) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector(
    (state: RootState) => state.schedules,
  );

  useEffect(() => {
    if (!user) return;

    // Si ya hay una petición en curso o completa, no hacemos nada; la
    // slice se encarga de ignorar llamadas redundantes.
    switch (user.role || (user.roles && user.roles[0])) {
      case "admin":
        dispatch(fetchAdminSchedules());
        break;
      case "athlete":
        dispatch(fetchAthleteSchedules());
        break;
      case "parent":
        dispatch(fetchParentSchedules());
        break;
      case "assistant":
        dispatch(fetchAssistantSchedules());
        break;
      default:
        // otros roles no tienen calendarios propios
        break;
    }
  }, [user, dispatch]);

  return { items, status, error };
};
