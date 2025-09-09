import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEntities, type RootState } from "../store";
import api from "../services/api";

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
    if (!coaches.length && !athletes.length) {
      api
        .get("/users")
        .then((response) => {
          dispatch(setEntities({ name: "users", data: response.data }));
        })
        .catch((err) => {
          console.error("Error cargando usuarios:", err);
        });
    }
    if (!schedules.length) {
      api
        .get("/schedules")
        .then((response) => {
          dispatch(setEntities({ name: "schedules", data: response.data }));
        })
        .catch((err) => {
          console.error("Error cargando schedules:", err);
        });
    }
    if (!sports.length) {
      api
        .get("/sports")
        .then((response) => {
          dispatch(setEntities({ name: "sports", data: response.data }));
        })
        .catch((err) => {
          console.error("Error cargando sports:", err);
        });
    }
  }, [
    sports.length,
    coaches.length,
    athletes.length,
    schedules.length,
    dispatch,
  ]);

  return { clubs, sports, coaches, athletes, schedules };
};
