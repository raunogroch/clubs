import { createSlice } from "@reduxjs/toolkit";
import type { Club } from "../pages/Clubs/interfaces/clubTypes";
import {
  fetchClubs,
  createClub,
  deleteClub,
  updateClub,
  findClubById,
} from "./clubsThunks";

interface ClubsState {
  selectedClub: any;
  clubs: Club[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ClubsState = {
  selectedClub: null,
  clubs: [],
  status: "idle",
  error: null,
};

const clubsSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    clearClubs: (state) => {
      state.clubs = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchClubs.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchClubs.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.clubs = action.payload;
    });
    builder.addCase(fetchClubs.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createClub.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createClub.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload) {
        state.clubs.push(action.payload as Club);
      }
    });
    builder.addCase(createClub.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateClub.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateClub.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.clubs.findIndex((u) => u._id === action.payload._id);
      if (index >= 0) state.clubs[index] = action.payload as Club;
    });
    builder.addCase(updateClub.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteClub.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteClub.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.clubs = state.clubs.filter((u) => u._id !== action.payload);
    });
    builder.addCase(deleteClub.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // FIND BY ID
    builder.addCase(findClubById.pending, (state) => {
      state.status = "loading";
    });
    // DEBERÍA SER:
    builder.addCase(findClubById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedClub = action.payload;
    });
    builder.addCase(findClubById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearClubs } = clubsSlice.actions;
export default clubsSlice.reducer;
