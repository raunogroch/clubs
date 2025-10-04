import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSports,
  createSport,
  deleteSport,
  updateSport,
  findSportById,
  restoreSport,
} from "./sportsThunks";
import type { Sport } from "../pages/Sports/interfaces";

interface SportsState {
  selectedSport: any;
  sports: Sport[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SportsState = {
  selectedSport: null,
  sports: [],
  status: "idle",
  error: null,
};

const sportsSlice = createSlice({
  name: "sports",
  initialState,
  reducers: {
    clearSports: (state) => {
      state.selectedSport = null;
      state.sports = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchSports.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchSports.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.sports = action.payload;
    });
    builder.addCase(fetchSports.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createSport.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createSport.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload) {
        state.sports.push(action.payload as Sport);
      }
    });
    builder.addCase(createSport.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateSport.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateSport.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.sports.findIndex((u) => u._id === action.payload._id);
      if (index >= 0) state.sports[index] = action.payload as Sport;
    });
    builder.addCase(updateSport.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteSport.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteSport.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.sports = state.sports.filter((u) => u._id !== action.payload);
    });
    builder.addCase(deleteSport.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // RESTORE
    builder.addCase(restoreSport.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(restoreSport.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.sports.findIndex((u) => u._id === action.payload._id);
      if (index >= 0) state.sports[index] = action.payload as Sport;
    });
    builder.addCase(restoreSport.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // FIND BY ID
    builder.addCase(findSportById.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(findSportById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedSport = action.payload;
    });
    builder.addCase(findSportById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearSports } = sportsSlice.actions;
export default sportsSlice.reducer;
