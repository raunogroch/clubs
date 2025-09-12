import { useEffect } from "react";
import type { AppDispatch } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClubs,
  deleteClub as deleteClubThunk,
} from "../../../store/clubsThunks";
import { clearClubs } from "../../../store/clubsSlice";

export const useClubs = () => {
  const dispatch = useDispatch<AppDispatch>();

  const clubs = useSelector((state: any) => state.clubs.clubs);

  const deleteClub = async (id: string): Promise<void> => {
    dispatch(deleteClubThunk(id));
  };

  useEffect(() => {
    dispatch(fetchClubs());
    dispatch(clearClubs());
  }, []);

  return { clubs, deleteClub };
};
