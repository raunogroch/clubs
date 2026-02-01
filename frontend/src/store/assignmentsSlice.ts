import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllAssignments,
  fetchMyAssignments,
  fetchAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  checkModuleAccess,
} from "./assignmentsThunk";

interface Assignment {
  _id: string;
  [key: string]: any;
}

interface AssignmentsState {
  items: Assignment[];
  selectedAssignment: Assignment | null;
  moduleAccess: Record<string, boolean>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AssignmentsState = {
  items: [],
  selectedAssignment: null,
  moduleAccess: {},
  status: "idle",
  error: null,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    clearAssignments(state) {
      state.items = [];
      state.selectedAssignment = null;
      state.status = "idle";
      state.error = null;
    },
    setSelectedAssignment(state, action: PayloadAction<Assignment | null>) {
      state.selectedAssignment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllAssignments
      .addCase(fetchAllAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAllAssignments.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.status = "succeeded";
          state.items = action.payload || [];
        },
      )
      .addCase(fetchAllAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetchMyAssignments
      .addCase(fetchMyAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchMyAssignments.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.status = "succeeded";
          state.items = action.payload || [];
        },
      )
      .addCase(fetchMyAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetchAssignmentById
      .addCase(fetchAssignmentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAssignmentById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.selectedAssignment = action.payload;
        },
      )
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // createAssignment
      .addCase(createAssignment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createAssignment.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.items.push(action.payload);
        },
      )
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // updateAssignment
      .addCase(updateAssignment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateAssignment.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedAssignment?._id === action.payload._id) {
            state.selectedAssignment = action.payload;
          }
        },
      )
      .addCase(updateAssignment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // deleteAssignment
      .addCase(deleteAssignment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        deleteAssignment.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.items = state.items.filter((i) => i._id !== action.payload.id);
          if (state.selectedAssignment?._id === action.payload.id) {
            state.selectedAssignment = null;
          }
        },
      )
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // checkModuleAccess
      .addCase(checkModuleAccess.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        checkModuleAccess.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.moduleAccess[action.payload.module] = action.payload.hasAccess;
        },
      )
      .addCase(checkModuleAccess.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearAssignments, setSelectedAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
