import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUsersByRole,
  createUser,
  updateUser,
  deleteUser,
} from "./usersThunk";

interface UserState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  items: [],
  status: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersByRole.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUsersByRole.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.status = "succeeded";
          state.items = action.payload || [];
        },
      )
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as any)?.message || action.error.message || "Error";
      })
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as any)?.message || action.error.message || "Error";
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as any)?.message || action.error.message || "Error";
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.items = state.items.filter((i) => i._id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as any)?.message || action.error.message || "Error";
      });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
