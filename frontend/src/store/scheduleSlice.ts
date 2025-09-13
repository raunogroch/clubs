import { createSlice } from "@reduxjs/toolkit";

import {
  fetchSchedules,
  createSchedule,
  deleteSchedule,
  updateSchedule,
  findScheduleById,
} from "./scheduleThunks";
import type { Schedule } from "../pages/Schedule/types/scheduleTypes";

interface SchedulesState {
  selectedSchedule: any;
  schedules: Schedule[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SchedulesState = {
  selectedSchedule: null,
  schedules: [],
  status: "idle",
  error: null,
};

const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    clearSchedules: (state) => {
      state.selectedSchedule = null;
      state.schedules = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchSchedules.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchSchedules.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.schedules = action.payload;
    });
    builder.addCase(fetchSchedules.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createSchedule.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createSchedule.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload) {
        state.schedules.push(action.payload as Schedule);
      }
    });
    builder.addCase(createSchedule.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateSchedule.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateSchedule.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.schedules.findIndex(
        (u) => u._id === action.payload._id
      );
      if (index >= 0) state.schedules[index] = action.payload as Schedule;
    });
    builder.addCase(updateSchedule.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteSchedule.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteSchedule.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.schedules = state.schedules.filter((u) => u._id !== action.payload);
    });
    builder.addCase(deleteSchedule.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // FIND BY ID
    builder.addCase(findScheduleById.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(findScheduleById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedSchedule = action.payload;
    });
    builder.addCase(findScheduleById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
