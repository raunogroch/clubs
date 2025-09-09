import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Club } from "../interfaces/club";
import type { User } from "../interfaces/user";
import type { Sport } from "../pages/Sports/interfaces/sportTypes";
import type { Schedule } from "../pages/Schedule/types/scheduleTypes";

interface EntitiesState {
  clubs: Club[];
  sports: Sport[];
  users: User[];
  schedules: Schedule[];
}

const initialState: EntitiesState = {
  clubs: [],
  sports: [],
  users: [],
  schedules: [],
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {
    setEntities: <K extends keyof EntitiesState>(
      state: EntitiesState,
      action: PayloadAction<{ name: K; data: EntitiesState[K] }>
    ) => {
      state[action.payload.name] = action.payload.data;
    },
    clearEntities: (state, action: PayloadAction<keyof EntitiesState>) => {
      state[action.payload] = [];
    },
  },
});

export const { setEntities, clearEntities } = entitiesSlice.actions;
export default entitiesSlice.reducer;
