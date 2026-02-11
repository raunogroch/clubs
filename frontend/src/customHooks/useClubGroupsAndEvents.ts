import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchGroupsByClub } from "../store/groupsThunk";
import { fetchEventsByClub } from "../store/eventsThunk";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

/**
 * Custom hook para cargar grupos y eventos de un club
 * @param clubId - ID del club
 * @returns Objeto con grupos, eventos y estado de carga combinado
 */
export const useClubGroupsAndEvents = (clubId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  // Obtener datos de Redux
  const groupsData = useSelector((state: RootState) => state.groups);
  const eventsData = useSelector((state: RootState) => state.events);

  const groups = groupsData.items;
  const groupsStatus = groupsData.status as LoadStatus;
  const events = eventsData.items || [];
  const eventsStatus = eventsData.status as LoadStatus;

  // Estado de carga combinado: cargando si cualquiera está cargando
  const isLoading = groupsStatus === "loading" || eventsStatus === "loading";
  // Estado general: fallido si cualquiera falló
  const hasError = groupsStatus === "failed" || eventsStatus === "failed";
  // Estado de éxito: ambos completados
  const isLoaded = groupsStatus === "succeeded" && eventsStatus === "succeeded";

  // Cargar datos al montar o cuando cambia clubId
  useEffect(() => {
    if (!clubId) return;
    dispatch(fetchGroupsByClub(clubId));
    dispatch(fetchEventsByClub(clubId));
  }, [clubId, dispatch]);

  return {
    groups,
    events,
    isLoading,
    hasError,
    isLoaded,
  };
};
