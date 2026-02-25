import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllClubs,
  fetchClubById,
  createClub,
  updateClub,
  deleteClub,
  fetchAssignmentAssistants,
} from "./clubsThunk";
import { addClubLevel, updateClubLevel, deleteClubLevel } from "./levelsThunk";

interface Club {
  _id: string;
  [key: string]: any;
}

interface ClubsState {
  items: Club[];
  selectedClub: Club | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: any;
  // listado de asistentes agrupados por club para las asignaciones del admin
  assignmentAssistants: any[];
  assignmentAssistantsStatus: "idle" | "loading" | "succeeded" | "failed";
  assignmentAssistantsError: string | null;
}

const initialState: ClubsState = {
  items: [],
  selectedClub: null,
  status: "idle",
  error: null,
  assignmentAssistants: [],
  assignmentAssistantsStatus: "idle",
  assignmentAssistantsError: null,
};

const clubsSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    clearClubs(state) {
      state.items = [];
      state.selectedClub = null;
      state.status = "idle";
      state.error = null;
    },
    setSelectedClub(state, action: PayloadAction<Club | null>) {
      state.selectedClub = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllClubs
      .addCase(fetchAllClubs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllClubs.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.status = "succeeded";
          state.items = action.payload || [];
        },
      )
      .addCase(fetchAllClubs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // puede ser objeto {message, status}
      })
      // fetchClubById
      .addCase(fetchClubById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchClubById.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.selectedClub = action.payload;
      })
      .addCase(fetchClubById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // createClub
      .addCase(createClub.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createClub.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createClub.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // updateClub
      .addCase(updateClub.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateClub.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selectedClub?._id === action.payload._id) {
          state.selectedClub = action.payload;
        }
      })
      .addCase(updateClub.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // deleteClub
      .addCase(deleteClub.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteClub.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items = state.items.filter((i) => i._id !== action.payload.id);
        if (state.selectedClub?._id === action.payload.id) {
          state.selectedClub = null;
        }
      })
      .addCase(deleteClub.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // nuevo thunk de asistentes por asignación
    builder
      .addCase(fetchAssignmentAssistants.pending, (state) => {
        state.assignmentAssistantsStatus = "loading";
        state.assignmentAssistantsError = null;
      })
      .addCase(
        fetchAssignmentAssistants.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.assignmentAssistantsStatus = "succeeded";
          state.assignmentAssistants = action.payload || [];
        },
      )
      .addCase(fetchAssignmentAssistants.rejected, (state, action) => {
        state.assignmentAssistantsStatus = "failed";
        state.assignmentAssistantsError = action.payload as string;
      });

    // handle club levels actions
    builder
      .addCase(addClubLevel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addClubLevel.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selectedClub?._id === action.payload._id)
          state.selectedClub = action.payload;
      })
      .addCase(addClubLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateClubLevel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateClubLevel.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedClub?._id === action.payload._id)
            state.selectedClub = action.payload;
        },
      )
      .addCase(updateClubLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteClubLevel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteClubLevel.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedClub?._id === action.payload._id)
            state.selectedClub = action.payload;
        },
      )
      .addCase(deleteClubLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearClubs, setSelectedClub } = clubsSlice.actions;
export default clubsSlice.reducer;
