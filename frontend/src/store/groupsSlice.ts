import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGroups,
  createGroup,
  deleteGroup,
  updateGroup,
  findGroupById,
} from "./groupsThunks";
import type { IGroup } from "../pages/groups/interface/groupTypes";

interface GroupsState {
  selectedGroup: IGroup | null;
  groups: IGroup[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GroupsState = {
  selectedGroup: null,
  groups: [],
  status: "idle",
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearGroups: (state) => {
      state.selectedGroup = null;
      state.groups = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.groups = action.payload;
    });
    builder.addCase(fetchGroups.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(createGroup.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.status = "succeeded";
      if (action.payload) {
        state.groups.push(action.payload);
      }
    });
    builder.addCase(createGroup.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(updateGroup.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateGroup.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.groups.findIndex((g) => g._id === action.payload._id);
      if (index >= 0) state.groups[index] = action.payload;
    });
    builder.addCase(updateGroup.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(deleteGroup.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteGroup.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.groups = state.groups.filter((g) => g._id !== action.payload);
    });
    builder.addCase(deleteGroup.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(findGroupById.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(findGroupById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedGroup = action.payload;
    });
    builder.addCase(findGroupById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
