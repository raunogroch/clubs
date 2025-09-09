import type { RootState } from "../store";
import type { User } from "./types";

export const selectUsers = (state: RootState): User[] => state.entities.users;
export const selectCoaches = (state: RootState): User[] =>
  state.entities.users.filter((u) => u.role === "coach");
export const selectAthletes = (state: RootState): User[] =>
  state.entities.users.filter((u) => u.role === "athlete");
