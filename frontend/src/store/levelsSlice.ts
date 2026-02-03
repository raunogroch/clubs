import { createSlice } from "@reduxjs/toolkit";
import { addClubLevel, updateClubLevel, deleteClubLevel } from "./levelsThunk";

interface LevelsState {
  loading: boolean;
  error: string | null;
}

const initialState: LevelsState = {
  loading: false,
  error: null,
};

const levelsSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    clearLevelError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addClubLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClubLevel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addClubLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateClubLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClubLevel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateClubLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteClubLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClubLevel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteClubLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLevelError } = levelsSlice.actions;
export default levelsSlice.reducer;
