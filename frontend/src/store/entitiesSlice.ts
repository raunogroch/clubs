import { createSlice } from "@reduxjs/toolkit";
import type { Schedule } from "../pages/Schedule/types/scheduleTypes";
import type { Sport } from "../pages/Sports/interfaces/sportTypes";
import type { User } from "../pages/Users/interfaces/userTypes";
import { fetchEntities } from "./entitiesThunks";

interface EntitiesState {
  sports: Sport[];
  coaches: User[];
  athletes: User[];
  schedules: Schedule[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EntitiesState = {
  sports: [],
  coaches: [],
  athletes: [],
  schedules: [],
  status: "idle",
  error: null,
};

const entitiesSlice = createSlice({
  name: "entities",
  initialState,
  reducers: {
    clearEntities: (state) => {
      state.sports = [];
      state.coaches = [];
      state.athletes = [];
      state.schedules = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEntities.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchEntities.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.coaches = action.payload.coaches;
      state.athletes = action.payload.athletes;
      state.sports = action.payload.sports;
      state.schedules = action.payload.schedules;
    });
    builder.addCase(fetchEntities.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearEntities } = entitiesSlice.actions;
export default entitiesSlice.reducer;
