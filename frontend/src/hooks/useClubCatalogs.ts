import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import {
  fetchUsers,
  fetchSchedules,
  fetchClubs,
  fetchSports,
} from "../store/entitiesThunks";

/**
 * Custom hook para obtener catálogos de coaches, athletes y schedules desde Redux,
 * y cargarlos si están vacíos usando los endpoints correspondientes.
 */
export const useClubCatalogs = () => {
  const dispatch = useDispatch();
  const coaches = useSelector((state: RootState) =>
    state.entities.users.filter((u) => u.role === "coach")
  );
  const athletes = useSelector((state: RootState) =>
    state.entities.users.filter((u) => u.role === "athlete")
  );
  const schedules = useSelector((state: RootState) => state.entities.schedules);
  const clubs = useSelector((state: RootState) => state.entities.clubs);
  const sports = useSelector((state: RootState) => state.entities.sports);

  useEffect(() => {
    dispatch(fetchUsers() as any);
    dispatch(fetchClubs() as any);
    dispatch(fetchSports() as any);
    dispatch(fetchSchedules() as any);
  }, [dispatch]);

  return { clubs, sports, coaches, athletes, schedules };
};
