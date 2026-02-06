import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchGroupsByClub,
  fetchGroupById,
  fetchGroupSummary,
  createGroup,
  updateGroup,
  deleteGroup,
  addCoachToGroup,
  removeCoachFromGroup,
  addAthleteToGroup,
  removeAthleteFromGroup,
  addScheduleToGroup,
  removeScheduleFromGroup,
} from "./groupsThunk";

interface Group {
  _id: string;
  [key: string]: any;
}

interface GroupsState {
  items: Group[];
  selectedGroup: Group | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GroupsState = {
  items: [],
  selectedGroup: null,
  status: "idle",
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearGroups(state) {
      state.items = [];
      state.selectedGroup = null;
      state.status = "idle";
      state.error = null;
    },
    // Actualiza campos de un evento dentro del grupo seleccionado
    updateEventInSelectedGroup(
      state,
      action: PayloadAction<{ eventId: string; changes: Record<string, any> }>,
    ) {
      const { eventId, changes } = action.payload;
      if (!state.selectedGroup || !state.selectedGroup.events_added) return;
      state.selectedGroup.events_added = state.selectedGroup.events_added.map(
        (evt: any) => (evt._id === eventId ? { ...evt, ...changes } : evt),
      );

      // Also sync into items list if present
      const idx = state.items.findIndex(
        (g) => g._id === state.selectedGroup!._id,
      );
      if (idx >= 0) {
        state.items[idx] = {
          ...state.items[idx],
          events_added: state.selectedGroup.events_added,
        } as any;
      }
    },
    setSelectedGroup(state, action: PayloadAction<Group | null>) {
      state.selectedGroup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGroupsByClub
      .addCase(fetchGroupsByClub.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchGroupsByClub.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.status = "succeeded";
          state.items = action.payload || [];
        },
      )
      .addCase(fetchGroupsByClub.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetchGroupById
      .addCase(fetchGroupById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchGroupById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.selectedGroup = action.payload;
        },
      )
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // fetchGroupSummary
      .addCase(fetchGroupSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchGroupSummary.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.selectedGroup = action.payload;
        },
      )
      .addCase(fetchGroupSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // createGroup
      .addCase(createGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // updateGroup
      .addCase(updateGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selectedGroup?._id === action.payload._id) {
          state.selectedGroup = action.payload;
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // deleteGroup
      .addCase(deleteGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items = state.items.filter((i) => i._id !== action.payload.id);
        if (state.selectedGroup?._id === action.payload.id) {
          state.selectedGroup = null;
        }
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // addCoachToGroup
      .addCase(addCoachToGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addCoachToGroup.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedGroup?._id === action.payload._id) {
            state.selectedGroup = action.payload;
          }
        },
      )
      .addCase(addCoachToGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // removeCoachFromGroup
      .addCase(removeCoachFromGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        removeCoachFromGroup.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedGroup?._id === action.payload._id) {
            state.selectedGroup = action.payload;
          }
        },
      )
      .addCase(removeCoachFromGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // addAthleteToGroup
      .addCase(addAthleteToGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addAthleteToGroup.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedGroup?._id === action.payload._id) {
            state.selectedGroup = action.payload;
          }
        },
      )
      .addCase(addAthleteToGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // removeAthleteFromGroup
      .addCase(removeAthleteFromGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        removeAthleteFromGroup.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedGroup?._id === action.payload._id) {
            state.selectedGroup = action.payload;
          }
        },
      )
      .addCase(removeAthleteFromGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // addScheduleToGroup
      .addCase(addScheduleToGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        addScheduleToGroup.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedGroup?._id === action.payload._id) {
            state.selectedGroup = action.payload;
          }
        },
      )
      .addCase(addScheduleToGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // removeScheduleFromGroup
      .addCase(removeScheduleFromGroup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        removeScheduleFromGroup.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          const idx = state.items.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (idx >= 0) state.items[idx] = action.payload;
          if (state.selectedGroup?._id === action.payload._id) {
            state.selectedGroup = action.payload;
          }
        },
      )
      .addCase(removeScheduleFromGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
    // levels are handled by clubsSlice (club.levels)
  },
});

export const { clearGroups, setSelectedGroup, updateEventInSelectedGroup } =
  groupsSlice.actions;
export default groupsSlice.reducer;
