import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import { fetchEntities } from "../store/entitiesThunks";

export const useClubCatalogs = () => {
  const dispatch = useDispatch();

  const coaches = useSelector((state: RootState) => state.entities.coaches);
  const athletes = useSelector((state: RootState) => state.entities.athletes);
  const sports = useSelector((state: RootState) => state.entities.sports);

  useEffect(() => {
    dispatch(fetchEntities() as any);
  }, [dispatch]);

  return { sports, coaches, athletes };
};
