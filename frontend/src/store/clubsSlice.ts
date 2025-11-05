import { createSlice } from "@reduxjs/toolkit";
import type { Club } from "../pages/Clubs/interfaces/clubTypes";
import {
  fetchClubs,
  createClub,
  deleteClub,
  updateClub,
  findClubById,
  assignAssistants,
  softDeleteClub,
  restoreClub,
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
      state.selectedClub = null;
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
      state.clubs = state.clubs.filter((u) => u._id !== action.payload); // Remove club from the list
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

    // ASSIGN ASSISTANTS
    builder.addCase(assignAssistants.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(assignAssistants.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updated = action.payload as Club;
      const index = state.clubs.findIndex((c) => c._id === updated._id);
      if (index >= 0) state.clubs[index] = updated;
      // update selectedClub if currently open
      if (state.selectedClub && state.selectedClub._id === updated._id) {
        state.selectedClub = updated;
      }
    });
    builder.addCase(assignAssistants.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // SOFT DELETE
    builder.addCase(softDeleteClub.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(softDeleteClub.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.clubs.findIndex((u) => u._id === action.payload);
      if (index >= 0) {
        state.clubs[index].active = false; // Mark club as inactive

        // Check current user's role
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.role !== "superadmin") {
          // Remove inactive club from the list if not superadmin
          state.clubs.splice(index, 1);
        }
      }
    });
    builder.addCase(softDeleteClub.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // RESTORE
    builder.addCase(restoreClub.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(restoreClub.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.clubs.findIndex((u) => u._id === action.payload._id);
      if (index >= 0) state.clubs[index] = action.payload as Club;
    });
    builder.addCase(restoreClub.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearClubs } = clubsSlice.actions;
export default clubsSlice.reducer;
