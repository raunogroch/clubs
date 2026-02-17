import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSchedulesByGroupId,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  replaceBatchSchedules,
  fetchAdminSchedules,
} from "./schedulesThunk";

interface Schedule {
  _id: string;
  group_id: string;
  day: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SchedulesState {
  items: Schedule[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SchedulesState = {
  items: [],
  status: "idle",
  error: null,
};

/**
 * Ordena los schedules por día (Lunes a Domingo)
 */
const sortSchedulesByDay = (schedules: Schedule[]): Schedule[] => {
  const dayOrder: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  return [...schedules].sort((a, b) => {
    const dayDiff = (dayOrder[a.day] || 0) - (dayOrder[b.day] || 0);
    if (dayDiff !== 0) return dayDiff;
    // Si es el mismo día, ordenar por hora de inicio
    return a.startTime.localeCompare(b.startTime);
  });
};

const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    clearSchedules(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSchedulesByGroupId
      .addCase(fetchSchedulesByGroupId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchSchedulesByGroupId.fulfilled,
        (state, action: PayloadAction<Schedule[]>) => {
          state.status = "succeeded";
          state.items = sortSchedulesByDay(action.payload || []);
        },
      )
      .addCase(fetchSchedulesByGroupId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // createSchedule
      .addCase(createSchedule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createSchedule.fulfilled,
        (state, action: PayloadAction<Schedule>) => {
          state.status = "succeeded";
          state.items.push(action.payload);
          state.items = sortSchedulesByDay(state.items);
        },
      )
      .addCase(createSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // updateSchedule
      .addCase(updateSchedule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateSchedule.fulfilled,
        (state, action: PayloadAction<Schedule>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) {
            state.items[idx] = action.payload;
          }
          state.items = sortSchedulesByDay(state.items);
        },
      )
      .addCase(updateSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // deleteSchedule
      .addCase(deleteSchedule.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteSchedule.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.items = state.items.filter((i) => i._id !== action.payload);
        },
      )
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // replaceBatchSchedules
      .addCase(replaceBatchSchedules.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        replaceBatchSchedules.fulfilled,
        (state, action: PayloadAction<Schedule[]>) => {
          state.status = "succeeded";
          state.items = sortSchedulesByDay(action.payload || []);
        },
      )
      .addCase(replaceBatchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetchAdminSchedules
      .addCase(fetchAdminSchedules.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAdminSchedules.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.status = "succeeded";
          // Transform admin schedules to Schedule format if needed
          state.items = action.payload || [];
        },
      )
      .addCase(fetchAdminSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearSchedules } = schedulesSlice.actions;
export default schedulesSlice.reducer;
